package com.hireiq.service;

import com.hireiq.ai.GeminiAIService;
import com.hireiq.dto.request.AnswerRequest;
import com.hireiq.dto.request.StartInterviewRequest;
import com.hireiq.dto.response.*;
import com.hireiq.exception.ForbiddenException;
import com.hireiq.exception.NotFoundException;
import com.hireiq.model.*;
import com.hireiq.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewRepository interviewRepo;
    private final InterviewAnswerRepository answerRepo;
    private final UserStatsRepository statsRepo;
    private final GeminiAIService ai;
    private final SimpMessagingTemplate ws;

    public InterviewSessionResponse startInterview(User user, StartInterviewRequest req) {
        List<GeneratedQuestion> questions = ai.generateQuestions(
            req.getTargetRole(), req.getInterviewType(), req.getDifficulty(),
            req.getQuestionCount(), req.getCompanyStyle() != null ? req.getCompanyStyle() : "Standard"
        );
        Interview interview = Interview.builder()
            .user(user)
            .title("Interview - " + req.getTargetRole())
            .targetRole(req.getTargetRole())
            .companyStyle(req.getCompanyStyle())
            .interviewType(safeInterviewType(req.getInterviewType()))
            .difficulty(safeDifficulty(req.getDifficulty()))
            .totalQuestions(questions.size())
            .startedAt(LocalDateTime.now())
            .build();
        interview = interviewRepo.save(interview);
        for (int i = 0; i < questions.size(); i++) {
            GeneratedQuestion q = questions.get(i);
            answerRepo.save(InterviewAnswer.builder()
                .interview(interview)
                .questionText(q.getQuestion())
                .questionCategory(q.getCategory())
                .questionType(q.getType())
                .position(i)
                .grade(InterviewAnswer.AnswerGrade.SKIPPED)
                .build());
        }
        return InterviewSessionResponse.builder()
            .interviewId(interview.getId())
            .questions(questions)
            .startedAt(interview.getStartedAt())
            .build();
    }

    public AnswerEvaluationResponse submitAnswer(User user, Long interviewId, AnswerRequest req) {
        Interview interview = getInterviewForUser(user, interviewId);
        if (interview.getStatus() != Interview.InterviewStatus.IN_PROGRESS) {
            throw new IllegalStateException("Interview is not in progress");
        }
        AnswerEvaluationResponse eval = ai.evaluateAnswer(
            req.getQuestionText(), req.getAnswerText(), interview.getTargetRole(),
            req.getIdealAnswer(), req.getKeywords(), interview.getDifficulty().name()
        );
        InterviewAnswer answer = answerRepo
            .findByInterviewIdAndPosition(interviewId, req.getPosition())
            .orElseGet(() -> InterviewAnswer.builder()
                .interview(interview)
                .questionText(req.getQuestionText())
                .position(req.getPosition())
                .build());
        answer.setAnswerText(req.getAnswerText());
        answer.setScore(eval.getScore());
        try {
            answer.setGrade(InterviewAnswer.AnswerGrade.valueOf(eval.getGrade().toUpperCase()));
        } catch (Exception e) {
            answer.setGrade(InterviewAnswer.AnswerGrade.AVERAGE);
        }
        answer.setAiFeedback(eval.getFeedback());
        answer.setStrengthNote(eval.getStrengthNote());
        answer.setImprovementNote(eval.getImprovementNote());
        answer.setKeywordHits(eval.getKeywordHits());
        answer.setKeywordMisses(eval.getKeywordMisses());
        answer.setConfidenceScore(eval.getConfidenceScore());
        try {
            answer.setSentiment(InterviewAnswer.Sentiment.valueOf(eval.getSentiment().toUpperCase()));
        } catch (Exception e) {
            answer.setSentiment(InterviewAnswer.Sentiment.NEUTRAL);
        }
        answer.setModelAnswer(eval.getModelAnswer());
        answer.setFollowUpQ(eval.getFollowUpQuestion());
        answer.setTimeTakenSecs(req.getTimeTakenSecs());
        answerRepo.save(answer);
        interview.setCompletedCount(interview.getCompletedCount() + 1);
        interviewRepo.save(interview);
        try {
            ws.convertAndSendToUser(user.getEmail(), "/queue/interview-progress",
                Map.of("position", req.getPosition(), "score", eval.getScore()));
        } catch (Exception e) {
            log.warn("WebSocket send failed: {}", e.getMessage());
        }
        return eval;
    }

    public void skipQuestion(User user, Long interviewId, int position) {
        Interview interview = getInterviewForUser(user, interviewId);
        answerRepo.findByInterviewIdAndPosition(interviewId, position).ifPresent(a -> {
            a.setGrade(InterviewAnswer.AnswerGrade.SKIPPED);
            a.setScore(0);
            answerRepo.save(a);
        });
        interview.setSkippedCount(interview.getSkippedCount() + 1);
        interviewRepo.save(interview);
    }

    public InterviewReportResponse completeInterview(User user, Long interviewId) {
        Interview interview = getInterviewForUser(user, interviewId);
        List<InterviewAnswer> answers = answerRepo.findByInterviewIdOrderByPosition(interviewId);
        List<Integer> scores = answers.stream()
            .filter(a -> a.getGrade() != InterviewAnswer.AnswerGrade.SKIPPED)
            .map(InterviewAnswer::getScore)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        double avg = scores.isEmpty() ? 0 : scores.stream().mapToInt(i -> i).average().orElse(0);
        int durationSecs = (int)(System.currentTimeMillis() / 1000 -
            interview.getStartedAt().toEpochSecond(java.time.ZoneOffset.UTC));
        List<String> weakAreas = answers.stream()
            .filter(a -> a.getScore() != null && a.getScore() < 50)
            .map(InterviewAnswer::getQuestionCategory)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());
        InterviewReportResponse.AISummary aiSummary = ai.generateFinalReport(
            interview.getTargetRole(), scores, interview.getSkippedCount(), weakAreas, durationSecs
        );
        interview.setStatus(Interview.InterviewStatus.COMPLETED);
        interview.setOverallScore(java.math.BigDecimal.valueOf(avg));
        interview.setAiSummary(aiSummary.getSummary() != null ? 
            aiSummary.getSummary().substring(0, Math.min(1000, aiSummary.getSummary().length())) : "");
        interview.setStrengths(aiSummary.getStrengths() != null && !aiSummary.getStrengths().isEmpty() ?
            String.join(" | ", aiSummary.getStrengths()) : "Good attempt");
        interview.setWeaknesses(aiSummary.getWeaknesses() != null && !aiSummary.getWeaknesses().isEmpty() ?
            String.join(" | ", aiSummary.getWeaknesses()) : "Continue practicing");
        interview.setImprovementPlan(aiSummary.getImprovementPlan() != null ?
            aiSummary.getImprovementPlan().substring(0, Math.min(1000, aiSummary.getImprovementPlan().length())) : "");
        try {
            String level = aiSummary.getReadinessLevel() != null ?
                aiSummary.getReadinessLevel().toUpperCase() : "DEVELOPING";
            interview.setReadinessLevel(Interview.ReadinessLevel.valueOf(level));
        } catch (Exception e) {
            interview.setReadinessLevel(Interview.ReadinessLevel.DEVELOPING);
        }
        interview.setDurationSecs(durationSecs);
        interview.setCompletedAt(LocalDateTime.now());
        interviewRepo.save(interview);
        updateUserStats(user, scores, avg, answers, durationSecs);
        return buildReport(interview, answers, aiSummary, scores, avg);
    }

    @Transactional(readOnly = true)
    public InterviewReportResponse getReport(User user, Long interviewId) {
        Interview interview = getInterviewForUser(user, interviewId);
        List<InterviewAnswer> answers = answerRepo.findByInterviewIdOrderByPosition(interviewId);
        List<Integer> scores = answers.stream()
            .filter(a -> a.getScore() != null)
            .map(InterviewAnswer::getScore)
            .collect(Collectors.toList());
        double avg = scores.isEmpty() ? 0 : scores.stream().mapToInt(i -> i).average().orElse(0);
        InterviewReportResponse.AISummary summary = InterviewReportResponse.AISummary.builder()
            .summary(interview.getAiSummary())
            .improvementPlan(interview.getImprovementPlan())
            .readinessLevel(interview.getReadinessLevel() != null
                ? interview.getReadinessLevel().name() : "DEVELOPING")
            .build();
        return buildReport(interview, answers, summary, scores, avg);
    }

    @Transactional(readOnly = true)
    public Page<InterviewSummaryResponse> listInterviews(User user, Pageable pageable) {
        return interviewRepo.findByUserOrderByStartedAtDesc(user, pageable).map(this::toSummary);
    }

    private Interview getInterviewForUser(User user, Long id) {
        Interview interview = interviewRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Interview not found"));
        if (!interview.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Access denied");
        }
        return interview;
    }

    private Interview.InterviewType safeInterviewType(String type) {
        try {
            return Interview.InterviewType.valueOf(type.toUpperCase());
        } catch (Exception e) {
            return Interview.InterviewType.MIXED;
        }
    }

    private Interview.Difficulty safeDifficulty(String difficulty) {
        try {
            return Interview.Difficulty.valueOf(difficulty.toUpperCase());
        } catch (Exception e) {
            return Interview.Difficulty.MEDIUM;
        }
    }

    private void updateUserStats(User user, List<Integer> scores,
                                  double avg, List<InterviewAnswer> answers, int duration) {
        try {
            UserStats stats = statsRepo.findByUserId(user.getId())
                .orElseGet(() -> UserStats.builder().user(user).build());
            stats.setTotalInterviews(stats.getTotalInterviews() + 1);
            stats.setTotalQuestions(stats.getTotalQuestions() + answers.size());
            double newAvg = ((stats.getAvgScore().doubleValue() * (stats.getTotalInterviews() - 1)) + avg)
                / stats.getTotalInterviews();
            stats.setAvgScore(java.math.BigDecimal.valueOf(newAvg));
            if (avg > stats.getBestScore().doubleValue()) {
                stats.setBestScore(java.math.BigDecimal.valueOf(avg));
            }
            stats.setTotalTimeMins(stats.getTotalTimeMins() + duration / 60);
            stats.setLastPracticeDate(java.time.LocalDate.now());
            statsRepo.save(stats);
        } catch (Exception e) {
            log.warn("Stats update failed: {}", e.getMessage());
        }
    }

    private InterviewReportResponse buildReport(Interview i, List<InterviewAnswer> answers,
            InterviewReportResponse.AISummary summary, List<Integer> scores, double avg) {
        return InterviewReportResponse.builder()
            .interviewId(i.getId())
            .targetRole(i.getTargetRole())
            .interviewType(i.getInterviewType().name())
            .difficulty(i.getDifficulty().name())
            .status(i.getStatus().name())
            .totalQuestions(i.getTotalQuestions())
            .completedCount(i.getCompletedCount())
            .skippedCount(i.getSkippedCount())
            .overallScore((int) Math.round(avg))
            .strongAnswers((int) scores.stream().filter(s -> s >= 70).count())
            .averageAnswers((int) scores.stream().filter(s -> s >= 40 && s < 70).count())
            .weakAnswers((int) scores.stream().filter(s -> s < 40).count())
            .durationSecs(i.getDurationSecs())
            .startedAt(i.getStartedAt())
            .completedAt(i.getCompletedAt())
            .aiSummary(summary)
            .answers(answers.stream().map(this::toAnswerResponse).collect(Collectors.toList()))
            .build();
    }

    private AnswerDetailResponse toAnswerResponse(InterviewAnswer a) {
        return AnswerDetailResponse.builder()
            .id(a.getId()).position(a.getPosition())
            .questionText(a.getQuestionText()).questionCategory(a.getQuestionCategory())
            .answerText(a.getAnswerText()).score(a.getScore())
            .grade(a.getGrade() != null ? a.getGrade().name() : "SKIPPED")
            .aiFeedback(a.getAiFeedback()).strengthNote(a.getStrengthNote())
            .improvementNote(a.getImprovementNote())
            .keywordHits(a.getKeywordHits()).keywordMisses(a.getKeywordMisses())
            .confidenceScore(a.getConfidenceScore()).modelAnswer(a.getModelAnswer())
            .followUpQ(a.getFollowUpQ()).timeTakenSecs(a.getTimeTakenSecs())
            .build();
    }

    private InterviewSummaryResponse toSummary(Interview i) {
        return InterviewSummaryResponse.builder()
            .id(i.getId()).title(i.getTitle()).targetRole(i.getTargetRole())
            .interviewType(i.getInterviewType().name()).difficulty(i.getDifficulty().name())
            .status(i.getStatus().name())
            .overallScore(i.getOverallScore() != null ? i.getOverallScore().intValue() : null)
            .totalQuestions(i.getTotalQuestions()).completedCount(i.getCompletedCount())
            .startedAt(i.getStartedAt()).completedAt(i.getCompletedAt())
            .build();
    }
}

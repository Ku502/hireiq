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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepo;
    private final InterviewAnswerRepository answerRepo;
    private final UserStatsRepository statsRepo;
    private final SkillScoreRepository skillRepo;
    private final GeminiAIService ai;
    private final SimpMessagingTemplate ws;

    public InterviewSessionResponse startInterview(User user, StartInterviewRequest req) {
        List<GeneratedQuestion> questions = ai.generateQuestions(
            req.getTargetRole(), req.getInterviewType(), req.getDifficulty(),
            req.getQuestionCount(), req.getCompanyStyle() != null ? req.getCompanyStyle() : "Standard"
        );

        Interview interview = Interview.builder()
            .user(user)
            .title("Interview — " + req.getTargetRole())
            .targetRole(req.getTargetRole())
            .companyStyle(req.getCompanyStyle())
            .interviewType(Interview.InterviewType.valueOf(req.getInterviewType()))
            .difficulty(Interview.Difficulty.valueOf(req.getDifficulty()))
            .totalQuestions(questions.size())
            .startedAt(LocalDateTime.now())
            .build();
        interview = interviewRepo.save(interview);

        for (int i = 0; i < questions.size(); i++) {
            GeneratedQuestion q = questions.get(i);
            InterviewAnswer placeholder = InterviewAnswer.builder()
                .interview(interview)
                .questionText(q.getQuestion())
                .questionCategory(q.getCategory())
                .questionType(q.getType())
                .position(i)
                .grade(InterviewAnswer.AnswerGrade.SKIPPED)
                .build();
            answerRepo.save(placeholder);
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
        answer.setGrade(InterviewAnswer.AnswerGrade.valueOf(eval.getGrade()));
        answer.setAiFeedback(eval.getFeedback());
        answer.setStrengthNote(eval.getStrengthNote());
        answer.setImprovementNote(eval.getImprovementNote());
        answer.setKeywordHits(eval.getKeywordHits());
        answer.setKeywordMisses(eval.getKeywordMisses());
        answer.setConfidenceScore(eval.getConfidenceScore());
        answer.setSentiment(InterviewAnswer.Sentiment.valueOf(eval.getSentiment()));
        answer.setModelAnswer(eval.getModelAnswer());
        answer.setFollowUpQ(eval.getFollowUpQuestion());
        answer.setTimeTakenSecs(req.getTimeTakenSecs());
        answerRepo.save(answer);

        interview.setCompletedCount(interview.getCompletedCount() + 1);
        interviewRepo.save(interview);

        ws.convertAndSendToUser(user.getEmail(), "/queue/interview-progress",
            Map.of("position", req.getPosition(), "score", eval.getScore()));

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
        interview.setAiSummary(aiSummary.getSummary());
        interview.setStrengths(aiSummary.getStrengths());
        interview.setWeaknesses(aiSummary.getWeaknesses());
        interview.setImprovementPlan(aiSummary.getImprovementPlan());
        interview.setReadinessLevel(Interview.ReadinessLevel.valueOf(aiSummary.getReadinessLevel()));
        interview.setDurationSecs(durationSecs);
        interview.setCompletedAt(LocalDateTime.now());
        interviewRepo.save(interview);

        updateUserStats(user, scores, avg, interview.getTargetRole(), answers, durationSecs);

        return buildReport(interview, answers, aiSummary, scores, avg);
    }

    @Transactional(readOnly = true)
    public InterviewReportResponse getReport(User user, Long interviewId) {
        Interview interview = getInterviewForUser(user, interviewId);
        List<InterviewAnswer> answers = answerRepo.findByInterviewIdOrderByPosition(interviewId);
        List<Integer> scores = answers.stream()
            .filter(a -> a.getScore() != null).map(InterviewAnswer::getScore).collect(Collectors.toList());
        double avg = scores.isEmpty() ? 0 : scores.stream().mapToInt(i -> i).average().orElse(0);
        InterviewReportResponse.AISummary summary = InterviewReportResponse.AISummary.builder()
            .summary(interview.getAiSummary())
            .strengths(interview.getStrengths())
            .weaknesses(interview.getWeaknesses())
            .improvementPlan(interview.getImprovementPlan())
            .readinessLevel(interview.getReadinessLevel() != null ? interview.getReadinessLevel().name() : "DEVELOPING")
            .build();
        return buildReport(interview, answers, summary, scores, avg);
    }

    @Transactional(readOnly = true)
    public Page<InterviewSummaryResponse> listInterviews(User user, Pageable pageable) {
        return interviewRepo.findByUserOrderByStartedAtDesc(user, pageable)
            .map(this::toSummary);
    }

    private Interview getInterviewForUser(User user, Long id) {
        Interview interview = interviewRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Interview not f

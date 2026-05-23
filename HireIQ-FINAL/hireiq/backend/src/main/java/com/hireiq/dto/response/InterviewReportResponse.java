package com.hireiq.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewReportResponse {
    private Long interviewId;
    private String targetRole;
    private String interviewType;
    private String difficulty;
    private String status;
    private int totalQuestions;
    private int completedCount;
    private int skippedCount;
    private int overallScore;
    private int strongAnswers;
    private int averageAnswers;
    private int weakAnswers;
    private Integer durationSecs;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private AISummary aiSummary;
    private List<AnswerDetailResponse> answers;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AISummary {
        private String summary;
        private List<String> strengths;
        private List<String> weaknesses;
        private String improvementPlan;
        private List<String> recommendedTopics;
        private String readinessLevel;
        private String week1Plan;
        private String week2Plan;
    }
}

// ══════════════════════════════════════════════════════════════════════════════

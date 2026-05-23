package com.hireiq.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewSummaryResponse {
    private Long id;
    private String title;
    private String targetRole;
    private String interviewType;
    private String difficulty;
    private String status;
    private Integer overallScore;
    private int totalQuestions;
    private int completedCount;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

// ══════════════════════════════════════════════════════════════════════════════

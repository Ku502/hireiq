package com.hireiq.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsResponse {
    private int totalInterviews;
    private BigDecimal avgScore;
    private BigDecimal bestScore;
    private int streakDays;
    private int totalTimeMins;
    private String lastPracticeDate;
}

// ══════════════════════════════════════════════════════════════════════════════

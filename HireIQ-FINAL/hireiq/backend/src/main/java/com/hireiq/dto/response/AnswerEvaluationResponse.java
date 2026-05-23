package com.hireiq.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AnswerEvaluationResponse {
    private int score;
    private String grade;
    private String feedback;
    private String strengthNote;
    private String improvementNote;
    private List<String> keywordHits;
    private List<String> keywordMisses;
    private int confidenceScore;
    private String sentiment;
    private String modelAnswer;
    private String followUpQuestion;
    private boolean skipped;

    public static AnswerEvaluationResponse skipped() {
        return AnswerEvaluationResponse.builder()
            .score(0).grade("SKIPPED").feedback("Question skipped.")
            .skipped(true).sentiment("NEUTRAL").build();
    }

    public static AnswerEvaluationResponse error() {
        return AnswerEvaluationResponse.builder()
            .score(50).grade("AVERAGE")
            .feedback("Evaluation unavailable. Please review manually.")
            .skipped(false).sentiment("NEUTRAL").build();
    }
}

// ══════════════════════════════════════════════════════════════════════════════

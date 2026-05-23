package com.hireiq.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AnswerDetailResponse {
    private Long id;
    private int position;
    private String questionText;
    private String questionCategory;
    private String answerText;
    private Integer score;
    private String grade;
    private String aiFeedback;
    private String strengthNote;
    private String improvementNote;
    private List<String> keywordHits;
    private List<String> keywordMisses;
    private Integer confidenceScore;
    private String modelAnswer;
    private String followUpQ;
    private Integer timeTakenSecs;
}

// ══════════════════════════════════════════════════════════════════════════════

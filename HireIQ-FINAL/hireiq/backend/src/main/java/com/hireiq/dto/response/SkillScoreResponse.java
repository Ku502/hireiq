package com.hireiq.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SkillScoreResponse {
    private String domain;
    private int score;
    private String level;
}

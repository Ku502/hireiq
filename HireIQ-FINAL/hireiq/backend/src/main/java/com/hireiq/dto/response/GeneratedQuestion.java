package com.hireiq.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GeneratedQuestion {
    private String question;
    private String category;
    private String type;
    private String difficulty;
    private List<String> keywords;
    private String idealAnswer;
    private String followUp;
}

// ══════════════════════════════════════════════════════════════════════════════

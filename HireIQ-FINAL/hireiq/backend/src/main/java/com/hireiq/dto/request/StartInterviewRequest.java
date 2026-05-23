package com.hireiq.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StartInterviewRequest {
    @NotBlank String targetRole;
    @NotBlank String interviewType;   // TECHNICAL | BEHAVIORAL | HR | MIXED | SYSTEM_DESIGN
    @NotBlank String difficulty;      // EASY | MEDIUM | HARD | EXPERT
    String companyStyle;              // Standard | FAANG | Startup | Product | Service
    @Min(1) @Max(15) int questionCount;
}

// ══════════════════════════════════════════════════════════════════════════════

package com.hireiq.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InterviewSessionResponse {
    private Long interviewId;
    private List<GeneratedQuestion> questions;
    private LocalDateTime startedAt;
}

// ══════════════════════════════════════════════════════════════════════════════

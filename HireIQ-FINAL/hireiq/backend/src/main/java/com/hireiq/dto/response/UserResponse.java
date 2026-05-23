package com.hireiq.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String username;
    private String avatarUrl;
    private String plan;
    private String targetRole;
    private String experienceLevel;
}

// ══════════════════════════════════════════════════════════════════════════════

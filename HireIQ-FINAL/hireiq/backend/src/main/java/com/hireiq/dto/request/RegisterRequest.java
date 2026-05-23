package com.hireiq.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank String fullName;
    @NotBlank @Size(min=3,max=30) String username;
    @NotBlank @Email String email;
    @NotBlank @Size(min=8) String password;
    String targetRole;
    String experienceLevel;
}

// ══════════════════════════════════════════════════════════════════════════════

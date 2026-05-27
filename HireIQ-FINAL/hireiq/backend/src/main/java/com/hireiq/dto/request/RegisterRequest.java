package com.hireiq.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank
    private String fullName;

    @NotBlank @Size(min=3, max=30)
    private String username;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min=8)
    private String password;

    private String targetRole;
    private String experienceLevel;

    public String getFullName()        { return fullName; }
    public String getUsername()        { return username; }
    public String getEmail()           { return email; }
    public String getPassword()        { return password; }
    public String getTargetRole()      { return targetRole; }
    public String getExperienceLevel() { return experienceLevel; }

    public void setFullName(String v)        { this.fullName = v; }
    public void setUsername(String v)        { this.username = v; }
    public void setEmail(String v)           { this.email = v; }
    public void setPassword(String v)        { this.password = v; }
    public void setTargetRole(String v)      { this.targetRole = v; }
    public void setExperienceLevel(String v) { this.experienceLevel = v; }
}

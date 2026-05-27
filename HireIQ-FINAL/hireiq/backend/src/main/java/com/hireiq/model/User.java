package com.hireiq.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    public enum Plan { FREE, PRO, ENTERPRISE }
    public enum ExperienceLevel { FRESHER, JUNIOR, MID, SENIOR }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Plan plan;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "target_role")
    private String targetRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "is_active")
    private Boolean isActive;

    public User() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User o = new User();
        public Builder id(Long v)                        { o.id = v; return this; }
        public Builder email(String v)                   { o.email = v; return this; }
        public Builder passwordHash(String v)            { o.passwordHash = v; return this; }
        public Builder fullName(String v)                { o.fullName = v; return this; }
        public Builder username(String v)                { o.username = v; return this; }
        public Builder avatarUrl(String v)               { o.avatarUrl = v; return this; }
        public Builder plan(Plan v)                      { o.plan = v; return this; }
        public Builder isVerified(Boolean v)             { o.isVerified = v; return this; }
        public Builder resumeUrl(String v)               { o.resumeUrl = v; return this; }
        public Builder targetRole(String v)              { o.targetRole = v; return this; }
        public Builder experienceLevel(ExperienceLevel v){ o.experienceLevel = v; return this; }
        public Builder lastLogin(LocalDateTime v)        { o.lastLogin = v; return this; }
        public Builder isActive(Boolean v)               { o.isActive = v; return this; }
        public User build()                              { return o; }
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.plan == null)            this.plan = Plan.FREE;
        if (this.isVerified == null)      this.isVerified = false;
        if (this.experienceLevel == null) this.experienceLevel = ExperienceLevel.FRESHER;
        if (this.isActive == null)        this.isActive = true;
    }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + plan.name()));
    }
    @Override public String getPassword()              { return passwordHash; }
    @Override public String getUsername()              { return email; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return Boolean.TRUE.equals(isActive); }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return Boolean.TRUE.equals(isActive); }

    public Long getId()                          { return id; }
    public String getEmail()                     { return email; }
    public String getPasswordHash()              { return passwordHash; }
    public String getFullName()                  { return fullName; }
    public String getAvatarUrl()                 { return avatarUrl; }
    public Plan getPlan()                        { return plan; }
    public Boolean getIsVerified()               { return isVerified; }
    public String getResumeUrl()                 { return resumeUrl; }
    public String getTargetRole()                { return targetRole; }
    public ExperienceLevel getExperienceLevel()  { return experienceLevel; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public LocalDateTime getLastLogin()          { return lastLogin; }
    public Boolean getIsActive()                 { return isActive; }

    public void setId(Long v)                        { this.id = v; }
    public void setEmail(String v)                   { this.email = v; }
    public void setPasswordHash(String v)            { this.passwordHash = v; }
    public void setFullName(String v)                { this.fullName = v; }
    public void setUsername(String v)                { this.username = v; }
    public void setAvatarUrl(String v)               { this.avatarUrl = v; }
    public void setPlan(Plan v)                      { this.plan = v; }
    public void setIsVerified(Boolean v)             { this.isVerified = v; }
    public void setResumeUrl(String v)               { this.resumeUrl = v; }
    public void setTargetRole(String v)              { this.targetRole = v; }
    public void setExperienceLevel(ExperienceLevel v){ this.experienceLevel = v; }
    public void setCreatedAt(LocalDateTime v)        { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)        { this.updatedAt = v; }
    public void setLastLogin(LocalDateTime v)        { this.lastLogin = v; }
    public void setIsActive(Boolean v)               { this.isActive = v; }
}

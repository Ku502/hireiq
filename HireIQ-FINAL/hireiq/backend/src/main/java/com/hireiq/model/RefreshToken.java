package com.hireiq.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    private Boolean revoked;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public RefreshToken() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final RefreshToken o = new RefreshToken();
        public Builder user(User v)              { o.user = v; return this; }
        public Builder token(String v)           { o.token = v; return this; }
        public Builder expiresAt(LocalDateTime v){ o.expiresAt = v; return this; }
        public Builder revoked(Boolean v)        { o.revoked = v; return this; }
        public RefreshToken build()              { return o; }
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.revoked == null)   this.revoked = false;
    }

    public boolean isExpired() { return LocalDateTime.now().isAfter(expiresAt); }

    public Long getId()                 { return id; }
    public User getUser()               { return user; }
    public String getToken()            { return token; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public Boolean getRevoked()         { return revoked; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long v)                  { this.id = v; }
    public void setUser(User v)                { this.user = v; }
    public void setToken(String v)             { this.token = v; }
    public void setExpiresAt(LocalDateTime v)  { this.expiresAt = v; }
    public void setRevoked(Boolean v)          { this.revoked = v; }
    public void setCreatedAt(LocalDateTime v)  { this.createdAt = v; }
}

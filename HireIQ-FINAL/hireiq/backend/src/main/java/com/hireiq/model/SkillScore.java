package com.hireiq.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_scores")
public class SkillScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private Double score;

    @Column(nullable = false)
    private String level;

    @Column(name = "questions_attempted")
    private int questionsAttempted;

    @Column(name = "last_tested")
    private LocalDateTime lastTested;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SkillScore() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SkillScore o = new SkillScore();
        public Builder user(User v)                 { o.user = v; return this; }
        public Builder skill(String v)              { o.skill = v; return this; }
        public Builder score(Double v)              { o.score = v; return this; }
        public Builder level(String v)              { o.level = v; return this; }
        public Builder questionsAttempted(int v)    { o.questionsAttempted = v; return this; }
        public Builder lastTested(LocalDateTime v)  { o.lastTested = v; return this; }
        public SkillScore build()                   { return o; }
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.score == null)     this.score = 0.0;
        if (this.level == null)     this.level = "BEGINNER";
        if (this.lastTested == null) this.lastTested = now;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId()                 { return id; }
    public User getUser()               { return user; }
    public String getSkill()            { return skill; }
    public Double getScore()            { return score; }
    public String getLevel()            { return level; }
    public int getQuestionsAttempted()  { return questionsAttempted; }
    public LocalDateTime getLastTested(){ return lastTested; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long v)                   { this.id = v; }
    public void setUser(User v)                 { this.user = v; }
    public void setSkill(String v)              { this.skill = v; }
    public void setScore(Double v)              { this.score = v; }
    public void setLevel(String v)              { this.level = v; }
    public void setQuestionsAttempted(int v)    { this.questionsAttempted = v; }
    public void setLastTested(LocalDateTime v)  { this.lastTested = v; }
    public void setCreatedAt(LocalDateTime v)   { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)   { this.updatedAt = v; }
}

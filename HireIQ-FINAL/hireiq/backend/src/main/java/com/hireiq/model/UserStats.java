package com.hireiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "total_interviews")
    private int totalInterviews;

    @Column(name = "total_questions")
    private int totalQuestions;

    @Column(name = "streak_days")
    private int streakDays;

    @Column(name = "total_time_mins")
    private int totalTimeMins;

    @Column(name = "avg_score", precision = 5, scale = 2)
    private BigDecimal avgScore;

    @Column(name = "best_score", precision = 5, scale = 2)
    private BigDecimal bestScore;

    @Column(name = "last_practice_date")
    private LocalDate lastPracticeDate;

    @Column(name = "last_interview_at")
    private LocalDateTime lastInterviewAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserStats() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserStats o = new UserStats();
        public Builder user(User v)                     { o.user = v; return this; }
        public Builder totalInterviews(int v)           { o.totalInterviews = v; return this; }
        public Builder totalQuestions(int v)            { o.totalQuestions = v; return this; }
        public Builder streakDays(int v)                { o.streakDays = v; return this; }
        public Builder totalTimeMins(int v)             { o.totalTimeMins = v; return this; }
        public Builder avgScore(BigDecimal v)           { o.avgScore = v; return this; }
        public Builder bestScore(BigDecimal v)          { o.bestScore = v; return this; }
        public Builder lastPracticeDate(LocalDate v)    { o.lastPracticeDate = v; return this; }
        public Builder lastInterviewAt(LocalDateTime v) { o.lastInterviewAt = v; return this; }
        public UserStats build()                        { return o; }
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.totalInterviews = 0;
        this.totalQuestions  = 0;
        this.streakDays      = 0;
        this.totalTimeMins   = 0;
        if (this.avgScore  == null) this.avgScore  = BigDecimal.ZERO;
        if (this.bestScore == null) this.bestScore = BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId()                      { return id; }
    public User getUser()                    { return user; }
    public int getTotalInterviews()          { return totalInterviews; }
    public int getTotalQuestions()           { return totalQuestions; }
    public int getStreakDays()               { return streakDays; }
    public int getTotalTimeMins()            { return totalTimeMins; }
    public BigDecimal getAvgScore()          { return avgScore; }
    public BigDecimal getBestScore()         { return bestScore; }
    public LocalDate getLastPracticeDate()   { return lastPracticeDate; }
    public LocalDateTime getLastInterviewAt(){ return lastInterviewAt; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }

    public void setId(Long v)                        { this.id = v; }
    public void setUser(User v)                      { this.user = v; }
    public void setTotalInterviews(int v)            { this.totalInterviews = v; }
    public void setTotalQuestions(int v)             { this.totalQuestions = v; }
    public void setStreakDays(int v)                 { this.streakDays = v; }
    public void setTotalTimeMins(int v)              { this.totalTimeMins = v; }
    public void setAvgScore(BigDecimal v)            { this.avgScore = v; }
    public void setBestScore(BigDecimal v)           { this.bestScore = v; }
    public void setLastPracticeDate(LocalDate v)     { this.lastPracticeDate = v; }
    public void setLastInterviewAt(LocalDateTime v)  { this.lastInterviewAt = v; }
    public void setCreatedAt(LocalDateTime v)        { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)        { this.updatedAt = v; }
}

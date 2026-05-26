package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

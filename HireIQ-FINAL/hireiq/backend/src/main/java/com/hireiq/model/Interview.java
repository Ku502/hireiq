package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    public enum InterviewType {
        TECHNICAL, BEHAVIORAL, MIXED, SYSTEM_DESIGN, HR
    }

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    public enum InterviewStatus {
        PENDING, IN_PROGRESS, COMPLETED, ABANDONED
    }

    public enum ReadinessLevel {
        BEGINNER, DEVELOPING, INTERMEDIATE, PROFICIENT, EXPERT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InterviewAnswer> answers;

    @Column(nullable = false)
    private String title;

    @Column(name = "target_role", nullable = false)
    private String targetRole;

    @Column(name = "company_style")
    private String companyStyle;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false)
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(name = "total_questions")
    private int totalQuestions;

    @Column(name = "completed_count")
    private int completedCount;

    @Column(name = "skipped_count")
    private int skippedCount;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "duration_secs")
    private int durationSecs;

    @Column(name = "total_time_mins")
    private int totalTimeMins;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "improvement_plan", columnDefinition = "TEXT")
    private String improvementPlan;

    @Enumerated(EnumType.STRING)
    @Column(name = "readiness_level")
    private ReadinessLevel readinessLevel;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.difficulty == null)    this.difficulty    = Difficulty.MEDIUM;
        if (this.status == null)        this.status        = InterviewStatus.IN_PROGRESS;
        if (this.interviewType == null) this.interviewType = InterviewType.MIXED;
        if (this.startedAt == null)     this.startedAt     = now;
        if (this.answers == null)       this.answers       = new ArrayList<>();
        this.completedCount = 0;
        this.skippedCount   = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

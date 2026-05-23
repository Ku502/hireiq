package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "interviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Interview {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;

    @Column(name = "target_role", nullable = false)
    private String targetRole;

    @Column(name = "company_style")
    private String companyStyle;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false)
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    @Builder.Default private Difficulty difficulty = Difficulty.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Builder.Default private InterviewStatus status = InterviewStatus.IN_PROGRESS;

    @Column(name = "total_questions", nullable = false) private Integer totalQuestions;
    @Column(name = "completed_count") @Builder.Default private Integer completedCount = 0;
    @Column(name = "skipped_count")   @Builder.Default private Integer skippedCount = 0;

    @Column(name = "overall_score", precision = 5, scale = 2) private BigDecimal overallScore;

    @Column(name = "ai_summary", columnDefinition = "TEXT") private String aiSummary;

    @JdbcTypeCode(SqlTypes.JSON) private List<String> strengths;
    @JdbcTypeCode(SqlTypes.JSON) private List<String> weaknesses;

    @Column(name = "improvement_plan", columnDefinition = "TEXT") private String improvementPlan;

    @Enumerated(EnumType.STRING)
    @Column(name = "readiness_level") private ReadinessLevel readinessLevel;

    @Column(name = "duration_secs") private Integer durationSecs;

    @Column(name = "started_at") @Builder.Default private LocalDateTime startedAt = LocalDateTime.now();
    @Column(name = "completed_at") private LocalDateTime completedAt;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default private List<InterviewAnswer> answers = new ArrayList<>();

    public enum InterviewType { TECHNICAL, BEHAVIORAL, HR, MIXED, SYSTEM_DESIGN }
    public enum Difficulty    { EASY, MEDIUM, HARD, EXPERT }
    public enum InterviewStatus { IN_PROGRESS, COMPLETED, ABANDONED }
    public enum ReadinessLevel  { NOT_READY, DEVELOPING, ALMOST_READY, INTERVIEW_READY }
}

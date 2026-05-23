package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "user_stats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "total_interviews")
    @Builder.Default
    private Integer totalInterviews = 0;

    @Column(name = "total_questions")
    @Builder.Default
    private Integer totalQuestions = 0;

    @Column(name = "avg_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal avgScore = BigDecimal.ZERO;

    @Column(name = "best_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal bestScore = BigDecimal.ZERO;

    @Column(name = "streak_days")
    @Builder.Default
    private Integer streakDays = 0;

    @Column(name = "last_practice_date")
    private LocalDate lastPracticeDate;

    @Column(name = "total_time_mins")
    @Builder.Default
    private Integer totalTimeMins = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> badges;
}

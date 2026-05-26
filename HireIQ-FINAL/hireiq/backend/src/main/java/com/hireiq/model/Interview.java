package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false)
    private String status;

    @Column(name = "total_questions")
    private int totalQuestions;

    @Column(name = "completed_count")
    private int completedCount;

    @Column(name = "skipped_count")
    private int skippedCount;

    @Column(name = "overall_score")
    private Double overallScore;

    @Column(name = "total_time_mins")
    private int totalTimeMins;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.difficulty == null) this.difficulty = "MEDIUM";
        if (this.status == null) this.status = "PENDING";
        if (this.startedAt == null) this.startedAt = now;
        if (this.answers == null) this.answers = new ArrayList<>();

        this.completedCount = 0;
        this.skippedCount = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

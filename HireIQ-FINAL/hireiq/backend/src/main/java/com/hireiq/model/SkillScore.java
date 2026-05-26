package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.score == null) this.score = 0.0;
        if (this.level == null) this.level = "BEGINNER";
        if (this.lastTested == null) this.lastTested = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

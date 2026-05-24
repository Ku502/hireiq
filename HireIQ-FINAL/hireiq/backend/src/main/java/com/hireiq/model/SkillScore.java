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
    private String domain;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private Level level;

    @Column(name = "last_tested")
    private LocalDateTime lastTested;

    @PrePersist
    public void prePersist() {
        if (score == null) score = 0;
        if (level == null) level = Level.NOVICE;
        if (lastTested == null) lastTested = LocalDateTime.now();
    }

    public enum Level {
        NOVICE, BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }
}

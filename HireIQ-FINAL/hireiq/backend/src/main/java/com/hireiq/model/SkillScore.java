package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "skill_scores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false) private String domain;
    @Builder.Default private int score = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default private Level level = Level.NOVICE;

    @Column(name = "last_tested")
    @Builder.Default private LocalDateTime lastTested = LocalDateTime.now();

    public enum Level { NOVICE, BEGINNER, INTERMEDIATE, ADVANCED, EXPERT }
}

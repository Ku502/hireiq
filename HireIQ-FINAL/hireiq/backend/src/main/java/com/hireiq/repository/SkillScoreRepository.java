package com.hireiq.repository;

import com.hireiq.model.SkillScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SkillScoreRepository extends JpaRepository<SkillScore, Long> {
    List<SkillScore> findByUserIdOrderByScoreDesc(Long userId);
    Optional<SkillScore> findByUserIdAndDomain(Long userId, String domain);
}

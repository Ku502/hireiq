package com.hireiq.service;

import com.hireiq.dto.response.DashboardStatsResponse;
import com.hireiq.dto.response.SkillScoreResponse;
import com.hireiq.model.User;
import com.hireiq.model.UserStats;
import com.hireiq.repository.SkillScoreRepository;
import com.hireiq.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Fix 8: Dashboard service now uses @Cacheable properly.
 * Stats cached 5 min, evicted when an interview completes.
 * InterviewService calls evictUserCache() after completeInterview().
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserStatsRepository statsRepo;
    private final SkillScoreRepository skillRepo;

    @Cacheable(value = "user-stats", key = "#user.id")
    public DashboardStatsResponse getStats(User user) {
        UserStats s = statsRepo.findByUserId(user.getId())
            .orElseGet(() -> UserStats.builder().user(user).build());
        return DashboardStatsResponse.builder()
            .totalInterviews(s.getTotalInterviews())
            .avgScore(s.getAvgScore() != null ? s.getAvgScore() : BigDecimal.ZERO)
            .bestScore(s.getBestScore() != null ? s.getBestScore() : BigDecimal.ZERO)
            .streakDays(s.getStreakDays())
            .totalTimeMins(s.getTotalTimeMins())
            .lastPracticeDate(s.getLastPracticeDate() != null ? s.getLastPracticeDate().toString() : null)
            .build();
    }

    @Cacheable(value = "skills", key = "#user.id")
    public List<SkillScoreResponse> getSkills(User user) {
        return skillRepo.findByUserIdOrderByScoreDesc(user.getId()).stream()
            .map(s -> SkillScoreResponse.builder()
                .domain(s.getDomain()).score(s.getScore()).level(s.getLevel().name())
                .build())
            .collect(Collectors.toList());
    }

    // Called by InterviewService after interview completes
    @CacheEvict(value = {"user-stats", "skills"}, key = "#userId")
    public void evictUserCache(Long userId) {
        // annotation does the work
    }
}

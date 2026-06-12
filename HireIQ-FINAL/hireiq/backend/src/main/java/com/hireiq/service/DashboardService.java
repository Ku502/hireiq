package com.hireiq.service;

import com.hireiq.dto.response.DashboardStatsResponse;
import com.hireiq.dto.response.SkillScoreResponse;
import com.hireiq.model.User;
import com.hireiq.model.UserStats;
import com.hireiq.repository.SkillScoreRepository;
import com.hireiq.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserStatsRepository statsRepo;
    private final SkillScoreRepository skillRepo;

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

    public List<SkillScoreResponse> getSkills(User user) {
        return skillRepo.findByUserIdOrderByScoreDesc(user.getId()).stream()
            .map(s -> {
                SkillScoreResponse r = new SkillScoreResponse();
                r.setDomain(s.getSkill());
                r.setScore(s.getScore() != null ? s.getScore().intValue() : 0);
                r.setLevel(s.getLevel());
                return r;
            })
            .collect(Collectors.toList());
    }
}

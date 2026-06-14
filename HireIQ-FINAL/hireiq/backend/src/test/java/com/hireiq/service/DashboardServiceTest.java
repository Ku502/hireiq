package com.hireiq.service;

import com.hireiq.dto.response.DashboardStatsResponse;
import com.hireiq.model.User;
import com.hireiq.model.UserStats;
import com.hireiq.repository.SkillScoreRepository;
import com.hireiq.repository.UserStatsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock private UserStatsRepository statsRepo;
    @Mock private SkillScoreRepository skillRepo;

    @InjectMocks
    private DashboardService dashboardService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@hireiq.com");
        mockUser.setFullName("Test User");
    }

    @Test
    void getStats_whenUserHasStats_shouldReturnCorrectValues() {
        // Arrange
        UserStats stats = UserStats.builder()
            .user(mockUser)
            .totalInterviews(5)
            .avgScore(BigDecimal.valueOf(72.5))
            .bestScore(BigDecimal.valueOf(88.0))
            .streakDays(3)
            .totalTimeMins(120)
            .build();

        when(statsRepo.findByUserId(1L)).thenReturn(Optional.of(stats));

        // Act
        DashboardStatsResponse response = dashboardService.getStats(mockUser);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalInterviews()).isEqualTo(5);
        assertThat(response.getAvgScore()).isEqualByComparingTo(BigDecimal.valueOf(72.5));
        assertThat(response.getBestScore()).isEqualByComparingTo(BigDecimal.valueOf(88.0));
        assertThat(response.getStreakDays()).isEqualTo(3);
    }

    @Test
    void getStats_whenUserHasNoStats_shouldReturnZeroDefaults() {
        // Arrange
        when(statsRepo.findByUserId(1L)).thenReturn(Optional.empty());

        // Act
        DashboardStatsResponse response = dashboardService.getStats(mockUser);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalInterviews()).isEqualTo(0);
        assertThat(response.getAvgScore()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getBestScore()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void getStats_whenScoresAreNull_shouldReturnZeroDefaults() {
        // Arrange
        UserStats stats = UserStats.builder()
            .user(mockUser)
            .totalInterviews(2)
            .avgScore(null)
            .bestScore(null)
            .build();

        when(statsRepo.findByUserId(1L)).thenReturn(Optional.of(stats));

        // Act
        DashboardStatsResponse response = dashboardService.getStats(mockUser);

        // Assert
        assertThat(response.getAvgScore()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getBestScore()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void getSkills_whenNoSkills_shouldReturnEmptyList() {
        // Arrange
        when(skillRepo.findByUserIdOrderByScoreDesc(1L)).thenReturn(List.of());

        // Act
        var skills = dashboardService.getSkills(mockUser);

        // Assert
        assertThat(skills).isNotNull();
        assertThat(skills).isEmpty();
    }
}

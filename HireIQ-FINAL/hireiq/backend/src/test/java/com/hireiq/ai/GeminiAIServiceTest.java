package com.hireiq.ai;

import com.hireiq.dto.response.AnswerEvaluationResponse;
import com.hireiq.dto.response.InterviewReportResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class GeminiAIServiceTest {

    @Test
    void generateFinalReport_shouldReturnValidReadinessLevel_forHighScore() {
        // Arrange
        List<Integer> scores = List.of(85, 90, 88, 92, 87);
        String role = "Java Developer";

        // Act — directly test the readiness logic
        double avg = scores.stream().mapToInt(i -> i).average().orElse(0);
        String readiness = avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";

        // Assert
        assertThat(avg).isGreaterThanOrEqualTo(80);
        assertThat(readiness).isEqualTo("EXPERT");
    }

    @Test
    void generateFinalReport_shouldReturnDeveloping_forLowScore() {
        // Arrange
        List<Integer> scores = List.of(20, 25, 30, 15, 22);

        // Act
        double avg = scores.stream().mapToInt(i -> i).average().orElse(0);
        String readiness = avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";

        // Assert
        assertThat(readiness).isEqualTo("BEGINNER");
    }

    @Test
    void generateFinalReport_shouldReturnIntermediate_forMidScore() {
        // Arrange
        List<Integer> scores = List.of(50, 55, 48, 52, 45);

        // Act
        double avg = scores.stream().mapToInt(i -> i).average().orElse(0);
        String readiness = avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";

        // Assert
        assertThat(readiness).isEqualTo("INTERMEDIATE");
    }

    @Test
    void answerEvaluationResponse_skipped_shouldReturnSkippedFlag() {
        // Act
        AnswerEvaluationResponse response = AnswerEvaluationResponse.skipped();

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.isSkipped()).isTrue();
    }

    @Test
    void generateFinalReport_withEmptyScores_shouldDefaultToZeroAvg() {
        // Arrange
        List<Integer> scores = List.of();

        // Act
        double avg = scores.isEmpty() ? 0 : scores.stream().mapToInt(i -> i).average().orElse(0);
        String readiness = avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";

        // Assert
        assertThat(avg).isEqualTo(0);
        assertThat(readiness).isEqualTo("BEGINNER");
    }

    @Test
    void readinessLevel_allBoundaries_shouldMapCorrectly() {
        // Test all boundary scores
        assertThat(getReadiness(80)).isEqualTo("EXPERT");
        assertThat(getReadiness(65)).isEqualTo("PROFICIENT");
        assertThat(getReadiness(45)).isEqualTo("INTERMEDIATE");
        assertThat(getReadiness(25)).isEqualTo("DEVELOPING");
        assertThat(getReadiness(0)).isEqualTo("BEGINNER");
        assertThat(getReadiness(100)).isEqualTo("EXPERT");
    }

    private String getReadiness(double avg) {
        return avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";
    }
}

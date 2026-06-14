package com.hireiq.service;

import com.hireiq.ai.GeminiAIService;
import com.hireiq.dto.request.StartInterviewRequest;
import com.hireiq.dto.response.GeneratedQuestion;
import com.hireiq.dto.response.InterviewSessionResponse;
import com.hireiq.model.Interview;
import com.hireiq.model.User;
import com.hireiq.repository.InterviewAnswerRepository;
import com.hireiq.repository.InterviewRepository;
import com.hireiq.repository.UserStatsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock private InterviewRepository interviewRepo;
    @Mock private InterviewAnswerRepository answerRepo;
    @Mock private UserStatsRepository statsRepo;
    @Mock private GeminiAIService ai;
    @Mock private SimpMessagingTemplate ws;
    @Mock private DashboardService dashboardService;

    @InjectMocks
    private InterviewService interviewService;

    private User mockUser;
    private StartInterviewRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@hireiq.com");
        mockUser.setFullName("Test User");

        mockRequest = new StartInterviewRequest();
        mockRequest.setTargetRole("Java Developer");
        mockRequest.setInterviewType("TECHNICAL");
        mockRequest.setDifficulty("MEDIUM");
        mockRequest.setQuestionCount(3);
        mockRequest.setCompanyStyle("Standard");
    }

    @Test
    void startInterview_shouldReturnSessionWithQuestions() {
        // Arrange
        List<GeneratedQuestion> mockQuestions = List.of(
            GeneratedQuestion.builder()
                .question("What is polymorphism?")
                .category("OOP")
                .type("TECHNICAL")
                .difficulty("MEDIUM")
                .keywords(List.of("polymorphism", "inheritance"))
                .idealAnswer("Polymorphism allows objects of different types to be treated as the same type.")
                .build(),
            GeneratedQuestion.builder()
                .question("Explain Java collections framework.")
                .category("Collections")
                .type("TECHNICAL")
                .difficulty("MEDIUM")
                .keywords(List.of("ArrayList", "HashMap", "List"))
                .idealAnswer("Java collections provide data structures like List, Set, and Map.")
                .build()
        );

        Interview savedInterview = new Interview();
        savedInterview.setId(1L);

        when(ai.generateQuestions(anyString(), anyString(), anyString(), anyInt(), anyString()))
            .thenReturn(mockQuestions);
        when(interviewRepo.save(any(Interview.class))).thenReturn(savedInterview);

        // Act
        InterviewSessionResponse response = interviewService.startInterview(mockUser, mockRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getInterviewId()).isEqualTo(1L);
        assertThat(response.getQuestions()).hasSize(2);
        assertThat(response.getQuestions().get(0).getQuestion()).isEqualTo("What is polymorphism?");
    }

    @Test
    void startInterview_shouldHandleEmptyQuestionsGracefully() {
        // Arrange
        Interview savedInterview = new Interview();
        savedInterview.setId(2L);

        when(ai.generateQuestions(anyString(), anyString(), anyString(), anyInt(), anyString()))
            .thenReturn(List.of());
        when(interviewRepo.save(any(Interview.class))).thenReturn(savedInterview);

        // Act
        InterviewSessionResponse response = interviewService.startInterview(mockUser, mockRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getQuestions()).isEmpty();
    }

    @Test
    void startInterview_shouldSetCorrectTargetRole() {
        // Arrange
        Interview savedInterview = new Interview();
        savedInterview.setId(3L);

        when(ai.generateQuestions(anyString(), anyString(), anyString(), anyInt(), anyString()))
            .thenReturn(List.of());
        when(interviewRepo.save(any(Interview.class))).thenReturn(savedInterview);

        // Act
        InterviewSessionResponse response = interviewService.startInterview(mockUser, mockRequest);

        // Assert
        assertThat(response.getInterviewId()).isEqualTo(3L);
    }
}

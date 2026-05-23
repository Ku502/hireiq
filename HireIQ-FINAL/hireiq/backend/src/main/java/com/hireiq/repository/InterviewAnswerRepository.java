package com.hireiq.repository;

import com.hireiq.model.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {
    List<InterviewAnswer> findByInterviewIdOrderByPosition(Long interviewId);
    Optional<InterviewAnswer> findByInterviewIdAndPosition(Long interviewId, Integer position);
}

// ══════════════════════════════════════════════════════════════════════════════

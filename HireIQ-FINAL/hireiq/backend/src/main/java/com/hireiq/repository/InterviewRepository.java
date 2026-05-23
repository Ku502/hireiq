package com.hireiq.repository;

import com.hireiq.model.Interview;
import com.hireiq.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Page<Interview> findByUserOrderByStartedAtDesc(User user, Pageable pageable);
}

// ══════════════════════════════════════════════════════════════════════════════

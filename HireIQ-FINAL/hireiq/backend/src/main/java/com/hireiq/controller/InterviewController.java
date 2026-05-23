package com.hireiq.controller;

import com.hireiq.dto.request.AnswerRequest;
import com.hireiq.dto.request.StartInterviewRequest;
import com.hireiq.dto.response.*;
import com.hireiq.model.User;
import com.hireiq.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    /** Start a new interview session — AI generates questions */
    @PostMapping("/start")
    public ResponseEntity<InterviewSessionResponse> start(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StartInterviewRequest req) {
        return ResponseEntity.ok(interviewService.startInterview(user, req));
    }

    /** Submit an answer — AI evaluates instantly */
    @PostMapping("/{id}/answer")
    public ResponseEntity<AnswerEvaluationResponse> submitAnswer(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody AnswerRequest req) {
        return ResponseEntity.ok(interviewService.submitAnswer(user, id, req));
    }

    /** Skip current question */
    @PostMapping("/{id}/skip")
    public ResponseEntity<Void> skip(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam int position) {
        interviewService.skipQuestion(user, id, position);
        return ResponseEntity.ok().build();
    }

    /** Complete interview and generate full AI report */
    @PostMapping("/{id}/complete")
    public ResponseEntity<InterviewReportResponse> complete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(interviewService.completeInterview(user, id));
    }

    /** Get single interview report */
    @GetMapping("/{id}/report")
    public ResponseEntity<InterviewReportResponse> getReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getReport(user, id));
    }

    /** List all user interviews (paginated) */
    @GetMapping
    public ResponseEntity<Page<InterviewSummaryResponse>> list(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(interviewService.listInterviews(user, pageable));
    }
}

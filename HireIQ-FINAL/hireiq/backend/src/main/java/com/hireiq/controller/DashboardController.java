package com.hireiq.controller;

import com.hireiq.dto.response.DashboardStatsResponse;
import com.hireiq.dto.response.SkillScoreResponse;
import com.hireiq.model.User;
import com.hireiq.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> stats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getStats(user));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillScoreResponse>> skills(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getSkills(user));
    }
}

// ══════════════════════════════════════════════════════════════════════════════

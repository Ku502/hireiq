package com.hireiq.controller;

import com.hireiq.dto.response.MCQResponse;
import com.hireiq.model.User;
import com.hireiq.service.PracticeService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
@Validated
public class PracticeController {

    private final PracticeService practiceService;

    @GetMapping("/mcq")
    public ResponseEntity<List<MCQResponse>> generateMCQ(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "Java Developer") @NotBlank String role,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int count,
            @RequestParam(defaultValue = "MIXED") String difficulty) {
        return ResponseEntity.ok(practiceService.generateMCQ(role, count, difficulty));
    }
}

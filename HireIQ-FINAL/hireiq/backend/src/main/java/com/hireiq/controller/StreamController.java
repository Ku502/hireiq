package com.hireiq.controller;

import com.hireiq.ai.GeminiAIService;
import com.hireiq.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Real-time streaming feedback via Server-Sent Events (Spring MVC SseEmitter).
 * Compatible with Spring MVC + WebSocket (no WebFlux conflict).
 */
@RestController
@RequestMapping("/stream")
@RequiredArgsConstructor
@Slf4j
public class StreamController {

    private final GeminiAIService geminiService;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    @GetMapping(value = "/evaluate", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvaluation(
            @AuthenticationPrincipal User user,
            @RequestParam String question,
            @RequestParam String answer,
            @RequestParam String role) {

        SseEmitter emitter = new SseEmitter(30_000L);

        executor.execute(() -> {
            try {
                // Collect streaming tokens and send each one
                geminiService.streamEvaluation(question, answer, role)
                    .doOnNext(token -> {
                        try {
                            emitter.send(SseEmitter.event()
                                .name("token")
                                .data(token));
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    })
                    .doOnComplete(() -> {
                        try {
                            emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                            emitter.complete();
                        } catch (IOException e) {
                            log.warn("SSE complete error: {}", e.getMessage());
                        }
                    })
                    .doOnError(e -> emitter.completeWithError(e))
                    .blockLast();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}

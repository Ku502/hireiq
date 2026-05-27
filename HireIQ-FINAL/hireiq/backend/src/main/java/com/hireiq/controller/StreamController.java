package com.hireiq.controller;

import com.hireiq.ai.GeminiAIService;
import com.hireiq.model.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/stream")
@RequiredArgsConstructor
public class StreamController {

    private static final Logger log = LoggerFactory.getLogger(StreamController.class);

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

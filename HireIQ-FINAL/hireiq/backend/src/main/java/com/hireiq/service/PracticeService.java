package com.hireiq.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hireiq.dto.response.MCQResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PracticeService {

    private static final Logger log = LoggerFactory.getLogger(PracticeService.class);
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    @Value("${ai.groq.api-key}") private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public List<MCQResponse> generateMCQ(String role, int count, String difficulty) {
        // Cap at 50 to avoid token limits
        int safeCount = Math.min(count, 50);

        String prompt = String.format("""
            Generate exactly %d multiple choice questions for a %s interview at %s difficulty.
            Each question must have exactly 4 options with only one correct answer.
            Return ONLY a valid JSON array, no markdown, no explanation:
            [
              {
                "id": 1,
                "question": "What is ...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": 0,
                "explanation": "Brief explanation of why the answer is correct",
                "difficulty": "EASY",
                "category": "Core Java"
              }
            ]
            Rules:
            - "answer" is the 0-based index of the correct option (0, 1, 2, or 3)
            - Make questions specific and technical for %s role
            - Vary the difficulty if MIXED is selected
            - Each question must be unique
            - Keep options concise (under 10 words each)
            - Difficulty options: EASY, MEDIUM, HARD
            """, safeCount, role, difficulty, role);

        try {
            Map<String, Object> body = Map.of(
                "model", MODEL,
                "max_tokens", 4000,
                "temperature", 0.8,
                "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            String response = webClient.post()
                .uri(GROQ_URL)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(30));

            JsonNode node = objectMapper.readTree(response);
            String raw = node.path("choices").get(0)
                .path("message").path("content").asText("[]");

            // Extract JSON array
            raw = raw.trim()
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();
            int start = raw.indexOf('[');
            int end = raw.lastIndexOf(']');
            if (start == -1 || end == -1) return fallbackMCQ(role, safeCount);
            raw = raw.substring(start, end + 1);

            JsonNode arr = objectMapper.readTree(raw);
            List<MCQResponse> questions = new ArrayList<>();
            int idx = 1;
            for (JsonNode q : arr) {
                List<String> options = new ArrayList<>();
                q.path("options").forEach(o -> options.add(o.asText()));
                if (options.size() != 4) continue;

                int answerIdx = q.path("answer").asInt(0);
                if (answerIdx < 0 || answerIdx > 3) answerIdx = 0;

                questions.add(MCQResponse.builder()
                    .id(idx++)
                    .question(q.path("question").asText())
                    .options(options)
                    .answer(answerIdx)
                    .explanation(q.path("explanation").asText(""))
                    .difficulty(q.path("difficulty").asText(difficulty))
                    .category(q.path("category").asText("General"))
                    .build());
            }

            if (questions.isEmpty()) return fallbackMCQ(role, safeCount);
            return questions;

        } catch (Exception e) {
            log.error("MCQ generation failed: {}", e.getMessage());
            return fallbackMCQ(role, safeCount);
        }
    }

    private List<MCQResponse> fallbackMCQ(String role, int count) {
        List<MCQResponse> fallback = new ArrayList<>();
        String[][] qa = {
            {"What does OOP stand for?", "Object-Oriented Programming", "Open-Oriented Protocol", "Object-Oriented Protocol", "Online-Oriented Programming", "0", "OOP stands for Object-Oriented Programming, a paradigm based on objects."},
            {"What is a stack data structure?", "FIFO queue", "LIFO structure", "Random access array", "Linked list", "1", "A stack follows Last In First Out (LIFO) principle."},
            {"What does SQL stand for?", "Structured Query Language", "Simple Query Logic", "Standard Query List", "System Query Language", "0", "SQL stands for Structured Query Language used for database operations."},
            {"What is recursion?", "A loop construct", "A function calling itself", "A data structure", "An algorithm", "1", "Recursion is when a function calls itself to solve smaller subproblems."},
            {"What is Big O notation?", "A math formula", "Algorithm complexity measure", "A programming language", "A data type", "1", "Big O notation describes the time/space complexity of an algorithm."},
        };
        for (int i = 0; i < Math.min(count, qa.length); i++) {
            String[] q = qa[i];
            fallback.add(MCQResponse.builder()
                .id(i + 1)
                .question(q[0])
                .options(List.of(q[1], q[2], q[3], q[4]))
                .answer(Integer.parseInt(q[5]))
                .explanation(q[6])
                .difficulty("EASY")
                .category("General")
                .build());
        }
        return fallback;
    }
}

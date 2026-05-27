package com.hireiq.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hireiq.dto.response.AnswerEvaluationResponse;
import com.hireiq.dto.response.GeneratedQuestion;
import com.hireiq.dto.response.InterviewReportResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiAIService {

    @Value("${ai.gemini.api-key}") private String apiKey;
    @Value("${ai.gemini.model:gemini-1.5-flash-latest}") private String model;
    @Value("${ai.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}") private String baseUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    // FIX 1: @Cacheable - same role+type+difficulty reuses Redis cache (1 hour TTL)
    @Cacheable(value = "questions", key = "#role + '_' + #type + '_' + #difficulty + '_' + #count + '_' + #company")
    public List<GeneratedQuestion> generateQuestions(
            String role, String type, String difficulty, int count, String company) {

        String prompt = """
            You are an elite %s interviewer%s.
            Generate exactly %d %s interview questions for a %s role at %s difficulty.
            Return ONLY a JSON array, no markdown, no preamble:
            [{"question":"...","category":"OOP|Collections|Spring|SQL|DSA|System Design|Behavioral|HR","type":"%s","difficulty":"%s","keywords":["k1","k2","k3","k4"],"idealAnswer":"2-3 sentence model answer","followUp":"One intelligent follow-up"}]
            Rules: make questions specific, non-generic, production-scenario based. Vary difficulty within the set.
            """.formatted(
                company.equals("FAANG") ? "Google/Amazon" : company,
                company.equals("FAANG") ? " (bar-raiser level depth expected)" : "",
                count, type, role, difficulty, type, difficulty);

        String raw = callGeminiWithRetry(prompt, 2000);
        try {
            JsonNode arr = objectMapper.readTree(extractJson(raw));
            List<GeneratedQuestion> questions = new ArrayList<>();
            for (JsonNode q : arr) {
                questions.add(GeneratedQuestion.builder()
                        .question(q.path("question").asText())
                        .category(q.path("category").asText("General"))
                        .type(q.path("type").asText(type))
                        .difficulty(q.path("difficulty").asText(difficulty))
                        .keywords(toList(q.path("keywords")))
                        .idealAnswer(q.path("idealAnswer").asText(""))
                        .followUp(q.path("followUp").asText(""))
                        .build());
            }
            return questions;
        } catch (Exception e) {
            log.error("Question parse failed: {}", e.getMessage());
            return fallbackQuestions(role, count, type);
        }
    }

    // FIX 2: retry logic + FIX 3: input sanitization
    public AnswerEvaluationResponse evaluateAnswer(
            String question, String answer, String role,
            String idealAnswer, List<String> keywords, String difficulty) {

        if (answer == null || answer.isBlank()) return AnswerEvaluationResponse.skipped();

        String safeAnswer   = sanitize(answer);
        String safeQuestion = sanitize(question);

        String prompt = """
            You are a strict but fair %s interviewer. Evaluate this answer.
            Question: %s
            Difficulty: %s
            Candidate answer: %s
            Expected keywords: %s
            Ideal answer hint: %s
            Return ONLY valid JSON (no markdown):
            {"score":0-100,"grade":"EXCELLENT|GOOD|AVERAGE|POOR","feedback":"2-3 sentences specific actionable feedback","strengthNote":"one short phrase","improvementNote":"one short phrase","keywordHits":["matched"],"keywordMisses":["missed important ones"],"confidenceScore":0-100,"sentiment":"POSITIVE|NEUTRAL|NEGATIVE","modelAnswer":"ideal 3-4 sentence answer","followUpQuestion":"one smart follow-up"}
            Calibration: 0-29 wrong, 30-49 partial, 50-64 decent, 65-79 good, 80-89 strong, 90-100 expert.
            """.formatted(role, safeQuestion, difficulty, safeAnswer,
                keywords != null ? String.join(", ", keywords) : "none",
                idealAnswer != null ? idealAnswer : "not specified");

        String raw = callGeminiWithRetry(prompt, 1000);
        try {
            JsonNode root = objectMapper.readTree(extractJson(raw));
            return AnswerEvaluationResponse.builder()
                    .score(clamp(root.path("score").asInt(50), 0, 100))
                    .grade(root.path("grade").asText("AVERAGE"))
                    .feedback(root.path("feedback").asText("Good attempt."))
                    .strengthNote(root.path("strengthNote").asText(""))
                    .improvementNote(root.path("improvementNote").asText(""))
                    .keywordHits(toList(root.path("keywordHits")))
                    .keywordMisses(toList(root.path("keywordMisses")))
                    .confidenceScore(clamp(root.path("confidenceScore").asInt(50), 0, 100))
                    .sentiment(root.path("sentiment").asText("NEUTRAL"))
                    .modelAnswer(root.path("modelAnswer").asText(""))
                    .followUpQuestion(root.path("followUpQuestion").asText(""))
                    .skipped(false)
                    .build();
        } catch (Exception e) {
            log.error("Evaluation parse failed: {}", e.getMessage());
            return AnswerEvaluationResponse.error();
        }
    }

    // FIX 4: SSE streaming endpoint - feedback appears word by word
    public Flux<String> streamEvaluation(String question, String answer, String role) {
        String url = "%s/models/%s:streamGenerateContent?key=%s&alt=sse"
                .formatted(baseUrl, model, apiKey);

        String prompt = """
            You are a %s interviewer. The candidate answered: "%s"
            for the question: "%s"
            Give a 2-3 sentence spoken evaluation directly to them. Be specific and honest.
            """.formatted(role, sanitize(answer), sanitize(question));

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("temperature", 0.7, "maxOutputTokens", 300));

        return webClient.post().uri(url).bodyValue(body)
                .retrieve().bodyToFlux(String.class)
                .filter(line -> line.startsWith("data: "))
                .map(line -> line.substring(6).trim())
                .filter(data -> !data.equals("[DONE]") && !data.isBlank())
                .flatMap(data -> {
                    try {
                        JsonNode node = objectMapper.readTree(data);
                        String text = node.path("candidates").path(0)
                                .path("content").path("parts").path(0).path("text").asText("");
                        return Flux.just(text);
                    } catch (Exception e) { return Flux.empty(); }
                })
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(1)));
    }

    public InterviewReportResponse.AISummary generateFinalReport(
            String role, List<Integer> scores, int skipped,
            List<String> weakAreas, int totalTime) {

        double avg = scores.stream().mapToInt(i -> i).average().orElse(0);
        int strong = (int) scores.stream().filter(s -> s >= 70).count();
        int poor   = (int) scores.stream().filter(s -> s < 40).count();

        String prompt = """
            Senior career coach reviewing mock interview for %s candidate.
            Scores: %s | Average: %.1f | Strong: %d | Poor: %d | Skipped: %d | Time: %dm | Weak areas: %s
            Return ONLY valid JSON:
            {"summary":"3-4 sentence honest encouraging summary","strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"improvementPlan":"5-6 sentence concrete 2-week action plan","recommendedTopics":["t1","t2","t3","t4","t5"],"readinessLevel":"NOT_READY|DEVELOPING|ALMOST_READY|INTERVIEW_READY","weeklyPlan":{"week1":"specific daily focus week 1","week2":"specific daily focus week 2"}}
            """.formatted(role, scores.toString(), avg, strong, poor, skipped,
                totalTime / 60, String.join(", ", weakAreas));

        String raw = callGeminiWithRetry(prompt, 1200);
        try {
            JsonNode root = objectMapper.readTree(extractJson(raw));
            return InterviewReportResponse.AISummary.builder()
                    .summary(root.path("summary").asText())
                    .strengths(toList(root.path("strengths")))
                    .weaknesses(toList(root.path("weaknesses")))
                    .improvementPlan(root.path("improvementPlan").asText())
                    .recommendedTopics(toList(root.path("recommendedTopics")))
                    .readinessLevel(root.path("readinessLevel").asText("DEVELOPING"))
                    .week1Plan(root.path("weeklyPlan").path("week1").asText(""))
                    .week2Plan(root.path("weeklyPlan").path("week2").asText(""))
                    .build();
        } catch (Exception e) {
            log.error("Summary parse failed: {}", e.getMessage());
            return InterviewReportResponse.AISummary.builder()
                    .summary("Interview complete. Review each answer feedback for improvement.")
                    .readinessLevel("DEVELOPING").build();
        }
    }

    // ── Internals ─────────────────────────────────────────────────────────────

    private String callGeminiWithRetry(String prompt, int maxTokens) {
        String url = "%s/models/%s:generateContent?key=%s".formatted(baseUrl, model, apiKey);
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.7, "maxOutputTokens", maxTokens,
                        "responseMimeType", "application/json"));
        try {
            return webClient.post().uri(url).bodyValue(body)
                    .retrieve().bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .filter(e -> !(e instanceof IllegalArgumentException)))
                    .map(response -> {
                        try {
                            return objectMapper.readTree(response)
                                    .path("candidates").get(0)
                                    .path("content").path("parts").get(0)
                                    .path("text").asText("{}");
                        } catch (Exception e) { return "{}"; }
                    })
                    .block(Duration.ofSeconds(30));
        } catch (Exception e) {
            log.error("Gemini failed after retries: {}", e.getMessage());
            return "{}";
        }
    }

    private String extractJson(String raw) {
        if (raw == null || raw.isBlank()) return "{}";
        raw = raw.trim().replaceAll("(?s)```json\\s*", "").replaceAll("(?s)```\\s*", "").trim();
        int arrStart = raw.indexOf('['), objStart = raw.indexOf('{');
        if (arrStart == -1 && objStart == -1) return "{}";
        boolean useArr = arrStart != -1 && (objStart == -1 || arrStart < objStart);
        if (useArr) {
            int end = raw.lastIndexOf(']');
            return end > arrStart ? raw.substring(arrStart, end + 1) : raw;
        } else {
            int end = raw.lastIndexOf('}');
            return end > objStart ? raw.substring(objStart, end + 1) : raw;
        }
    }

    private String sanitize(String input) {
        if (input == null) return "";
        String clean = input.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
        return clean.length() > 3000 ? clean.substring(0, 3000) + "…" : clean;
    }

    private int clamp(int val, int min, int max) { return Math.max(min, Math.min(max, val)); }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) node.forEach(n -> list.add(n.asText()));
        return list;
    }

    private List<GeneratedQuestion> fallbackQuestions(String role, int count, String type) {
        String[] defaults = {
                "Tell me about yourself and why you chose " + role + ".",
                "What is your biggest technical achievement so far?",
                "Describe a challenging bug you debugged and how you solved it.",
                "How do you approach learning a new technology?",
                "Where do you see yourself in 2 years?"
        };
        List<GeneratedQuestion> q = new ArrayList<>();
        for (int i = 0; i < Math.min(count, defaults.length); i++) {
            q.add(GeneratedQuestion.builder().question(defaults[i])
                    .category("General").type("HR").difficulty("EASY")
                    .keywords(List.of()).build());
        }
        return q;
    }
}

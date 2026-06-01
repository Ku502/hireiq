package com.hireiq.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hireiq.dto.response.AnswerEvaluationResponse;
import com.hireiq.dto.response.GeneratedQuestion;
import com.hireiq.dto.response.InterviewReportResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiAIService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAIService.class);

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL    = "llama-3.3-70b-versatile";

    @Value("${ai.groq.api-key}") private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public List<GeneratedQuestion> generateQuestions(
            String role, String type, String difficulty, int count, String company) {

        String prompt = """
            You are an expert %s interviewer.
            Generate exactly %d %s interview questions for a %s role at %s difficulty level for %s company style.
            Return ONLY a valid JSON array, no markdown, no explanation:
            [{"question":"...","category":"OOP|Collections|Spring|SQL|DSA|System Design|Behavioral|HR","type":"%s","difficulty":"%s","keywords":["k1","k2","k3"],"idealAnswer":"2-3 sentence model answer","followUp":"one follow-up question"}]
            """.formatted(role, count, type, role, difficulty, company, type, difficulty);

        String raw = callGroq(prompt, 2000);
        try {
            String json = extractJson(raw);
            JsonNode arr = objectMapper.readTree(json);
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

    public AnswerEvaluationResponse evaluateAnswer(
            String question, String answer, String role,
            String idealAnswer, List<String> keywords, String difficulty) {

        if (answer == null || answer.isBlank()) return AnswerEvaluationResponse.skipped();

        String prompt = """
            You are a strict but fair %s interviewer. Evaluate this candidate answer.
            Question: %s
            Difficulty: %s
            Candidate answer: %s
            Expected keywords: %s
            Ideal answer: %s
            Return ONLY valid JSON:
            {"score":75,"grade":"GOOD","feedback":"specific feedback here","strengthNote":"one strength","improvementNote":"one improvement","keywordHits":["matched"],"keywordMisses":["missed"],"confidenceScore":70,"sentiment":"POSITIVE","modelAnswer":"ideal answer here","followUpQuestion":"follow-up question"}
            Score guide: 0-29 wrong, 30-49 partial, 50-64 decent, 65-79 good, 80-89 strong, 90-100 expert.
            """.formatted(role, sanitize(question), difficulty, sanitize(answer),
                keywords != null ? String.join(", ", keywords) : "none",
                idealAnswer != null ? idealAnswer : "not specified");

        String raw = callGroq(prompt, 800);
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

    public Flux<String> streamEvaluation(String question, String answer, String role) {
        return Flux.just("Great answer! Keep practicing to improve further.");
    }

    public InterviewReportResponse.AISummary generateFinalReport(
            String role, List<Integer> scores, int skipped,
            List<String> weakAreas, int totalTime) {

        double avg = scores == null || scores.isEmpty() ? 0 :
            scores.stream().mapToInt(i -> i).average().orElse(0);

        // ✅ FIXED: Map to actual ReadinessLevel enum values
        // (BEGINNER, DEVELOPING, INTERMEDIATE, PROFICIENT, EXPERT)
        String readiness = avg >= 80 ? "EXPERT"
            : avg >= 65 ? "PROFICIENT"
            : avg >= 45 ? "INTERMEDIATE"
            : avg >= 25 ? "DEVELOPING"
            : "BEGINNER";

        String summaryText = String.format(
            "You completed a %s interview with an average score of %.0f/100. %s" +
            "Review the detailed feedback below to identify your improvement areas.",
            role, avg,
            skipped > 0 ? "You skipped " + skipped + " question(s). " : "");

        List<String> weaknesses = weakAreas.isEmpty() ?
            List.of("Continue practicing regularly") : weakAreas;

        List<String> topics = weakAreas.isEmpty() ?
            List.of(role + " fundamentals", "Problem solving",
                "Communication skills", "System design basics", "Data structures") :
            weakAreas;

        return InterviewReportResponse.AISummary.builder()
            .summary(summaryText)
            .strengths(List.of(
                "Completed the full interview session",
                "Showed initiative in preparation",
                avg >= 60 ? "Demonstrated good understanding of concepts" : "Identified areas for improvement"
            ))
            .weaknesses(weaknesses)
            .improvementPlan(
                "Focus on the weak areas identified in your answer feedback. " +
                "Practice daily for 30 minutes using targeted exercises. " +
                "Review model answers carefully and understand the key concepts. " +
                "Take notes on missed keywords and study them. " +
                "Attempt at least 2 mock interviews per week to build confidence.")
            .recommendedTopics(topics)
            .readinessLevel(readiness)
            .week1Plan("Review all weak areas, study missed keywords, practice 2 mock interviews at Easy difficulty")
            .week2Plan("Increase to Medium difficulty, focus on technical depth, work on time management per answer")
            .build();
    }

    private String callGroq(String prompt, int maxTokens) {
        try {
            Map<String, Object> body = Map.of(
                "model", MODEL,
                "max_tokens", maxTokens,
                "temperature", 0.7,
                "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            String response = webClient.post()
                .uri(GROQ_URL)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(25));

            JsonNode node = objectMapper.readTree(response);
            return node.path("choices").get(0)
                .path("message").path("content").asText("{}");
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage());
            return "{}";
        }
    }

    private String extractJson(String raw) {
        if (raw == null || raw.isBlank()) return "{}";
        raw = raw.trim()
            .replaceAll("(?s)```json\\s*", "")
            .replaceAll("(?s)```\\s*", "")
            .trim();
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
        return clean.length() > 2000 ? clean.substring(0, 2000) : clean;
    }

    private int clamp(int val, int min, int max) { return Math.max(min, Math.min(max, val)); }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) node.forEach(n -> list.add(n.asText()));
        return list;
    }

    private List<GeneratedQuestion> fallbackQuestions(String role, int count, String type) {
        String[] defaults = {
            "Tell me about yourself and your interest in " + role + ".",
            "What is your biggest technical achievement?",
            "Describe a challenging problem you solved.",
            "How do you approach learning new technologies?",
            "Where do you see yourself in 2 years?"
        };
        List<GeneratedQuestion> q = new ArrayList<>();
        for (int i = 0; i < Math.min(count, defaults.length); i++) {
            q.add(GeneratedQuestion.builder()
                .question(defaults[i])
                .category("General").type("HR").difficulty("EASY")
                .keywords(List.of()).build());
        }
        return q;
    }
}

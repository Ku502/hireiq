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

        // ✅ FIX: Actually call Groq for personalized report
        String prompt = String.format("""
            You are a senior technical interviewer. Generate a personalized interview performance report.
            Role: %s
            Average Score: %.0f/100
            Questions Skipped: %d
            Weak Areas: %s
            Total Time: %d seconds

            Return ONLY valid JSON (no markdown):
            {
              "summary": "2-3 sentence personalized summary of performance",
              "strengths": ["strength1", "strength2", "strength3"],
              "weaknesses": ["weakness1", "weakness2"],
              "improvementPlan": "specific 2-3 sentence improvement plan for this role",
              "readinessLevel": "BEGINNER|DEVELOPING|INTERMEDIATE|PROFICIENT|EXPERT",
              "week1Plan": "specific week 1 study plan",
              "week2Plan": "specific week 2 study plan",
              "recommendedTopics": ["topic1", "topic2", "topic3"]
            }

            Readiness guide: 0-24=BEGINNER, 25-44=DEVELOPING, 45-64=INTERMEDIATE, 65-79=PROFICIENT, 80+=EXPERT
            Make the summary and plans specific to the %s role and the actual weak areas identified.
            """,
            role, avg, skipped,
            weakAreas.isEmpty() ? "None identified" : String.join(", ", weakAreas),
            totalTime, role);

        try {
            String raw = callGroq(prompt, 1000);
            JsonNode root = objectMapper.readTree(extractJson(raw));

            String readiness = root.path("readinessLevel").asText("DEVELOPING").toUpperCase();
            // Validate readiness level against enum
            try {
                // Will throw if invalid
                switch (readiness) {
                    case "BEGINNER", "DEVELOPING", "INTERMEDIATE", "PROFICIENT", "EXPERT" -> {}
                    default -> readiness = getReadinessByScore(avg);
                }
            } catch (Exception e) {
                readiness = getReadinessByScore(avg);
            }

            return InterviewReportResponse.AISummary.builder()
                .summary(root.path("summary").asText(getFallbackSummary(role, avg, skipped)))
                .strengths(toList(root.path("strengths")))
                .weaknesses(toList(root.path("weaknesses")))
                .improvementPlan(root.path("improvementPlan").asText(getFallbackPlan()))
                .recommendedTopics(toList(root.path("recommendedTopics")))
                .readinessLevel(readiness)
                .week1Plan(root.path("week1Plan").asText("Review weak areas and practice daily"))
                .week2Plan(root.path("week2Plan").asText("Increase difficulty and attempt mock interviews"))
                .build();

        } catch (Exception e) {
            log.error("Final report generation failed: {}", e.getMessage());
            return getFallbackReport(role, avg, skipped, weakAreas);
        }
    }

    private String getReadinessByScore(double avg) {
        if (avg >= 80) return "EXPERT";
        if (avg >= 65) return "PROFICIENT";
        if (avg >= 45) return "INTERMEDIATE";
        if (avg >= 25) return "DEVELOPING";
        return "BEGINNER";
    }

    private String getFallbackSummary(String role, double avg, int skipped) {
        return String.format(
            "You completed a %s interview with an average score of %.0f/100. %s" +
            "Review the detailed feedback below to identify your improvement areas.",
            role, avg, skipped > 0 ? "You skipped " + skipped + " question(s). " : "");
    }

    private String getFallbackPlan() {
        return "Focus on weak areas identified in feedback. Practice daily for 30 minutes. " +
               "Review model answers carefully and study missed keywords.";
    }

    private InterviewReportResponse.AISummary getFallbackReport(
            String role, double avg, int skipped, List<String> weakAreas) {
        return InterviewReportResponse.AISummary.builder()
            .summary(getFallbackSummary(role, avg, skipped))
            .strengths(List.of(
                "Completed the full interview session",
                "Showed initiative in preparation",
                avg >= 60 ? "Demonstrated good understanding of concepts" : "Identified areas for improvement"
            ))
            .weaknesses(weakAreas.isEmpty() ? List.of("Continue practicing regularly") : weakAreas)
            .improvementPlan(getFallbackPlan())
            .recommendedTopics(weakAreas.isEmpty() ?
                List.of(role + " fundamentals", "Problem solving", "Communication skills") : weakAreas)
            .readinessLevel(getReadinessByScore(avg))
            .week1Plan("Review all weak areas, study missed keywords, practice 2 mock interviews at Easy difficulty")
            .week2Plan("Increase to Medium difficulty, focus on technical depth, work on time management")
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

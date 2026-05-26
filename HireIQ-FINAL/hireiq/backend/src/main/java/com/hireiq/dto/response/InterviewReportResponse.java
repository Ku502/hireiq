package com.hireiq.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class InterviewReportResponse {

    private Long interviewId;
    private String targetRole;
    private String interviewType;
    private String difficulty;
    private String status;
    private int totalQuestions;
    private int completedCount;
    private int skippedCount;
    private int overallScore;
    private int strongAnswers;
    private int averageAnswers;
    private int weakAnswers;
    private Integer durationSecs;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private AISummary aiSummary;
    private List<AnswerDetailResponse> answers;

    public InterviewReportResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InterviewReportResponse o = new InterviewReportResponse();
        public Builder interviewId(Long v)                        { o.interviewId = v; return this; }
        public Builder targetRole(String v)                       { o.targetRole = v; return this; }
        public Builder interviewType(String v)                    { o.interviewType = v; return this; }
        public Builder difficulty(String v)                       { o.difficulty = v; return this; }
        public Builder status(String v)                           { o.status = v; return this; }
        public Builder totalQuestions(int v)                      { o.totalQuestions = v; return this; }
        public Builder completedCount(int v)                      { o.completedCount = v; return this; }
        public Builder skippedCount(int v)                        { o.skippedCount = v; return this; }
        public Builder overallScore(int v)                        { o.overallScore = v; return this; }
        public Builder strongAnswers(int v)                       { o.strongAnswers = v; return this; }
        public Builder averageAnswers(int v)                      { o.averageAnswers = v; return this; }
        public Builder weakAnswers(int v)                         { o.weakAnswers = v; return this; }
        public Builder durationSecs(Integer v)                    { o.durationSecs = v; return this; }
        public Builder startedAt(LocalDateTime v)                 { o.startedAt = v; return this; }
        public Builder completedAt(LocalDateTime v)               { o.completedAt = v; return this; }
        public Builder aiSummary(AISummary v)                     { o.aiSummary = v; return this; }
        public Builder answers(List<AnswerDetailResponse> v)      { o.answers = v; return this; }
        public InterviewReportResponse build()                    { return o; }
    }

    // Getters
    public Long getInterviewId()                    { return interviewId; }
    public String getTargetRole()                   { return targetRole; }
    public String getInterviewType()                { return interviewType; }
    public String getDifficulty()                   { return difficulty; }
    public String getStatus()                       { return status; }
    public int getTotalQuestions()                  { return totalQuestions; }
    public int getCompletedCount()                  { return completedCount; }
    public int getSkippedCount()                    { return skippedCount; }
    public int getOverallScore()                    { return overallScore; }
    public int getStrongAnswers()                   { return strongAnswers; }
    public int getAverageAnswers()                  { return averageAnswers; }
    public int getWeakAnswers()                     { return weakAnswers; }
    public Integer getDurationSecs()                { return durationSecs; }
    public LocalDateTime getStartedAt()             { return startedAt; }
    public LocalDateTime getCompletedAt()           { return completedAt; }
    public AISummary getAiSummary()                 { return aiSummary; }
    public List<AnswerDetailResponse> getAnswers()  { return answers; }

    // Setters
    public void setInterviewId(Long v)                       { this.interviewId = v; }
    public void setTargetRole(String v)                      { this.targetRole = v; }
    public void setInterviewType(String v)                   { this.interviewType = v; }
    public void setDifficulty(String v)                      { this.difficulty = v; }
    public void setStatus(String v)                          { this.status = v; }
    public void setTotalQuestions(int v)                     { this.totalQuestions = v; }
    public void setCompletedCount(int v)                     { this.completedCount = v; }
    public void setSkippedCount(int v)                       { this.skippedCount = v; }
    public void setOverallScore(int v)                       { this.overallScore = v; }
    public void setStrongAnswers(int v)                      { this.strongAnswers = v; }
    public void setAverageAnswers(int v)                     { this.averageAnswers = v; }
    public void setWeakAnswers(int v)                        { this.weakAnswers = v; }
    public void setDurationSecs(Integer v)                   { this.durationSecs = v; }
    public void setStartedAt(LocalDateTime v)                { this.startedAt = v; }
    public void setCompletedAt(LocalDateTime v)              { this.completedAt = v; }
    public void setAiSummary(AISummary v)                    { this.aiSummary = v; }
    public void setAnswers(List<AnswerDetailResponse> v)     { this.answers = v; }

    // ── AISummary ─────────────────────────────────────────────────────────────

    public static class AISummary {

        private String summary;
        private List<String> strengths;
        private List<String> weaknesses;
        private String improvementPlan;
        private List<String> recommendedTopics;
        private String readinessLevel;
        private String week1Plan;
        private String week2Plan;

        public AISummary() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final AISummary o = new AISummary();
            public Builder summary(String v)                    { o.summary = v; return this; }
            public Builder strengths(List<String> v)           { o.strengths = v; return this; }
            public Builder weaknesses(List<String> v)          { o.weaknesses = v; return this; }
            public Builder improvementPlan(String v)           { o.improvementPlan = v; return this; }
            public Builder recommendedTopics(List<String> v)   { o.recommendedTopics = v; return this; }
            public Builder readinessLevel(String v)            { o.readinessLevel = v; return this; }
            public Builder week1Plan(String v)                 { o.week1Plan = v; return this; }
            public Builder week2Plan(String v)                 { o.week2Plan = v; return this; }
            public AISummary build()                           { return o; }
        }

        // Getters
        public String getSummary()                  { return summary; }
        public List<String> getStrengths()          { return strengths; }
        public List<String> getWeaknesses()         { return weaknesses; }
        public String getImprovementPlan()          { return improvementPlan; }
        public List<String> getRecommendedTopics()  { return recommendedTopics; }
        public String getReadinessLevel()           { return readinessLevel; }
        public String getWeek1Plan()                { return week1Plan; }
        public String getWeek2Plan()                { return week2Plan; }

        // Setters
        public void setSummary(String v)                 { this.summary = v; }
        public void setStrengths(List<String> v)         { this.strengths = v; }
        public void setWeaknesses(List<String> v)        { this.weaknesses = v; }
        public void setImprovementPlan(String v)         { this.improvementPlan = v; }
        public void setRecommendedTopics(List<String> v) { this.recommendedTopics = v; }
        public void setReadinessLevel(String v)          { this.readinessLevel = v; }
        public void setWeek1Plan(String v)               { this.week1Plan = v; }
        public void setWeek2Plan(String v)               { this.week2Plan = v; }
    }
}

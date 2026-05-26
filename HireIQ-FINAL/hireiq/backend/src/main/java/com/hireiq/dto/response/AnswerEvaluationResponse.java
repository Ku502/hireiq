package com.hireiq.dto.response;

import java.util.List;

public class AnswerEvaluationResponse {

    private int score;
    private String grade;
    private String feedback;
    private String strengthNote;
    private String improvementNote;
    private List<String> keywordHits;
    private List<String> keywordMisses;
    private int confidenceScore;
    private String sentiment;
    private String modelAnswer;
    private String followUpQuestion;
    private boolean skipped;

    public AnswerEvaluationResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AnswerEvaluationResponse o = new AnswerEvaluationResponse();
        public Builder score(int v)                    { o.score = v; return this; }
        public Builder grade(String v)                 { o.grade = v; return this; }
        public Builder feedback(String v)              { o.feedback = v; return this; }
        public Builder strengthNote(String v)          { o.strengthNote = v; return this; }
        public Builder improvementNote(String v)       { o.improvementNote = v; return this; }
        public Builder keywordHits(List<String> v)     { o.keywordHits = v; return this; }
        public Builder keywordMisses(List<String> v)   { o.keywordMisses = v; return this; }
        public Builder confidenceScore(int v)          { o.confidenceScore = v; return this; }
        public Builder sentiment(String v)             { o.sentiment = v; return this; }
        public Builder modelAnswer(String v)           { o.modelAnswer = v; return this; }
        public Builder followUpQuestion(String v)      { o.followUpQuestion = v; return this; }
        public Builder skipped(boolean v)              { o.skipped = v; return this; }
        public AnswerEvaluationResponse build()        { return o; }
    }

    public static AnswerEvaluationResponse skipped() {
        return builder().score(0).grade("SKIPPED")
            .feedback("Question skipped.").skipped(true).sentiment("NEUTRAL").build();
    }

    public static AnswerEvaluationResponse error() {
        return builder().score(50).grade("AVERAGE")
            .feedback("Evaluation unavailable. Please review manually.")
            .skipped(false).sentiment("NEUTRAL").build();
    }

    public int getScore()                   { return score; }
    public String getGrade()                { return grade; }
    public String getFeedback()             { return feedback; }
    public String getStrengthNote()         { return strengthNote; }
    public String getImprovementNote()      { return improvementNote; }
    public List<String> getKeywordHits()    { return keywordHits; }
    public List<String> getKeywordMisses()  { return keywordMisses; }
    public int getConfidenceScore()         { return confidenceScore; }
    public String getSentiment()            { return sentiment; }
    public String getModelAnswer()          { return modelAnswer; }
    public String getFollowUpQuestion()     { return followUpQuestion; }
    public boolean isSkipped()              { return skipped; }

    public void setScore(int v)                    { this.score = v; }
    public void setGrade(String v)                 { this.grade = v; }
    public void setFeedback(String v)              { this.feedback = v; }
    public void setStrengthNote(String v)          { this.strengthNote = v; }
    public void setImprovementNote(String v)       { this.improvementNote = v; }
    public void setKeywordHits(List<String> v)     { this.keywordHits = v; }
    public void setKeywordMisses(List<String> v)   { this.keywordMisses = v; }
    public void setConfidenceScore(int v)          { this.confidenceScore = v; }
    public void setSentiment(String v)             { this.sentiment = v; }
    public void setModelAnswer(String v)           { this.modelAnswer = v; }
    public void setFollowUpQuestion(String v)      { this.followUpQuestion = v; }
    public void setSkipped(boolean v)              { this.skipped = v; }
}

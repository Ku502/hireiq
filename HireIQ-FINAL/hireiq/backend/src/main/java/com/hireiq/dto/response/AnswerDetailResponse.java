package com.hireiq.dto.response;

import java.util.List;

public class AnswerDetailResponse {

    private Long id;
    private int position;
    private String questionText;
    private String questionCategory;
    private String answerText;
    private Integer score;
    private String grade;
    private String aiFeedback;
    private String strengthNote;
    private String improvementNote;
    private List<String> keywordHits;
    private List<String> keywordMisses;
    private Integer confidenceScore;
    private String modelAnswer;
    private String followUpQ;
    private Integer timeTakenSecs;

    public AnswerDetailResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AnswerDetailResponse o = new AnswerDetailResponse();
        public Builder id(Long v)                      { o.id = v; return this; }
        public Builder position(int v)                 { o.position = v; return this; }
        public Builder questionText(String v)          { o.questionText = v; return this; }
        public Builder questionCategory(String v)      { o.questionCategory = v; return this; }
        public Builder answerText(String v)            { o.answerText = v; return this; }
        public Builder score(Integer v)                { o.score = v; return this; }
        public Builder grade(String v)                 { o.grade = v; return this; }
        public Builder aiFeedback(String v)            { o.aiFeedback = v; return this; }
        public Builder strengthNote(String v)          { o.strengthNote = v; return this; }
        public Builder improvementNote(String v)       { o.improvementNote = v; return this; }
        public Builder keywordHits(List<String> v)     { o.keywordHits = v; return this; }
        public Builder keywordMisses(List<String> v)   { o.keywordMisses = v; return this; }
        public Builder confidenceScore(Integer v)      { o.confidenceScore = v; return this; }
        public Builder modelAnswer(String v)           { o.modelAnswer = v; return this; }
        public Builder followUpQ(String v)             { o.followUpQ = v; return this; }
        public Builder timeTakenSecs(Integer v)        { o.timeTakenSecs = v; return this; }
        public AnswerDetailResponse build()            { return o; }
    }

    public Long getId()                     { return id; }
    public int getPosition()                { return position; }
    public String getQuestionText()         { return questionText; }
    public String getQuestionCategory()     { return questionCategory; }
    public String getAnswerText()           { return answerText; }
    public Integer getScore()               { return score; }
    public String getGrade()                { return grade; }
    public String getAiFeedback()           { return aiFeedback; }
    public String getStrengthNote()         { return strengthNote; }
    public String getImprovementNote()      { return improvementNote; }
    public List<String> getKeywordHits()    { return keywordHits; }
    public List<String> getKeywordMisses()  { return keywordMisses; }
    public Integer getConfidenceScore()     { return confidenceScore; }
    public String getModelAnswer()          { return modelAnswer; }
    public String getFollowUpQ()            { return followUpQ; }
    public Integer getTimeTakenSecs()       { return timeTakenSecs; }

    public void setId(Long v)                    { this.id = v; }
    public void setPosition(int v)               { this.position = v; }
    public void setQuestionText(String v)        { this.questionText = v; }
    public void setQuestionCategory(String v)    { this.questionCategory = v; }
    public void setAnswerText(String v)          { this.answerText = v; }
    public void setScore(Integer v)              { this.score = v; }
    public void setGrade(String v)               { this.grade = v; }
    public void setAiFeedback(String v)          { this.aiFeedback = v; }
    public void setStrengthNote(String v)        { this.strengthNote = v; }
    public void setImprovementNote(String v)     { this.improvementNote = v; }
    public void setKeywordHits(List<String> v)   { this.keywordHits = v; }
    public void setKeywordMisses(List<String> v) { this.keywordMisses = v; }
    public void setConfidenceScore(Integer v)    { this.confidenceScore = v; }
    public void setModelAnswer(String v)         { this.modelAnswer = v; }
    public void setFollowUpQ(String v)           { this.followUpQ = v; }
    public void setTimeTakenSecs(Integer v)      { this.timeTakenSecs = v; }
}

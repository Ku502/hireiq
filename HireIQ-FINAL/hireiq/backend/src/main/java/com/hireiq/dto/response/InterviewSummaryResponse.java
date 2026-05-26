package com.hireiq.dto.response;

import java.time.LocalDateTime;

public class InterviewSummaryResponse {

    private Long id;
    private String title;
    private String targetRole;
    private String interviewType;
    private String difficulty;
    private String status;
    private Integer overallScore;
    private int totalQuestions;
    private int completedCount;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public InterviewSummaryResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InterviewSummaryResponse o = new InterviewSummaryResponse();
        public Builder id(Long v)                   { o.id = v; return this; }
        public Builder title(String v)              { o.title = v; return this; }
        public Builder targetRole(String v)         { o.targetRole = v; return this; }
        public Builder interviewType(String v)      { o.interviewType = v; return this; }
        public Builder difficulty(String v)         { o.difficulty = v; return this; }
        public Builder status(String v)             { o.status = v; return this; }
        public Builder overallScore(Integer v)      { o.overallScore = v; return this; }
        public Builder totalQuestions(int v)        { o.totalQuestions = v; return this; }
        public Builder completedCount(int v)        { o.completedCount = v; return this; }
        public Builder startedAt(LocalDateTime v)   { o.startedAt = v; return this; }
        public Builder completedAt(LocalDateTime v) { o.completedAt = v; return this; }
        public InterviewSummaryResponse build()     { return o; }
    }

    public Long getId()                     { return id; }
    public String getTitle()                { return title; }
    public String getTargetRole()           { return targetRole; }
    public String getInterviewType()        { return interviewType; }
    public String getDifficulty()           { return difficulty; }
    public String getStatus()               { return status; }
    public Integer getOverallScore()        { return overallScore; }
    public int getTotalQuestions()          { return totalQuestions; }
    public int getCompletedCount()          { return completedCount; }
    public LocalDateTime getStartedAt()     { return startedAt; }
    public LocalDateTime getCompletedAt()   { return completedAt; }

    public void setId(Long v)                   { this.id = v; }
    public void setTitle(String v)              { this.title = v; }
    public void setTargetRole(String v)         { this.targetRole = v; }
    public void setInterviewType(String v)      { this.interviewType = v; }
    public void setDifficulty(String v)         { this.difficulty = v; }
    public void setStatus(String v)             { this.status = v; }
    public void setOverallScore(Integer v)      { this.overallScore = v; }
    public void setTotalQuestions(int v)        { this.totalQuestions = v; }
    public void setCompletedCount(int v)        { this.completedCount = v; }
    public void setStartedAt(LocalDateTime v)   { this.startedAt = v; }
    public void setCompletedAt(LocalDateTime v) { this.completedAt = v; }
}

package com.hireiq.dto.response;

import java.math.BigDecimal;

public class DashboardStatsResponse {

    private int totalInterviews;
    private BigDecimal avgScore;
    private BigDecimal bestScore;
    private int streakDays;
    private int totalTimeMins;
    private String lastPracticeDate;

    public DashboardStatsResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DashboardStatsResponse o = new DashboardStatsResponse();
        public Builder totalInterviews(int v)        { o.totalInterviews = v; return this; }
        public Builder avgScore(BigDecimal v)        { o.avgScore = v; return this; }
        public Builder bestScore(BigDecimal v)       { o.bestScore = v; return this; }
        public Builder streakDays(int v)             { o.streakDays = v; return this; }
        public Builder totalTimeMins(int v)          { o.totalTimeMins = v; return this; }
        public Builder lastPracticeDate(String v)    { o.lastPracticeDate = v; return this; }
        public DashboardStatsResponse build()        { return o; }
    }

    public int getTotalInterviews()         { return totalInterviews; }
    public BigDecimal getAvgScore()         { return avgScore; }
    public BigDecimal getBestScore()        { return bestScore; }
    public int getStreakDays()              { return streakDays; }
    public int getTotalTimeMins()           { return totalTimeMins; }
    public String getLastPracticeDate()     { return lastPracticeDate; }

    public void setTotalInterviews(int v)       { this.totalInterviews = v; }
    public void setAvgScore(BigDecimal v)       { this.avgScore = v; }
    public void setBestScore(BigDecimal v)      { this.bestScore = v; }
    public void setStreakDays(int v)            { this.streakDays = v; }
    public void setTotalTimeMins(int v)         { this.totalTimeMins = v; }
    public void setLastPracticeDate(String v)   { this.lastPracticeDate = v; }
}

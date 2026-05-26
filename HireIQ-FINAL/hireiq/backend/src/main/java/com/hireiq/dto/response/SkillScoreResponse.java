package com.hireiq.dto.response;

public class SkillScoreResponse {

    private String domain;
    private int score;
    private String level;

    public SkillScoreResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SkillScoreResponse o = new SkillScoreResponse();
        public Builder domain(String v) { o.domain = v; return this; }
        public Builder score(int v)     { o.score = v; return this; }
        public Builder level(String v)  { o.level = v; return this; }
        public SkillScoreResponse build() { return o; }
    }

    public String getDomain() { return domain; }
    public int getScore()     { return score; }
    public String getLevel()  { return level; }

    public void setDomain(String v) { this.domain = v; }
    public void setScore(int v)     { this.score = v; }
    public void setLevel(String v)  { this.level = v; }
}

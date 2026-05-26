package com.hireiq.dto.response;

import java.util.List;

public class GeneratedQuestion {

    private String question;
    private String category;
    private String type;
    private String difficulty;
    private List<String> keywords;
    private String idealAnswer;
    private String followUp;

    public GeneratedQuestion() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final GeneratedQuestion o = new GeneratedQuestion();
        public Builder question(String v)          { o.question = v; return this; }
        public Builder category(String v)          { o.category = v; return this; }
        public Builder type(String v)              { o.type = v; return this; }
        public Builder difficulty(String v)        { o.difficulty = v; return this; }
        public Builder keywords(List<String> v)    { o.keywords = v; return this; }
        public Builder idealAnswer(String v)       { o.idealAnswer = v; return this; }
        public Builder followUp(String v)          { o.followUp = v; return this; }
        public GeneratedQuestion build()           { return o; }
    }

    public String getQuestion()          { return question; }
    public String getCategory()          { return category; }
    public String getType()              { return type; }
    public String getDifficulty()        { return difficulty; }
    public List<String> getKeywords()    { return keywords; }
    public String getIdealAnswer()       { return idealAnswer; }
    public String getFollowUp()          { return followUp; }

    public void setQuestion(String v)        { this.question = v; }
    public void setCategory(String v)        { this.category = v; }
    public void setType(String v)            { this.type = v; }
    public void setDifficulty(String v)      { this.difficulty = v; }
    public void setKeywords(List<String> v)  { this.keywords = v; }
    public void setIdealAnswer(String v)     { this.idealAnswer = v; }
    public void setFollowUp(String v)        { this.followUp = v; }
}

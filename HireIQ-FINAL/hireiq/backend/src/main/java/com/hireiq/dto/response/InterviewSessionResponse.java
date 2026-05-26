package com.hireiq.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class InterviewSessionResponse {

    private Long interviewId;
    private List<GeneratedQuestion> questions;
    private LocalDateTime startedAt;

    public InterviewSessionResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InterviewSessionResponse o = new InterviewSessionResponse();
        public Builder interviewId(Long v)                  { o.interviewId = v; return this; }
        public Builder questions(List<GeneratedQuestion> v) { o.questions = v; return this; }
        public Builder startedAt(LocalDateTime v)           { o.startedAt = v; return this; }
        public InterviewSessionResponse build()             { return o; }
    }

    public Long getInterviewId()                { return interviewId; }
    public List<GeneratedQuestion> getQuestions(){ return questions; }
    public LocalDateTime getStartedAt()         { return startedAt; }

    public void setInterviewId(Long v)                  { this.interviewId = v; }
    public void setQuestions(List<GeneratedQuestion> v) { this.questions = v; }
    public void setStartedAt(LocalDateTime v)           { this.startedAt = v; }
}

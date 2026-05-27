package com.hireiq.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    public enum AnswerGrade { EXCELLENT, GOOD, AVERAGE, POOR, SKIPPED }
    public enum Sentiment   { POSITIVE, NEUTRAL, NEGATIVE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_category")
    private String questionCategory;

    @Column(name = "question_type")
    private String questionType;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    private Integer score;

    @Enumerated(EnumType.STRING)
    private AnswerGrade grade;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "strength_note")
    private String strengthNote;

    @Column(name = "improvement_note")
    private String improvementNote;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "keyword_hits")
    private List<String> keywordHits;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "keyword_misses")
    private List<String> keywordMisses;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Enumerated(EnumType.STRING)
    private Sentiment sentiment;

    @Column(name = "model_answer", columnDefinition = "TEXT")
    private String modelAnswer;

    @Column(name = "follow_up_q", columnDefinition = "TEXT")
    private String followUpQ;

    @Column(name = "follow_up_ans", columnDefinition = "TEXT")
    private String followUpAns;

    @Column(name = "time_taken_secs")
    private Integer timeTakenSecs;

    private Integer position;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public InterviewAnswer() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InterviewAnswer o = new InterviewAnswer();
        public Builder id(Long v)                       { o.id = v; return this; }
        public Builder interview(Interview v)           { o.interview = v; return this; }
        public Builder questionText(String v)           { o.questionText = v; return this; }
        public Builder questionCategory(String v)       { o.questionCategory = v; return this; }
        public Builder questionType(String v)           { o.questionType = v; return this; }
        public Builder answerText(String v)             { o.answerText = v; return this; }
        public Builder score(Integer v)                 { o.score = v; return this; }
        public Builder grade(AnswerGrade v)             { o.grade = v; return this; }
        public Builder aiFeedback(String v)             { o.aiFeedback = v; return this; }
        public Builder strengthNote(String v)           { o.strengthNote = v; return this; }
        public Builder improvementNote(String v)        { o.improvementNote = v; return this; }
        public Builder keywordHits(List<String> v)      { o.keywordHits = v; return this; }
        public Builder keywordMisses(List<String> v)    { o.keywordMisses = v; return this; }
        public Builder confidenceScore(Integer v)       { o.confidenceScore = v; return this; }
        public Builder sentiment(Sentiment v)           { o.sentiment = v; return this; }
        public Builder modelAnswer(String v)            { o.modelAnswer = v; return this; }
        public Builder followUpQ(String v)              { o.followUpQ = v; return this; }
        public Builder followUpAns(String v)            { o.followUpAns = v; return this; }
        public Builder timeTakenSecs(Integer v)         { o.timeTakenSecs = v; return this; }
        public Builder position(Integer v)              { o.position = v; return this; }
        public Builder createdAt(LocalDateTime v)       { o.createdAt = v; return this; }
        public InterviewAnswer build()                  { return o; }
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.grade == null) this.grade = AnswerGrade.SKIPPED;
    }

    public Long getId()                     { return id; }
    public Interview getInterview()         { return interview; }
    public String getQuestionText()         { return questionText; }
    public String getQuestionCategory()     { return questionCategory; }
    public String getQuestionType()         { return questionType; }
    public String getAnswerText()           { return answerText; }
    public Integer getScore()               { return score; }
    public AnswerGrade getGrade()           { return grade; }
    public String getAiFeedback()           { return aiFeedback; }
    public String getStrengthNote()         { return strengthNote; }
    public String getImprovementNote()      { return improvementNote; }
    public List<String> getKeywordHits()    { return keywordHits; }
    public List<String> getKeywordMisses()  { return keywordMisses; }
    public Integer getConfidenceScore()     { return confidenceScore; }
    public Sentiment getSentiment()         { return sentiment; }
    public String getModelAnswer()          { return modelAnswer; }
    public String getFollowUpQ()            { return followUpQ; }
    public String getFollowUpAns()          { return followUpAns; }
    public Integer getTimeTakenSecs()       { return timeTakenSecs; }
    public Integer getPosition()            { return position; }
    public LocalDateTime getCreatedAt()     { return createdAt; }

    public void setId(Long v)                       { this.id = v; }
    public void setInterview(Interview v)           { this.interview = v; }
    public void setQuestionText(String v)           { this.questionText = v; }
    public void setQuestionCategory(String v)       { this.questionCategory = v; }
    public void setQuestionType(String v)           { this.questionType = v; }
    public void setAnswerText(String v)             { this.answerText = v; }
    public void setScore(Integer v)                 { this.score = v; }
    public void setGrade(AnswerGrade v)             { this.grade = v; }
    public void setAiFeedback(String v)             { this.aiFeedback = v; }
    public void setStrengthNote(String v)           { this.strengthNote = v; }
    public void setImprovementNote(String v)        { this.improvementNote = v; }
    public void setKeywordHits(List<String> v)      { this.keywordHits = v; }
    public void setKeywordMisses(List<String> v)    { this.keywordMisses = v; }
    public void setConfidenceScore(Integer v)       { this.confidenceScore = v; }
    public void setSentiment(Sentiment v)           { this.sentiment = v; }
    public void setModelAnswer(String v)            { this.modelAnswer = v; }
    public void setFollowUpQ(String v)              { this.followUpQ = v; }
    public void setFollowUpAns(String v)            { this.followUpAns = v; }
    public void setTimeTakenSecs(Integer v)         { this.timeTakenSecs = v; }
    public void setPosition(Integer v)              { this.position = v; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }
}

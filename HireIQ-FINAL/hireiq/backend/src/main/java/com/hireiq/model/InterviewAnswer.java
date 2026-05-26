package com.hireiq.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_answers")
@Getter
@Setter
@NoArgsConstructor
@Builder
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

    InterviewAnswer(Long id, Interview interview, String questionText,
                    String questionCategory, String questionType, String answerText,
                    Integer score, AnswerGrade grade, String aiFeedback,
                    String strengthNote, String improvementNote,
                    List<String> keywordHits, List<String> keywordMisses,
                    Integer confidenceScore, Sentiment sentiment, String modelAnswer,
                    String followUpQ, String followUpAns, Integer timeTakenSecs,
                    Integer position, LocalDateTime createdAt) {
        this.id = id; this.interview = interview;
        this.questionText = questionText; this.questionCategory = questionCategory;
        this.questionType = questionType; this.answerText = answerText;
        this.score = score; this.grade = grade; this.aiFeedback = aiFeedback;
        this.strengthNote = strengthNote; this.improvementNote = improvementNote;
        this.keywordHits = keywordHits; this.keywordMisses = keywordMisses;
        this.confidenceScore = confidenceScore; this.sentiment = sentiment;
        this.modelAnswer = modelAnswer; this.followUpQ = followUpQ;
        this.followUpAns = followUpAns; this.timeTakenSecs = timeTakenSecs;
        this.position = position; this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.grade == null) this.grade = AnswerGrade.SKIPPED;
    }
}

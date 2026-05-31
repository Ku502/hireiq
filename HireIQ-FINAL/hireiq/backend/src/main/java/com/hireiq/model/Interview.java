package com.hireiq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interviews")
public class Interview {

    public enum InterviewType { TECHNICAL, BEHAVIORAL, MIXED, SYSTEM_DESIGN, HR }
    public enum Difficulty { EASY, MEDIUM, HARD }
    public enum InterviewStatus { PENDING, IN_PROGRESS, COMPLETED, ABANDONED }
    public enum ReadinessLevel { BEGINNER, DEVELOPING, INTERMEDIATE, PROFICIENT, EXPERT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InterviewAnswer> answers = new ArrayList<>();

    @Column(nullable = false)
    private String title;

    @Column(name = "target_role", nullable = false)
    private String targetRole;

    @Column(name = "company_style")
    private String companyStyle;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false)
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(name = "total_questions")
    private int totalQuestions;

    @Column(name = "completed_count")
    private int completedCount;

    @Column(name = "skipped_count")
    private int skippedCount;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "duration_secs")
    private int durationSecs;

    @Column(name = "total_time_mins")
    private int totalTimeMins;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(length = 1000)
    private String strengths;

    @Column(length = 1000)
    private String weaknesses;

    @Column(name = "improvement_plan", columnDefinition = "TEXT")
    private String improvementPlan;

    @Enumerated(EnumType.STRING)
    @Column(name = "readiness_level")
    private ReadinessLevel readinessLevel;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Interview() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Interview o = new Interview();
        public Builder user(User v)                    { o.user = v; return this; }
        public Builder title(String v)                 { o.title = v; return this; }
        public Builder targetRole(String v)            { o.targetRole = v; return this; }
        public Builder companyStyle(String v)          { o.companyStyle = v; return this; }
        public Builder interviewType(InterviewType v)  { o.interviewType = v; return this; }
        public Builder difficulty(Difficulty v)        { o.difficulty = v; return this; }
        public Builder status(InterviewStatus v)       { o.status = v; return this; }
        public Builder totalQuestions(int v)           { o.totalQuestions = v; return this; }
        public Builder completedCount(int v)           { o.completedCount = v; return this; }
        public Builder skippedCount(int v)             { o.skippedCount = v; return this; }
        public Builder overallScore(BigDecimal v)      { o.overallScore = v; return this; }
        public Builder durationSecs(int v)             { o.durationSecs = v; return this; }
        public Builder totalTimeMins(int v)            { o.totalTimeMins = v; return this; }
        public Builder aiSummary(String v)             { o.aiSummary = v; return this; }
        public Builder strengths(String v)             { o.strengths = v; return this; }
        public Builder weaknesses(String v)            { o.weaknesses = v; return this; }
        public Builder improvementPlan(String v)       { o.improvementPlan = v; return this; }
        public Builder readinessLevel(ReadinessLevel v){ o.readinessLevel = v; return this; }
        public Builder startedAt(LocalDateTime v)      { o.startedAt = v; return this; }
        public Builder completedAt(LocalDateTime v)    { o.completedAt = v; return this; }
        public Interview build()                       { return o; }
    }

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.difficulty == null)    this.difficulty    = Difficulty.MEDIUM;
        if (this.status == null)        this.status        = InterviewStatus.IN_PROGRESS;
        if (this.interviewType == null) this.interviewType = InterviewType.MIXED;
        if (this.startedAt == null)     this.startedAt     = now;
        if (this.answers == null)       this.answers       = new ArrayList<>();
        this.completedCount = 0;
        this.skippedCount   = 0;
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId()                      { return id; }
    public User getUser()                    { return user; }
    public List<InterviewAnswer> getAnswers(){ return answers; }
    public String getTitle()                 { return title; }
    public String getTargetRole()            { return targetRole; }
    public String getCompanyStyle()          { return companyStyle; }
    public InterviewType getInterviewType()  { return interviewType; }
    public Difficulty getDifficulty()        { return difficulty; }
    public InterviewStatus getStatus()       { return status; }
    public int getTotalQuestions()           { return totalQuestions; }
    public int getCompletedCount()           { return completedCount; }
    public int getSkippedCount()             { return skippedCount; }
    public BigDecimal getOverallScore()      { return overallScore; }
    public int getDurationSecs()             { return durationSecs; }
    public int getTotalTimeMins()            { return totalTimeMins; }
    public String getAiSummary()             { return aiSummary; }
    public String getStrengths()             { return strengths; }
    public String getWeaknesses()            { return weaknesses; }
    public String getImprovementPlan()       { return improvementPlan; }
    public ReadinessLevel getReadinessLevel(){ return readinessLevel; }
    public LocalDateTime getStartedAt()      { return startedAt; }
    public LocalDateTime getCompletedAt()    { return completedAt; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
    public LocalDateTime getUpdatedAt()      { return updatedAt; }

    public void setId(Long v)                        { this.id = v; }
    public void setUser(User v)                      { this.user = v; }
    public void setAnswers(List<InterviewAnswer> v)  { this.answers = v; }
    public void setTitle(String v)                   { this.title = v; }
    public void setTargetRole(String v)              { this.targetRole = v; }
    public void setCompanyStyle(String v)            { this.companyStyle = v; }
    public void setInterviewType(InterviewType v)    { this.interviewType = v; }
    public void setDifficulty(Difficulty v)          { this.difficulty = v; }
    public void setStatus(InterviewStatus v)         { this.status = v; }
    public void setTotalQuestions(int v)             { this.totalQuestions = v; }
    public void setCompletedCount(int v)             { this.completedCount = v; }
    public void setSkippedCount(int v)               { this.skippedCount = v; }
    public void setOverallScore(BigDecimal v)        { this.overallScore = v; }
    public void setDurationSecs(int v)               { this.durationSecs = v; }
    public void setTotalTimeMins(int v)              { this.totalTimeMins = v; }
    public void setAiSummary(String v)               { this.aiSummary = v; }
    public void setStrengths(String v)               { this.strengths = v; }
    public void setWeaknesses(String v)              { this.weaknesses = v; }
    public void setImprovementPlan(String v)         { this.improvementPlan = v; }
    public void setReadinessLevel(ReadinessLevel v)  { this.readinessLevel = v; }
    public void setStartedAt(LocalDateTime v)        { this.startedAt = v; }
    public void setCompletedAt(LocalDateTime v)      { this.completedAt = v; }
    public void setCreatedAt(LocalDateTime v)        { this.createdAt = v; }
    public void setUpdatedAt(LocalDateTime v)        { this.updatedAt = v; }
}

package com.hireiq.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class StartInterviewRequest {

    @NotBlank
    private String targetRole;

    @NotBlank
    private String interviewType;

    @NotBlank
    private String difficulty;

    private String companyStyle;

    @Min(1) @Max(15)
    private int questionCount;

    public String getTargetRole()    { return targetRole; }
    public String getInterviewType() { return interviewType; }
    public String getDifficulty()    { return difficulty; }
    public String getCompanyStyle()  { return companyStyle; }
    public int getQuestionCount()    { return questionCount; }

    public void setTargetRole(String v)    { this.targetRole = v; }
    public void setInterviewType(String v) { this.interviewType = v; }
    public void setDifficulty(String v)    { this.difficulty = v; }
    public void setCompanyStyle(String v)  { this.companyStyle = v; }
    public void setQuestionCount(int v)    { this.questionCount = v; }
}

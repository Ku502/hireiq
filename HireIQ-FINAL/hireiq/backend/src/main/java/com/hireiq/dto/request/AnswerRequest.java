package com.hireiq.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class AnswerRequest {

    @NotBlank
    private String questionText;

    private String answerText;

    @NotNull @Min(0)
    private Integer position;

    private String idealAnswer;
    private List<String> keywords;
    private Integer timeTakenSecs;

    public String getQuestionText()      { return questionText; }
    public String getAnswerText()        { return answerText; }
    public Integer getPosition()         { return position; }
    public String getIdealAnswer()       { return idealAnswer; }
    public List<String> getKeywords()    { return keywords; }
    public Integer getTimeTakenSecs()    { return timeTakenSecs; }

    public void setQuestionText(String v)      { this.questionText = v; }
    public void setAnswerText(String v)        { this.answerText = v; }
    public void setPosition(Integer v)         { this.position = v; }
    public void setIdealAnswer(String v)       { this.idealAnswer = v; }
    public void setKeywords(List<String> v)    { this.keywords = v; }
    public void setTimeTakenSecs(Integer v)    { this.timeTakenSecs = v; }
}

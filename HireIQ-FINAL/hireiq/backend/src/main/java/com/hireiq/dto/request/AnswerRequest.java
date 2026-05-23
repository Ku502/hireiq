package com.hireiq.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class AnswerRequest {
    @NotBlank String questionText;
    String answerText;
    @NotNull @Min(0) Integer position;
    String idealAnswer;
    List<String> keywords;
    Integer timeTakenSecs;
}

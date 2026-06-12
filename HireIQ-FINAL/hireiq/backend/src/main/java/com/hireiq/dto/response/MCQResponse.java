package com.hireiq.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MCQResponse {
    private int id;
    private String question;
    private List<String> options;
    private int answer; // index of correct option (0-3)
    private String explanation;
    private String difficulty;
    private String category;
}

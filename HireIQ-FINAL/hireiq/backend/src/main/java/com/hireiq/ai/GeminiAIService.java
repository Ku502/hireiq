package com.hireiq.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hireiq.dto.response.AnswerEvaluationResponse;
import com.hireiq.dto.response.GeneratedQuestion;
import com.hireiq.dto.response.InterviewReportResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GeminiAIService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAIService.class);

package com.interviewai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.ai.GeminiApiClient;
import com.interviewai.backend.ai.prompts.AnswerFeedbackPromptBuilder;
import com.interviewai.backend.entity.Answer;
import com.interviewai.backend.entity.Question;
import com.interviewai.backend.repository.AnswerRepository;
import com.interviewai.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class AnswerFeedbackService {

    private final GeminiApiClient geminiApiClient;
    private final AnswerFeedbackPromptBuilder promptBuilder;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnswerFeedbackService(GeminiApiClient geminiApiClient,
                                  AnswerFeedbackPromptBuilder promptBuilder,
                                  QuestionRepository questionRepository,
                                  AnswerRepository answerRepository) {
        this.geminiApiClient = geminiApiClient;
        this.promptBuilder = promptBuilder;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    public Answer submitAnswer(Long userId, Long questionId, String answerText) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        String prompt = promptBuilder.build(
                question.getQuestionText(),
                question.getQuestionType(),
                answerText
        );

        String aiResponse = geminiApiClient.generateContent(prompt);
        String cleanedJson = cleanJsonResponse(aiResponse);

        Answer answer = parseFeedback(cleanedJson);
        answer.setUserId(userId);
        answer.setQuestion(question);
        answer.setAnswerText(answerText);

        return answerRepository.save(answer);
    }

    private String cleanJsonResponse(String raw) {
        return raw.replaceAll("```json", "").replaceAll("```", "").trim();
    }

    private Answer parseFeedback(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            Answer answer = new Answer();
            answer.setClarityScore(node.get("clarityScore").asInt());
            answer.setCorrectnessScore(node.get("correctnessScore").asInt());
            answer.setConfidenceScore(node.get("confidenceScore").asInt());
            answer.setFeedbackSummary(node.get("feedbackSummary").asText());
            answer.setImprovementSuggestion(node.get("improvementSuggestion").asText());
            answer.setModelAnswer(node.get("modelAnswer").asText());
            return answer;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI feedback: " + e.getMessage());
        }
    }
}
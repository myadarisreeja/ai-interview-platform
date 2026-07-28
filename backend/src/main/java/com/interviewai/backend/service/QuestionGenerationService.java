package com.interviewai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.ai.GeminiApiClient;
import com.interviewai.backend.ai.prompts.QuestionGenPromptBuilder;
import com.interviewai.backend.entity.Question;
import com.interviewai.backend.entity.QuestionSet;
import com.interviewai.backend.entity.Resume;
import com.interviewai.backend.repository.QuestionSetRepository;
import com.interviewai.backend.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionGenerationService {

    private final GeminiApiClient geminiApiClient;
    private final QuestionGenPromptBuilder promptBuilder;
    private final ResumeRepository resumeRepository;
    private final QuestionSetRepository questionSetRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionGenerationService(GeminiApiClient geminiApiClient,
                                      QuestionGenPromptBuilder promptBuilder,
                                      ResumeRepository resumeRepository,
                                      QuestionSetRepository questionSetRepository) {
        this.geminiApiClient = geminiApiClient;
        this.promptBuilder = promptBuilder;
        this.resumeRepository = resumeRepository;
        this.questionSetRepository = questionSetRepository;
    }

    // Called the FIRST time — creates a new QuestionSet
    public QuestionSet generateQuestions(Long userId, Long resumeId, String jobRole, int count) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        int safeCount = Math.min(Math.max(count, 1), 20);
        List<Question> questions = fetchQuestionsFromAI(jobRole, resume.getExtractedText(), safeCount);

        QuestionSet questionSet = new QuestionSet();
        questionSet.setUserId(userId);
        questionSet.setResumeId(resumeId);
        questionSet.setJobRole(jobRole);

        attachQuestions(questionSet, questions, 0);
        questionSet.setQuestions(questions);

        return questionSetRepository.save(questionSet);
    }

    // Called on "Generate More" — appends to an EXISTING QuestionSet
    public QuestionSet generateMoreQuestions(Long userId, Long questionSetId, int count) {
        QuestionSet questionSet = questionSetRepository.findById(questionSetId)
                .orElseThrow(() -> new RuntimeException("Question set not found"));

        if (!questionSet.getUserId().equals(userId)) {
            throw new RuntimeException("You do not have access to this question set");
        }

        Resume resume = resumeRepository.findById(questionSet.getResumeId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        int safeCount = Math.min(Math.max(count, 1), 20);
        List<Question> newQuestions = fetchQuestionsFromAI(
                questionSet.getJobRole(), resume.getExtractedText(), safeCount);

        int startOrder = questionSet.getQuestions().size();
        attachQuestions(questionSet, newQuestions, startOrder);

        questionSet.getQuestions().addAll(newQuestions);

        return questionSetRepository.save(questionSet);
    }

    private List<Question> fetchQuestionsFromAI(String jobRole, String resumeText, int count) {
        String prompt = promptBuilder.build(jobRole, resumeText, count);
        String aiResponse = geminiApiClient.generateContent(prompt);
        String cleanedJson = cleanJsonResponse(aiResponse);
        return parseQuestions(cleanedJson);
    }

    private void attachQuestions(QuestionSet questionSet, List<Question> questions, int startOrder) {
        for (int i = 0; i < questions.size(); i++) {
            questions.get(i).setQuestionSet(questionSet);
            questions.get(i).setQuestionOrder(startOrder + i + 1);
        }
    }

    private String cleanJsonResponse(String raw) {
        return raw.replaceAll("```json", "").replaceAll("```", "").trim();
    }

    private List<Question> parseQuestions(String json) {
        List<Question> questions = new ArrayList<>();
        try {
            JsonNode array = objectMapper.readTree(json);
            for (JsonNode node : array) {
                Question q = new Question();
                q.setQuestionText(node.get("questionText").asText());
                q.setQuestionType(node.get("questionType").asText());
                questions.add(q);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI-generated questions: " + e.getMessage());
        }
        return questions;
    }
}
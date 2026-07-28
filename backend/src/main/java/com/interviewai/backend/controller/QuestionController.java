package com.interviewai.backend.controller;

import com.interviewai.backend.entity.QuestionSet;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.repository.UserRepository;
import com.interviewai.backend.service.QuestionGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionGenerationService questionGenerationService;
    private final UserRepository userRepository;

    public QuestionController(QuestionGenerationService questionGenerationService,
                               UserRepository userRepository) {
        this.questionGenerationService = questionGenerationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/generate")
    public ResponseEntity<QuestionSet> generateQuestions(
            @RequestParam Long resumeId,
            @RequestParam String jobRole,
            @RequestParam(defaultValue = "10") int count,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        QuestionSet questionSet = questionGenerationService.generateQuestions(
                user.getId(), resumeId, jobRole, count);

        return ResponseEntity.ok(questionSet);
    }

    @PostMapping("/{questionSetId}/generate-more")
    public ResponseEntity<QuestionSet> generateMoreQuestions(
            @PathVariable Long questionSetId,
            @RequestParam(defaultValue = "10") int count,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        QuestionSet questionSet = questionGenerationService.generateMoreQuestions(
                user.getId(), questionSetId, count);

        return ResponseEntity.ok(questionSet);
    }
}
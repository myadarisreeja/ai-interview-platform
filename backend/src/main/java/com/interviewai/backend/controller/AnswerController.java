package com.interviewai.backend.controller;

import com.interviewai.backend.dto.request.AnswerSubmitRequest;
import com.interviewai.backend.entity.Answer;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.repository.UserRepository;
import com.interviewai.backend.service.AnswerFeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerFeedbackService answerFeedbackService;
    private final UserRepository userRepository;

    public AnswerController(AnswerFeedbackService answerFeedbackService,
                             UserRepository userRepository) {
        this.answerFeedbackService = answerFeedbackService;
        this.userRepository = userRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<Answer> submitAnswer(
            @Valid @RequestBody AnswerSubmitRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerFeedbackService.submitAnswer(
                user.getId(), request.getQuestionId(), request.getAnswerText());

        return ResponseEntity.ok(answer);
    }
}

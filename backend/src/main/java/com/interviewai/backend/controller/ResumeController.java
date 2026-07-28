package com.interviewai.backend.controller;

import com.interviewai.backend.entity.Resume;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.repository.UserRepository;
import com.interviewai.backend.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    public ResumeController(ResumeService resumeService, UserRepository userRepository) {
        this.resumeService = resumeService;
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {

        // "authentication.getName()" gives us the email from the JWT (set in JwtAuthFilter)
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume savedResume = resumeService.uploadResume(user.getId(), file);

        return ResponseEntity.ok(savedResume);
    }
}

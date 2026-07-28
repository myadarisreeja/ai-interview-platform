package com.interviewai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private Question question;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answerText;

    // --- AI Feedback fields ---
    @Column(name = "clarity_score")
    private Integer clarityScore; // 1-10

    @Column(name = "correctness_score")
    private Integer correctnessScore; // 1-10

    @Column(name = "confidence_score")
    private Integer confidenceScore; // 1-10

    @Column(name = "feedback_summary", columnDefinition = "TEXT")
    private String feedbackSummary;

    @Column(name = "improvement_suggestion", columnDefinition = "TEXT")
    private String improvementSuggestion;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt = LocalDateTime.now();

    @Column(name = "model_answer", columnDefinition = "TEXT")
    private String modelAnswer;
}

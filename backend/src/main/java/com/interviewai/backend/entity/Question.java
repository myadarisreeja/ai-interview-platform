package com.interviewai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_set_id", nullable = false)
    @JsonIgnore
    private QuestionSet questionSet;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_type")
    private String questionType; // TECHNICAL, BEHAVIORAL, ROLE_SPECIFIC

    @Column(name = "question_order")
    private Integer questionOrder;
}

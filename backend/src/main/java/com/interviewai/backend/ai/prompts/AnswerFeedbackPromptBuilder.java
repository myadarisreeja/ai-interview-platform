package com.interviewai.backend.ai.prompts;

import org.springframework.stereotype.Component;

@Component
public class AnswerFeedbackPromptBuilder {

    public String build(String questionText, String questionType, String userAnswer) {
        return """
                You are an expert interview coach. Evaluate the candidate's answer to the
                following interview question and give constructive, specific feedback.

                Question Type: %s
                Question: %s

                Candidate's Answer:
                %s

                Evaluate the answer on:
                - Clarity (how well-structured and easy to follow the answer is)
                - Correctness (technical/factual accuracy, or relevance for behavioral questions)
                - Confidence (how assured and decisive the answer sounds)

                Also write a "modelAnswer": a strong sample answer to this exact question,
                written in first person as if the candidate is speaking it in an interview.
                It should be natural, well-structured, and around 3-5 sentences — something
                the candidate could learn from and adapt in their own words, not a lecture
                about what they did wrong.

                IMPORTANT: Respond with ONLY valid JSON, no markdown, no code fences, no explanation.
                Format exactly like this:
                {
                  "clarityScore": <1-10>,
                  "correctnessScore": <1-10>,
                  "confidenceScore": <1-10>,
                  "feedbackSummary": "<2-3 sentence overall assessment>",
                  "improvementSuggestion": "<1-2 specific, actionable tips>",
                  "modelAnswer": "<a strong sample answer spoken in first person>"
                }
                """.formatted(questionType, questionText, userAnswer);
    }
}
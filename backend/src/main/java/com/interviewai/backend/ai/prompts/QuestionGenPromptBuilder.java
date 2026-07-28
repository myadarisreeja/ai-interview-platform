package com.interviewai.backend.ai.prompts;

import org.springframework.stereotype.Component;

@Component
public class QuestionGenPromptBuilder {

    public String build(String jobRole, String resumeText, int count) {
        int technical = (int) Math.ceil(count * 0.4);
        int behavioral = (int) Math.ceil(count * 0.35);
        int roleSpecific = count - technical - behavioral;

        return """
                You are an expert technical interviewer. Based on the job role and resume text below,
                generate exactly %d interview questions: %d technical, %d behavioral, and %d role-specific.
                Do not repeat similar questions — make each one distinct.

                Job Role: %s

                Resume Text:
                %s

                IMPORTANT: Respond with ONLY a valid JSON array, no markdown, no explanation, no code fences.
                Format exactly like this:
                [
                  {"questionText": "...", "questionType": "TECHNICAL"},
                  {"questionText": "...", "questionType": "BEHAVIORAL"},
                  {"questionText": "...", "questionType": "ROLE_SPECIFIC"}
                ]
                """.formatted(count, technical, behavioral, roleSpecific, jobRole, resumeText);
    }
}
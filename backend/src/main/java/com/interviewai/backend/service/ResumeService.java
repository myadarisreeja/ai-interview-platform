package com.interviewai.backend.service;

import com.interviewai.backend.entity.Resume;
import com.interviewai.backend.repository.ResumeRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    @Value("${file.upload-dir:uploads/resumes}")
    private String uploadDir;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public Resume uploadResume(Long userId, MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are supported");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file with a unique name to avoid overwriting
        String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Extract text using PDFBox
        String extractedText;
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            extractedText = stripper.getText(document);
        }

        // Save metadata + extracted text to MySQL
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFileName(originalFileName);
        resume.setFilePath(filePath.toString());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }
}

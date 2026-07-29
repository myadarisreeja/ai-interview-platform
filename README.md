# InterviewAI — AI-Powered Mock Interview Platform
🔗 **Live Demo:** https://ai-interview-platform-hazel-beta.vercel.app

*(Note: first request may take a few seconds if the backend has gone idle on Railway's free tier)*

A full-stack web application that generates personalized interview questions from a candidate's resume and provides instant AI-powered feedback on their answers.

## Features

- **Authentication** — JWT-based signup/login with BCrypt password hashing
- **Resume Upload** — PDF upload with text extraction (Apache PDFBox)
- **AI Question Generation** — Personalized interview questions based on resume + target job role, generated in scalable batches (Google Gemini API)
- **AI Answer Feedback** — Instant scoring (clarity, correctness, confidence) plus a sample answer for every response submitted

## Tech Stack

**Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA, MySQL, JWT, Apache PDFBox
**Frontend:** React (Vite), Material UI, React Router, Axios
**AI:** Google Gemini API

## Architecture


ai-interview-platform/
├── backend/ Spring Boot REST API
└── frontend/ React SPA

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- A Google Gemini API key ([get one free here](https://aistudio.google.com/apikey))

### Backend Setup
```bash
cd backend
# Set environment variables: DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## License

This project is for educational/portfolio purposes.
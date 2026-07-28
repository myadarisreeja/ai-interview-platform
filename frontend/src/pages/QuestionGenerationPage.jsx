import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Rating,
} from '@mui/material';
import { generateQuestions, generateMoreQuestions } from '../api/questionApi';
import { submitAnswer } from '../api/answerApi';

export default function QuestionGenerationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeId = location.state?.resumeId;

  const [jobRole, setJobRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionSet, setQuestionSet] = useState(null);

  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleGenerate = async () => {
    if (!resumeId) {
      setError('No resume selected. Please upload a resume first.');
      return;
    }
    if (!jobRole.trim()) {
      setError('Please enter a target job role');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await generateQuestions(resumeId, jobRole, 10);
      setQuestionSet(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMore = async () => {
    setLoadingMore(true);
    setError('');
    try {
      const response = await generateMoreQuestions(questionSet.id, 10);
      setQuestionSet(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate more questions. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmitAnswer = async (questionId) => {
    const answerText = answers[questionId];
    if (!answerText || !answerText.trim()) return;
    setSubmittingId(questionId);
    try {
      const response = await submitAnswer(questionId, answerText);
      setFeedback((prev) => ({ ...prev, [questionId]: response.data }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get feedback. Please try again.');
    } finally {
      setSubmittingId(null);
    }
  };

  const typeStyles = (type) => {
    if (type === 'TECHNICAL') return { bg: '#EEF2FF', color: '#4F46E5' };
    if (type === 'BEHAVIORAL') return { bg: '#FDF2F8', color: '#DB2777' };
    return { bg: '#F0FDFA', color: '#0D9488' };
  };

  if (!resumeId) {
    return (
      <Box sx={{ p: 5, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No resume selected. Please upload a resume first.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/upload-resume')}>
          Go to Resume Upload
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 760, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Mock Interview
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Answer each question below to get instant AI feedback
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {!questionSet && (
        <Paper elevation={0} sx={{ p: 5, border: '1px solid #E2E8F0' }}>
          <Typography fontWeight={700} mb={2}>
            What role are you preparing for?
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Backend Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleGenerate}
            disabled={loading}
            fullWidth
            sx={{ py: 1.3 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generate Questions'}
          </Button>
        </Paper>
      )}

      {questionSet && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              p: 2.5,
              bgcolor: '#EEF2FF',
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={600} color="#4F46E5">
              {questionSet.questions.length} questions · {questionSet.jobRole}
            </Typography>
          </Box>

          {questionSet.questions.map((q, index) => {
            const qFeedback = feedback[q.id];
            const style = typeStyles(q.questionType);

            return (
              <Paper key={q.id || index} elevation={0} sx={{ p: 3.5, mb: 2.5, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <Chip
                    label={q.questionType.replace('_', ' ')}
                    size="small"
                    sx={{
                      bgcolor: style.bg,
                      color: style.color,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Q{index + 1}
                  </Typography>
                </Box>

                <Typography fontWeight={600} mb={2.5} sx={{ lineHeight: 1.5 }}>
                  {q.questionText}
                </Typography>

                {!qFeedback && (
                  <>
                    <TextField
                      multiline
                      minRows={3}
                      fullWidth
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      disabled={submittingId === q.id || !answers[q.id]?.trim()}
                      onClick={() => handleSubmitAnswer(q.id)}
                    >
                      {submittingId === q.id ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Submit Answer'}
                    </Button>
                  </>
                )}

                {qFeedback && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                        YOUR ANSWER
                      </Typography>
                      <Typography variant="body2">{qFeedback.answerText}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
                      <ScoreDisplay label="Clarity" score={qFeedback.clarityScore} />
                      <ScoreDisplay label="Correctness" score={qFeedback.correctnessScore} />
                      <ScoreDisplay label="Confidence" score={qFeedback.confidenceScore} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.6 }}>
                      {qFeedback.feedbackSummary}
                    </Typography>

                    <Box sx={{ p: 2.5, bgcolor: '#EEF2FF', borderRadius: 2, mb: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="#4F46E5" display="block" mb={0.5}>
                        SUGGESTION
                      </Typography>
                      <Typography variant="body2" color="#3730A3">
                        {qFeedback.improvementSuggestion}
                      </Typography>
                    </Box>

                    <Box sx={{ p: 2.5, bgcolor: '#FFFBEB', borderRadius: 2, border: '1px solid #FDE68A' }}>
                      <Typography variant="caption" fontWeight={700} color="#92400E" display="block" mb={0.5}>
                        SAMPLE ANSWER
                      </Typography>
                      <Typography variant="body2" color="#78350F" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{qFeedback.modelAnswer}"
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            );
          })}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleGenerateMore}
              disabled={loadingMore}
              sx={{ py: 1.2, px: 3 }}
            >
              {loadingMore ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Generate 10 More'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ py: 1.2, px: 3 }}>
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function ScoreDisplay({ label, score }) {
  return (
    <Box>
      <Typography variant="caption" display="block" color="text.secondary" fontWeight={600} mb={0.3}>
        {label.toUpperCase()}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Rating value={score / 2} precision={0.5} readOnly size="small" />
        <Typography variant="caption" color="text.secondary" fontWeight={600}>{score}/10</Typography>
      </Box>
    </Box>
  );
}
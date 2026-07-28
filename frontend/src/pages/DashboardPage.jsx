import { Box, Typography, Paper, Button, Grid, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 22 }}>
          {user?.fullName?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Hey, {firstName} 👋
          </Typography>
          <Typography color="text.secondary">
            {user?.role === 'CANDIDATE' ? `Preparing for: ${user?.targetJobRole || 'your next role'}` : user?.email}
          </Typography>
        </Box>
      </Box>

      {/* Quick action cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap' }}>
        <Paper
          elevation={0}
          onClick={() => navigate('/upload-resume')}
          sx={{
            flex: '1 1 300px',
            p: 4,
            cursor: 'pointer',
            textAlign: 'left',
            border: '1px solid #E2E8F0',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(79,70,229,0.12)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <UploadFileIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Upload Resume
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Add your resume to generate personalized interview questions
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontWeight: 600 }}>
            Get started <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          onClick={() => navigate('/upload-resume')}
          sx={{
            flex: '1 1 300px',
            p: 4,
            cursor: 'pointer',
            textAlign: 'left',
            border: '1px solid #E2E8F0',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(79,70,229,0.12)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: '#FDF2F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <QuizIcon sx={{ color: 'secondary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Practice Interview
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Answer AI-generated questions and get instant feedback
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'secondary.main', fontWeight: 600 }}>
            Start practicing <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Paper>
      </Box>

      {/* Tip / info panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: '#F8FAFC',
          border: '1px dashed #CBD5E1',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
          💡 How it works
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your resume once, then generate as many practice questions as you want.
          Each answer you submit gets scored on clarity, correctness, and confidence —
          plus a sample answer to learn from.
        </Typography>
      </Paper>
    </Box>
  );
}
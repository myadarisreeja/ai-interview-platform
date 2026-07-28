import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      loginUser(response.data);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT: Branding panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background: 'linear-gradient(160deg, #4F46E5 0%, #3730A3 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PsychologyIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>InterviewAI</Typography>
        </Box>

        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, lineHeight: 1.2 }}>
            Ace your next<br />interview with AI.
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 420 }}>
            Upload your resume, get personalized interview questions,
            and receive instant AI feedback on every answer you give.
          </Typography>

          <Stack spacing={1.5}>
            {[
              'Resume-tailored interview questions',
              'Instant AI scoring & feedback',
              'Sample answers to learn from',
            ].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ opacity: 0.9, fontSize: 18 }}>✓</Typography>
                <Typography sx={{ opacity: 0.9 }}>{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          © 2026 InterviewAI. Built for job seekers.
        </Typography>
      </Box>

      {/* RIGHT: Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Log in to continue your interview prep
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.3 }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </Stack>
          </form>

          <Typography mt={4} textAlign="center" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
              Sign up for free
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
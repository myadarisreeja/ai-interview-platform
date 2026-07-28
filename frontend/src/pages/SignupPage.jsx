import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { signup } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    targetJobRole: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signup(formData);
      loginUser(response.data);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Signup failed. Please try again.';
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
            Start practicing<br />in minutes.
          </Typography>
          <Typography sx={{ opacity: 0.85, maxWidth: 420 }}>
            Create your free account, upload your resume, and get a
            personalized mock interview built just for the role you want.
          </Typography>
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
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Create your account
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Free to get started, no credit card needed
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                helperText="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                label="Target Job Role"
                name="targetJobRole"
                fullWidth
                placeholder="e.g. Backend Developer"
                value={formData.targetJobRole}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.3 }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <Typography mt={4} textAlign="center" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
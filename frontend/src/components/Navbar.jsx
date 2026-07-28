import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function Navbar() {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLink = (path, label) => (
    <Button
      onClick={() => navigate(path)}
      sx={{
        color: location.pathname === path ? 'primary.main' : 'text.secondary',
        fontWeight: location.pathname === path ? 700 : 500,
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid #E2E8F0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <PsychologyIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700}>
            InterviewAI
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/upload-resume', 'Upload Resume')}

          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', ml: 2 }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <Button onClick={handleLogout} color="inherit" sx={{ color: 'text.secondary' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  backgroundImage: `url('/your-image-path.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const LoginBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: '16px',
  textAlign: 'center',
  maxWidth: 400,
  width: '90%',
}));

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed.');
      console.error("Login error:", err);
    }
  };

  return (
    <BackgroundContainer>
      <LoginBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Welcome back
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'white', borderRadius: 8 }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'white', borderRadius: 8 }
            }}
          />
          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            gap={2}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Register
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </LoginBox>
    </BackgroundContainer>
  );
}

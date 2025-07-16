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
  backgroundImage: `url('/your-image-path.jpg')`, // replace with actual image path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const RegisterBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: '16px',
  textAlign: 'center',
  maxWidth: 400,
  width: '90%',
}));

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const payload = { username, email, password };
      await api.post('/auth/register', payload);
      alert('Registration successful!');
      navigate('/');
    } catch (err: any) {
      console.error("Registration error:", err);
      alert(err?.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <BackgroundContainer>
      <RegisterBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create an Account
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="dense"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'white', borderRadius: 8 }
            }}
          />
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
          <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Back to Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRegister}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </RegisterBox>
    </BackgroundContainer>
  );
}

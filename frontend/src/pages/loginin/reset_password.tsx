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
  backgroundImage: `url('/your-image-path.jpg')`, // Replace with your actual background path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ResetBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: '16px',
  textAlign: 'center',
  maxWidth: 400,
  width: '90%',
}));

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const payload = {
        email,
        current_password: currentPassword,
        new_password: newPassword,
      };
      await api.post('/auth/reset-password', payload);
      alert('Password reset successful.');
      navigate('/');
    } catch (err: any) {
      console.error("Reset error:", err);
      alert(err?.response?.data?.detail || 'Password reset failed.');
    }
  };

  return (
    <BackgroundContainer>
      <ResetBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { backgroundColor: 'white', borderRadius: 8 } }}
          />
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            variant="outlined"
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{ style: { backgroundColor: 'white', borderRadius: 8 } }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{ style: { backgroundColor: 'white', borderRadius: 8 } }}
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
              onClick={handleResetPassword}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </ResetBox>
    </BackgroundContainer>
  );
}

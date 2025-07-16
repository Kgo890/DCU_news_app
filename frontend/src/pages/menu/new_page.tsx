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
  backgroundImage: `url('/your-image-path.jpg')`, // Replace with your actual image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PageBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: '16px',
  textAlign: 'center',
  maxWidth: 400,
  width: '90%',
}));

export default function NewPage() {
  const navigate = useNavigate();
  const [pageName, setPageName] = useState('');

  const handleSavePage = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.post(
        '/auth/save-page',
        null,
        {
          params: { page: pageName },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(response.data.message);
      navigate('/pages');
    } catch (err: any) {
      console.error("Error saving page:", err);
      alert(err?.response?.data?.detail || 'Failed to save page.');
    }
  };

  return (
    <BackgroundContainer>
      <PageBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create a New Page
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Page Name"
            variant="outlined"
            margin="dense"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            InputProps={{
              style: { backgroundColor: 'white', borderRadius: 8 }
            }}
          />
          <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Back
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSavePage}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#444',
                '&:hover': { backgroundColor: '#222' }
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </PageBox>
    </BackgroundContainer>
  );
}

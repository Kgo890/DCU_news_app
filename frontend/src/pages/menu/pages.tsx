import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  backgroundImage: `url('/your-image-path.jpg')`, // Replace with actual path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PagesBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: '16px',
  textAlign: 'center',
  maxWidth: 500,
  width: '90%',
}));

export default function SavedPages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<string[]>([]);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.get('/auth/saved-pages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPages(response.data.saved_pages || []);
    } catch (err: any) {
      console.error("Error fetching pages:", err);
      alert(err?.response?.data?.detail || "Failed to load pages.");
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <BackgroundContainer>
      <PagesBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Your Saved Pages
        </Typography>

        {pages.length === 0 ? (
          <Typography mt={2}>No pages saved yet.</Typography>
        ) : (
          <List>
            {pages.map((page, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={page} />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={3}>
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
            Back to Dashboard
          </Button>
        </Box>
      </PagesBox>
    </BackgroundContainer>
  );
}

import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';


const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  backgroundImage: `url('/your-image-path.jpg')`, // Replace with real path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
});

const DashboardBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(5),
  borderRadius: '16px',
  maxWidth: 1000,
  width: '100%',
}));

const ActionButton = styled(Button)({
  borderRadius: '20px',
  padding: '10px 20px',
  backgroundColor: '#444',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#222',
  },
  width: '100%',
});

export default function Dashboard() {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Scrape Posts', path: '/scrape' },
    { label: 'Get All Posts', path: '/posts' },
    { label: 'Filter By Subreddit', path: '/filter-subreddit' },
    { label: 'Filter By Date Range', path: '/filter-date' },
    { label: 'Search by Keyword', path: '/filter-keyword' },
    { label: 'Verified Subreddits', path: '/verified' },
    { label: 'Delete Post By ID', path: '/delete-id' },
    { label: 'Delete All Posts', path: '/delete-all' },
    { label: 'Timeline', path: '/timeline' },
  ];

  return (
    <BackgroundContainer>
      <DashboardBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={2} mt={2}>
          {buttons.map(({ label, path }) => (
            <Grid item xs={12} sm={6} md={4} key={path}>
              <ActionButton onClick={() => navigate(path)}>
                {label}
              </ActionButton>
            </Grid>
          ))}
        </Grid>
        <Box mt={4}>
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
            Logout
          </Button>
        </Box>
      </DashboardBox>
    </BackgroundContainer>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  backgroundImage: `url('/your-image-path.jpg')`, // Replace with actual image path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
});

const TimelineBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(4),
  borderRadius: '16px',
  maxWidth: 800,
  width: '100%',
}));

export default function Timeline() {
  const navigate = useNavigate();
  const [timelinePosts, setTimelinePosts] = useState<Record<string, any[]> | null>(null);

  const fetchTimeline = async () => {
    try {
      const response = await api.get('/reddit/timeline');
      setTimelinePosts(response.data);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
      alert('Could not load timeline.');
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <BackgroundContainer>
      <TimelineBox elevation={3}>
        <Typography variant="h5" gutterBottom>
          DCU News Timeline
        </Typography>

        {timelinePosts ? (
          Object.entries(timelinePosts).map(([date, posts]) => (
            <Box key={date} mt={3}>
              <Typography variant="h6">{date}</Typography>
              <Divider sx={{ mb: 1 }} />
              {posts.map((post: any, idx: number) => (
                <Paper
                  key={idx}
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="subtitle1">{post.title}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {post.subreddit}
                  </Typography>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    View Post
                  </a>
                </Paper>
              ))}
            </Box>
          ))
        ) : (
          <Typography mt={2}>Loading timeline...</Typography>
        )}

        <Box mt={4}>
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
      </TimelineBox>
    </BackgroundContainer>
  );
}

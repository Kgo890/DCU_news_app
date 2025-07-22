import React, { useState, useEffect } from "react";
import api from "../auth/axios";
import SearchAppBar from "../components/AppBar";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Box,
} from "@mui/material";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTimeline();
  }, []);

  async function fetchTimeline() {
    try {
      const response = await api.get("/reddit/timeline");

      // Ensure a safe structure
      const data = Array.isArray(response.data.message)
        ? response.data.message.map((item) => ({
            ...item,
            posts: Array.isArray(item.posts) ? item.posts : [],
          }))
        : [];

      setTimeline(data);
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
    }
  }

  return (
    <>
      <SearchAppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Box
        sx={{
          backgroundImage: "url('/timeline.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            DCU News Timeline
          </Typography>

          {timeline.length === 0 ? (
            <Typography>No timeline data available.</Typography>
          ) : (
            timeline.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: "30px" }}>
                <Typography variant="h6" gutterBottom>
                  {entry.date}
                </Typography>
                <Divider style={{ marginBottom: "10px" }} />

                {entry.posts.length > 0 ? (
                  <Grid container spacing={2}>
                    {entry.posts.map((post, postIdx) => (
                      <Grid item xs={12} sm={6} md={4} key={postIdx}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1">{post.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {post.subreddit}
                            </Typography>
                            <Typography variant="body2">{post.text}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No posts for this date.
                  </Typography>
                )}
              </div>
            ))
          )}
        </Container>
      </Box>
    </>
  );
}

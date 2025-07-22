import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../auth/axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import SearchAppBar from "../components/AppBar";

export default function CharacterPage() {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCharacterPosts();
  }, [name]);

  async function fetchCharacterPosts() {
    try {
      const response = await api.get("/reddit/posts-by-keyword", {
        params: { keyword: name },
      });
      setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
    } catch (error) {
      console.error("Failed to fetch character posts:", error);
    }
  }

  return (
      <>
     <SearchAppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Typography variant="h4" gutterBottom>
        Posts about: {name}
      </Typography>

      {posts.length === 0 ? (
        <Typography variant="body1">No posts found for this character.</Typography>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.subreddit} — {post.date}
                  </Typography>
                  <Typography variant="body2">{post.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  </>
  );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../auth/axios";
import RedditPostCard from "../components/RedditPostCard";
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
                <RedditPostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  </>
  );
}

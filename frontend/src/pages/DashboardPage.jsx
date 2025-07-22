import React, { useState, useEffect } from "react";
import api from "../auth/axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import SearchAppBar from "../components/AppBar";
import RedditPostCard from "../components/RedditPostCard";

export default function Dashboard() {
  const [subreddit, setSubreddit] = useState("");
  const [max_posts, setMaxPosts] = useState("");
  const [tags, setTags] = useState("");
  const [sort, setSort] = useState("");
  const [time, setTime] = useState("");
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [reddit, setReddit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    getAllPosts();
  }, []);

  async function getAllPosts() {
    try {
      const response = await api.get("/reddit/posts");
      console.log("Post fetched:", response.data);
      setReddit(response.data);
    } catch (error) {
      console.error("Fetching all posts failed", error);
    }
  }

  async function scrapingReddit() {
    try {
      const response = await api.post("/reddit/scrape", null, {
        params: {
          subreddit,
          max_posts: parseInt(max_posts),
          sort: sort,
          time_filter: time,
        },
      });
      setReddit(response.data);
      setSubreddit("");
      setMaxPosts("");
      setSort("");
      setTime("");
    } catch (error) {
      console.error("Scrape failed", error.response?.data || error.message);
    }
  }

  async function gettingPostsBySubreddit() {
    try {
      const response = await api.get("/reddit/posts-by-subreddit", {
        params: { subreddit },
      });
      setReddit(response.data);
      setSubreddit("");
    } catch (error) {
      console.error("Post by subreddit failed", error);
    }
  }

  async function gettingPostsByDate() {
    try {
      const response = await api.get("/reddit/posts-by-date-range", {
        params: {
          from_date: `${from_date}T00:00:00`,
          to_date: `${to_date}T23:59:59`,
        },
      });
      setReddit(response.data);
    } catch (error) {
      console.error("Post by date range failed", error.response?.data || error.message);
    }
  }

  async function gettingPostsByKeyword() {
    try {
      const response = await api.get("/reddit/posts-by-keyword", {
        params: { keyword },
      });
      setReddit(response.data);
    } catch (error) {
      console.error("Post by keyword failed", error);
    }
  }

  async function deletingAllPost() {
    try {
      const response = await api.delete("/reddit/delete-all-post");
      setReddit([]);
    } catch (error) {
      console.error("Delete all posts failed", error);
    }
  }

  async function deletePostById(postId) {
    try {
      const response = await axios.delete("/reddit/delete-post-by-id", {
        params: { post_id: postId },
      });
      console.log(response.data.message);
      await getAllPosts()
    } catch (error) {
      console.error("Delete by post id failed", error);
    }
  }

  return (
    <>
      <SearchAppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/dashboard.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-around",
          padding: 5,
        }}
      >
        {/* Left Control Panel */}
        <Paper elevation={6} sx={{ padding: 3, backgroundColor: "#666", color: "#fff", width: 350 }}>
          <Typography variant="h6" gutterBottom>Dashboard Controls</Typography>

          <TextField fullWidth label="Subreddit" margin="dense" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} />
          <TextField fullWidth label="Max_posts" margin="dense" value={max_posts} onChange={(e) => setMaxPosts(e.target.value)} />
          <TextField fullWidth label="Sort" margin="dense" value={sort} onChange={(e) => setSort(e.target.value)} />
          <TextField fullWidth label="Time Filter" margin="dense" value={time} onChange={(e) => setTime(e.target.value)} />
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={scrapingReddit}>Scrape</Button>

          <TextField fullWidth label="Keyword" margin="dense" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={gettingPostsByKeyword}>Search By Keyword</Button>

          <TextField
            fullWidth
            label="Subreddit"
            variant="outlined"
            margin="normal"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={gettingPostsBySubreddit}>Filter By Subreddit</Button>

          <TextField fullWidth label="From Date" type="date" margin="dense" InputLabelProps={{ shrink: true }} value={from_date} onChange={(e) => setFromDate(e.target.value)} />
          <TextField fullWidth label="To Date" type="date" margin="dense" InputLabelProps={{ shrink: true }} value={to_date} onChange={(e) => setToDate(e.target.value)} />
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={gettingPostsByDate}>Filter By Date</Button>

          <Button fullWidth sx={{ mt: 2, backgroundColor: "red", color: "white" }} onClick={deletingAllPost}>Delete All Posts</Button>
        </Paper>

        {/* Right Content Panel */}
        <Paper sx={{ padding: 2, backgroundColor: "rgba(255,255,255,0.9)", width: "50%" }}>
          <Typography variant="h6" gutterBottom>Reddit Posts:</Typography>
          {Array.isArray(reddit) && reddit.length > 0 ? (
            reddit.map((post, index) => {
              return (
                <RedditPostCard
                  key={post.id}
                  post={post}
                  onDelete={deletePostById}
                />
              );
            })
          ) : (
            <Typography>No posts available</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}

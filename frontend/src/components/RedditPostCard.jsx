import React from "react";
import { Card, CardContent, Typography, Chip, Box, Link,IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RedditPostCard({ post, onDelete }) {
    const redditEmbedUrl = post.link?.includes("reddit.com")
    ? `https://www.redditmedia.com${post.link.replace("https://reddit.com", "")}?ref_source=embed&ref=share&embed=true`
    : null;

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1, pt: 1 }}>
            <IconButton
              onClick={() => {
                const id = post.id;
                console.log("Deleting post_id:", id);
                if (id) {
                  onDelete(id);
                } else {
                  console.warn("Post ID is undefined!");
                }
              }}
              aria-label="delete"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>

      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {post.author ? `u/${post.author} • ` : ""}
          {new Date(post.scraped_at).toLocaleString()}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>

        {post.tag && (
          <Chip label={post.tag} size="small" sx={{ mb: 1 }} />
        )}

        {/* Use Reddit embed for native playback support */}
         {post.is_reddit_video ? (
          <Box mt={2}>
            <iframe
              src={`https://www.redditmedia.com${post.link.replace("https://reddit.com", "")}?ref_source=embed&ref=share&embed=true`}
              style={{
                border: "none",
                width: "100%",
                height: "600px",
                borderRadius: 8,
                overflow: "hidden",
              }}
              scrolling="yes"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Reddit video embed"
            />
          </Box>
        ) : post.image_url ? (
          <Box mt={2}>
            <img
              src={post.image_url}
              alt={post.title || "Reddit post image"}
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: 8,
                display:"block",
                margin: "0 auto"
              }}
              referrerPolicy="no-referrer"
            />
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}

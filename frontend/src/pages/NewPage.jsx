import React, { useState } from "react";
import api from "../auth/axios";
import SearchAppBar from "../components/AppBar";
import {
  Container,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NewPage() {
  const [page, setPage] = useState("");
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API + "/auth";

  async function savePage() {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.post(
        `${BASE_URL}/save-page`,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setSnackbar({ open: true, message: "Page saved successfully!", severity: "success" });
      setPage("");

      setTimeout(() => {
        navigate(`/character/${page}`);
      }, 1500);
    } catch (error) {
      console.error("Save Page failed", error);
      const detail = error.response?.data?.detail;

      setSnackbar({
        open: true,
        message: typeof detail === "string"
          ? detail
          : typeof detail?.msg === "string"
          ? detail.msg
          : "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  }

  return (
    <>
      <SearchAppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('/new_page.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="sm" sx={{ backgroundColor: "rgba(255,255,255,0.9)", padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Save a Character Page
          </Typography>
          <TextField
            fullWidth
            label="Page Name (e.g. Superman)"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={savePage} disabled={!page}>
            Save Page
          </Button>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
}

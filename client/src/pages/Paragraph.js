import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Collapse,
  Card,
  CircularProgress,
  IconButton,
  Container,
} from "@mui/material";
import { Clear, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Paragraph = () => {
  const [text, setText] = useState("");
  const [para, setPara] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to generate a paragraph");
      return;
    }

    setLoading(true);
    setPara("");
    setError("");

    try {
      const { data } = await axios.post("/api/v1/cohere/paragraph", { text });
      setPara(data.paragraph);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to generate paragraph";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        width={{ xs: "90%", md: "60%" }}
        mx="auto"
        p={4}
        borderRadius={2}
        sx={{ boxShadow: 3, backgroundColor: "white" }}
      >
        <Box sx={{ marginBottom: "1rem" }}>
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{ color: "#1976d2", borderColor: "#1976d2" }}
          >
            Back to Home
          </Button>
        </Box>

        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError("")}
              >
                <Clear fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>

        <Typography variant="h4" sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}>
          Paragraph Generator
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Enter text to generate a paragraph..."
            fullWidth
            multiline
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ backgroundColor: "#1976d2" }}
            disabled={loading || !text.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Generate"}
          </Button>
        </form>

        <Card
          sx={{
            mt: 4,
            border: 1,
            boxShadow: 0,
            height: "300px",
            borderRadius: 2,
            borderColor: "divider",
            bgcolor: "background.default",
            overflowY: "auto",
            p: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : para ? (
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {para}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Your paragraph will appear here
            </Typography>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default Paragraph;

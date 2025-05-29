import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Card,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ImageAI = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImage("");
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/cohere/generate-image", { prompt });
      setImage(data.image);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box p={4} borderRadius={2} sx={{ boxShadow: 3, backgroundColor: "white" }}>
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
        <Typography variant="h4" sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}>
          AI Image Generator
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter your prompt"
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ backgroundColor: "#1976d2", color: "white" }}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Image"}
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {image && (
          <Card sx={{ mt: 4, p: 2, textAlign: "center", background: "#f9f9f9" }}>
            <img src={image} alt="AI Generated" style={{ maxWidth: "100%", borderRadius: 8 }} />
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ImageAI;

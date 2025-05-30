import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
  Card,
  CircularProgress,
  IconButton,
  Container,
} from "@mui/material";
import { Clear, ContentCopy, ArrowBack } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const isNotMobile = useMediaQuery("(min-width: 900px)");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/cohere/summary`, { text });
      setSummary(data.summary || data);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to generate summary";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        width={isNotMobile ? "60%" : "90%"}
        mx="auto"
        p={4}
        borderRadius={2}
        sx={{
          boxShadow: 3,
          backgroundColor: "white",
        }}
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

        <form onSubmit={handleSubmit}>
          <Typography
            variant="h4"
            sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}
          >
            Text Summarizer
          </Typography>

          <TextField
            placeholder="Enter text to summarize..."
            type="text"
            multiline
            rows={6}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: text && (
                <IconButton onClick={handleClear} disabled={loading}>
                  <Clear />
                </IconButton>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              py: 1.5,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            disabled={loading || !text.trim()}
          >
            {loading ? "Generating..." : "Generate Summary"}
          </Button>
        </form>

        <Card
          sx={{
            mt: 4,
            p: 3,
            minHeight: "200px",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            position: "relative",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : summary ? (
            <>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(summary);
                  toast.success("Copied to clipboard!");
                }}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
              <Typography whiteSpace="pre-wrap">{summary}</Typography>
            </>
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Your summary will appear here
            </Typography>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default Summary;
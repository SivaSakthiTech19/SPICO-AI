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

const Codeconverter = () => {
  const isNotMobile = useMediaQuery("(min-width: 900px)");
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please describe what code you want to generate");
      return;
    }

    setLoading(true);
    setCode("");
    setError("");

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/cohere/codeconverter`, { text });
      setCode(data.code || data);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to generate code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setCode("");
    setError("");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
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
          <Typography variant="h4" sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}>
            Code Generator
          </Typography>

          <TextField
            placeholder="Describe what you want the code to do (e.g., 'Python function to calculate factorial')"
            type="text"
            multiline
            rows={4}
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
            {loading ? "Generating..." : "Generate Code"}
          </Button>
        </form>

        <Card
          sx={{
            mt: 4,
            p: 3,
            minHeight: "300px",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#f5f9ff",
            position: "relative",
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : code ? (
            <>
              <IconButton onClick={handleCopyCode} sx={{ position: "absolute", top: 8, right: 8 }}>
                <ContentCopy fontSize="small" />
              </IconButton>
              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  color: "#2d3748",
                  backgroundColor: "#f5f9ff",
                  p: 2,
                  borderRadius: 1,
                  overflowX: "auto",
                }}
              >
                {code}
              </Box>
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
              Your generated code will appear here
            </Typography>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default Codeconverter;

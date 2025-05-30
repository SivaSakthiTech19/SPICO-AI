import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Collapse,
  CircularProgress,
  IconButton,
  Container,
} from "@mui/material";
import { Clear, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a message");
      return;
    }

    setMessages((prevMessages) => [...prevMessages, { text, sender: "user" }]);
    setLoading(true);
    setText("");
    setError("");

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/cohere/chatbot`, { text });
      setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: "bot" }]);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to get a response";
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
          ChatBot
        </Typography>

        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            marginBottom: 2,
            padding: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: 1,
                color: msg.sender === "user" ? "primary.main" : "text.secondary",
              }}
            >
              {msg.sender === "user" ? "You: " : "Bot: "}
              {msg.text}
            </Typography>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Type your message..."
            fullWidth
            multiline
            rows={3}
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
            {loading ? <CircularProgress size={24} /> : "Send"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Chatbot;



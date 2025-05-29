import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Text Summary",
    desc: "Summarize long text into concise versions",
    path: "/summary",
    icon: "📝",
  },
  {
    title: "Paragraph Generator",
    desc: "Generate well-structured paragraphs from ideas",
    path: "/paragraph",
    icon: "✍️",
  },
  {
    title: "AI Chatbot",
    desc: "Chat with your intelligent AI assistant",
    path: "/chatbot",
    icon: "💬",
  },
  {
    title: "Code Generator",
    desc: "Convert English descriptions to functional code",
    path: "/codeconverter",
    icon: "💻",
  },
  {
    title: "AI Image Generator",
    desc: "Generate images from text prompts using AI",
    path: "/imageai",
    icon: "🖼️",
  },
];

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f8ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#1976d2",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box mb={6}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Welcome to SPICO AI
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Your powerful suite of AI tools for content creation and development
          </Typography>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={4} justifyContent="center">
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                component={Link}
                to={tool.path}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  backgroundColor: "white",
                  color: "#1976d2",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {tool.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1.5,
                      fontWeight: "bold",
                    }}
                  >
                    {tool.title}
                  </Typography>
                  <Typography variant="body2">{tool.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

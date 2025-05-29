const axios = require("axios");
const dotenv = require("dotenv");
const { CohereClient } = require("cohere-ai");

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const cohereChat = async (message, temperature = 0.5) => {
  try {
    const res = await cohere.chat({
      model: "command-medium-nightly",
      message,
      temperature,
    });
    return res.text;
  } catch (error) {
    console.error("Cohere Chat API Error:", error.message);
    throw new Error("Failed to connect to the language model.");
  }
};

const fetchWikipediaSummary = async (query) => {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

  try {
    const searchResponse = await axios.get(searchUrl);
    const pageTitle = searchResponse.data.query.search[0]?.title;

    if (!pageTitle) {
      return "No relevant information found on Wikipedia.";
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryResponse = await axios.get(summaryUrl);
    return summaryResponse.data.extract || "No summary available.";
  } catch (error) {
    console.error("Wikipedia API Error:", error.message);
    return "Failed to fetch Wikipedia data. Please try again later.";
  }
};

// === Fallback Chatbot ===
const fallbackResponses = {
  "what is your name": "I am a chatbot created to assist you with various tasks.",
  "who are you": "I am a virtual assistant here to help you with your queries.",
  "tell me a joke": "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "hi": "Hello! How can I assist you today?",
  "machine learning": "Machine learning is a branch of artificial intelligence focused on building systems that learn from data.",
  "what is spico": "SPICO is an AI tools platform.", 
};

// === Chatbot Controller ===
const chatbotController = async (req, res) => {
  const { text } = req.body;
  const normalizedText = text.trim().toLowerCase();
  if (fallbackResponses[normalizedText]) {
    return res.status(200).json({ message: fallbackResponses[normalizedText] });
  }

  try {
    const wikiAnswer = await fetchWikipediaSummary(text);
    if (wikiAnswer) {
      return res.status(200).json({ message: wikiAnswer });
    }

    const cohereResponse = await cohereChat(`Tell me about: ${text}`);
    return res.status(200).json({ message: cohereResponse });
  } catch (error) {
    console.error("Chatbot Error:", error.message);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

// === Summary Controller ===
const summaryController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Please provide valid text." });
    }

    const summary = await cohereChat(`Summarize the following text:\n\n${text}`, 0.3);
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summary Error:", err.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
};

// === Paragraph Controller ===
const paragraphController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Invalid input text." });
    }

    const paragraph = await cohereChat(`Write a detailed and informative paragraph about: ${text}`, 0.6);
    res.status(200).json({ paragraph });
  } catch (error) {
    console.error("Paragraph Generation Error:", error.message);
    res.status(500).json({ error: "Failed to generate paragraph." });
  }
};

// === Code Converter Controller ===
const codeconverterController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `Write a Python function to ${text}`;
    const code = await cohereChat(prompt, 0.3);
    res.status(200).json({ language: "Python", description: text, code });
  } catch (err) {
    console.error("Code Converter Error:", err.message);
    res.status(500).json({ error: "Code generation failed." });
  }
};

module.exports = {
  summaryController,
  paragraphController,
  codeconverterController,
  chatbotController,
};

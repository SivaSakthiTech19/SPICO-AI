const axios = require("axios");
const dotenv = require("dotenv");
const { CohereClient } = require("cohere-ai");

dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// === Cohere Chat Function ===
const cohereChat = async (message, temperature = 0.5) => {
  try {
    console.log("Cohere API Call:", { message, temperature });
    const res = await cohere.chat({
      model: "command-r",
      message,
      temperature,
    });
    console.log("Cohere Response:", res.text);
    return res.text;
  } catch (error) {
    console.error("Cohere Chat API Error:", error.message || error);
    throw new Error("Failed to connect to the Cohere API.");
  }
};

// === Fetch Wikipedia Summary ===
const fetchWikipediaSummary = async (query) => {
  try {
    console.log("Fetching Wikipedia summary for:", query);
    
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "SPICO-AI/1.0 (Educational Project)"
      },
      timeout: 5000
    });
    
    const pageTitle = searchResponse.data.query.search[0]?.title;
    console.log("Wikipedia page found:", pageTitle);

    if (!pageTitle) {
      return "";
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryResponse = await axios.get(summaryUrl, {
      headers: {
        "User-Agent": "SPICO-AI/1.0 (Educational Project)"
      },
      timeout: 5000
    });
    
    const extract = summaryResponse.data.extract || "";
    console.log("Wikipedia extract fetched successfully");
    return extract;
  } catch (error) {
    console.error("Wikipedia API Error:", error.message);
    return "";
  }
};

// === Summary Controller ===
const summaryController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Please provide valid text." });
    }

    console.log("Summary request:", text);
    const summary = await cohereChat(`Summarize the following text:\n\n${text}`, 0.3);
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summary Error:", err.message);
    res.status(500).json({ error: err.message || "Failed to generate summary." });
  }
};

// === Paragraph Controller ===
const paragraphController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Invalid input text." });
    }

    console.log("Paragraph request:", text);
    const paragraph = await cohereChat(`Write a detailed and informative paragraph about: ${text}`, 0.6);
    res.status(200).json({ paragraph });
  } catch (error) {
    console.error("Paragraph Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate paragraph." });
  }
};

// === Chatbot Controller ===
const chatbotController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Please provide valid text." });
    }

    console.log("Chatbot request:", text);

    // Try Wikipedia first
    const wikiAnswer = await fetchWikipediaSummary(text);
    if (wikiAnswer && wikiAnswer.trim()) {
      return res.status(200).json({ message: wikiAnswer });
    }

    // Fall back to Cohere
    const cohereResponse = await cohereChat(`Tell me about: ${text}`, 0.7);
    res.status(200).json({ message: cohereResponse });
  } catch (error) {
    console.error("Chatbot Error:", error.message);
    res.status(500).json({ error: error.message || "Something went wrong, please try again later." });
  }
};

// === Code Converter Controller ===
const codeconverterController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("Code converter request:", text);
    const code = await cohereChat(`Write a Python function to ${text}`, 0.3);
    res.status(200).json({ language: "Python", description: text, code });
  } catch (err) {
    console.error("Code Converter Error:", err.message);
    res.status(500).json({ error: err.message || "Code generation failed." });
  }
};

module.exports = {
  summaryController,
  paragraphController,
  codeconverterController,
  chatbotController,
};

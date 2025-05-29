const axios = require("axios");

exports.generateImage = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
    res.status(200).json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error("Clipdrop API error:", error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
};

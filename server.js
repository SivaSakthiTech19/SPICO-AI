const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const imageProcessingRoutes = require("./routes/imageProcessingRoutes");
const huggingRoutes = require("./routes/huggingRoutes");

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected".green.bold);
  } catch (error) {
    console.error("MongoDB connection failed:".red, error);
    process.exit(1);
  }
};
startServer();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: "https://spico-ai-v1-h3c07lbq9-sivasakthis-projects-b15394a7.vercel.app/",
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/image", imageProcessingRoutes);
app.use("/api/v1/cohere", huggingRoutes);

// Serve React frontend static files from the build folder
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE || "development"} mode on port ${PORT}`.bgCyan.white
  );
});


const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const imageProcessingRoutes = require("./routes/imageProcessingRoutes");
const huggingRoutes = require("./routes/huggingRoutes"); 

// Connect to MongoDB
const startServer = async () => {
  await connectDB();
};

startServer();
// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/image", imageProcessingRoutes);
app.use("/api/v1/cohere", huggingRoutes); 


app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});

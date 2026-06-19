const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const userMovieRoutes = require("./routes/userMovieRoutes");
const historyRoutes = require("./routes/historyRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Enable CORS
app.use(cors());

// Serve static files from uploads folder
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API is running" });
});

// Mount routers
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-movies", userMovieRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/recommendations", recommendationRoutes);

// 404 Handler (MUST BE AFTER ROUTES)
app.use((req, res, next) => {
  console.log(`[DEBUG] 404 Handler hit for ${req.originalUrl}`);
  res.status(404).json({
    message: `Not Found - ${req.originalUrl}`,
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in development mode on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;

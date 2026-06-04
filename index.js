const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API is running" });
});

// Mount routers
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

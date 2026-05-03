import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

// Connect to database and then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./server.js";

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/movies";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected 🔥");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./server.js";

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/movies";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is alive 😎");
});

app.listen(5000, () => console.log("Server running on port 5000"));

import express from "express";
import cors from "cors";
import reviews from "./api/reviews.rout.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/reviews", reviews);

app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));

export default app;
// app.listen(5000, () => console.log("Server running on port 5000"));

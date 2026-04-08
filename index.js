import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();

const port = Number(process.env.PORT) || 8000;

function getMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const cluster = process.env.MONGO_CLUSTER || "cluster0.ayr9czp.mongodb.net";
  const dbName = process.env.MONGO_DB_NAME || "moviesDB";

  if (!username || !password) {
    return null;
  }

  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority`;
}

async function startServer() {
  const mongoUri = getMongoUri();

  // Setup connection event listeners
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB Cluster");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });

  if (!mongoUri) {
    console.error(
      "Mongo config missing. Set MONGO_URI or MONGO_USERNAME and MONGO_PASSWORD.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 60,
      serverSelectionTimeoutMS: 2500,
    });

    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });

  } catch (err) {
    console.error(err.stack || err.message || err);
    process.exit(1);
  }
}

startServer();


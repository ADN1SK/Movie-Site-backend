const express = require("express");
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const {
  getReviewsByMovieId,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.route("/").get(getMovies).post(createMovie);

// TMDB Proxy fallback for non-hex IDs (like 'trending', 'popular', etc.)
router.get("/*", async (req, res, next) => {
  const path = req.params[0];

  // If it starts with a numeric ID, it's treated as a local DB movie request
  if (/^\d+(\/|$)/.test(path) || path === "" || path === "/") {
    return next();
  }

  // Otherwise, proxy to TMDB
  if (!process.env.TMDB_API_KEY) {
    return res
      .status(500)
      .json({ error: "TMDB API Key is missing from server configuration" });
  }

  const tmdbUrl = `https://api.themoviedb.org/3/${path}${req.url.includes("?") ? "&" : "?"}api_key=${process.env.TMDB_API_KEY}`;

  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch from TMDB", message: error.message });
  }
});

router.route("/:id").get(getMovieById).put(updateMovie).delete(deleteMovie);

// Nested routes for reviews under a movie
router.route("/:id/reviews").get(getReviewsByMovieId).post(createReview);

module.exports = router;

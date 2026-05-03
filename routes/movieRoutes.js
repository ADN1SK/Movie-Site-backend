import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import {
  getReviewsByMovieId,
  createReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/').get(getMovies).post(createMovie);

// TMDB Proxy fallback for non-hex IDs (like 'trending', 'popular', etc.)
router.get('/*', async (req, res, next) => {
  const path = req.params[0];
  
  // If it's a 24-char hex ID, it's a local DB movie, so pass to next handler
  if (/^[a-f\d]{24}$/.test(path) || path === "" || path === "/") {
    return next();
  }

  // Otherwise, proxy to TMDB
  const tmdbUrl = `https://api.themoviedb.org/3/${path}${req.url.includes("?") ? "&" : "?"}api_key=${process.env.TMDB_API_KEY}`;
  
  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from TMDB", message: error.message });
  }
});

router.route('/:id').get(getMovieById).put(updateMovie).delete(deleteMovie);

// Nested routes for reviews under a movie
router.route('/:id/reviews').get(getReviewsByMovieId).post(createReview);

export default router;

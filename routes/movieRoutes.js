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
router.route('/:id').get(getMovieById).put(updateMovie).delete(deleteMovie);

// Nested routes for reviews under a movie
router.route('/:id/reviews').get(getReviewsByMovieId).post(createReview);

export default router;

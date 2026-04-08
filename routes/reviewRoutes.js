import express from 'express';
import {
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// Routes for individual review management
router.route('/:id').put(updateReview).delete(deleteReview);

export default router;

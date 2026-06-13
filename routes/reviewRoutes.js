const express = require("express");
const {
  createReview,
  getReviewsByUserId,
  updateReview,
  deleteReview,
  getAllReviews,
  getCommentsByReviewId,
  createComment,
} = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/reviews
// @route   POST /api/reviews
router.route("/").get(getAllReviews).post(auth, createReview);

// @route   GET /api/reviews/:id/comments
// @route   POST /api/reviews/:id/comments
router.route("/:id/comments").get(getCommentsByReviewId).post(auth, createComment);

// @route   GET /api/reviews/:userId
router.route("/:userId").get(getReviewsByUserId);

// @route   PUT /api/reviews/manage/:id
// @route   DELETE /api/reviews/manage/:id
// Note: Moved to /manage/:id to avoid conflict with /:userId if userId is a number
router.route("/manage/:id").put(auth, updateReview).delete(auth, deleteReview);

module.exports = router;

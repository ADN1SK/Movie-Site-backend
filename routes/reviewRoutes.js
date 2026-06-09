const express = require("express");
const {
  createReview,
  getReviewsByUserId,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/reviews
router.route("/").post(auth, createReview);

// @route   GET /api/reviews/:userId
router.route("/:userId").get(getReviewsByUserId);

// @route   PUT /api/reviews/manage/:id
// @route   DELETE /api/reviews/manage/:id
// Note: Moved to /manage/:id to avoid conflict with /:userId if userId is a number
router.route("/manage/:id").put(auth, updateReview).delete(auth, deleteReview);

module.exports = router;

const express = require("express");
const { updateReview, deleteReview } = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Routes for individual review management
router.route("/:id").put(auth, updateReview).delete(auth, deleteReview);

module.exports = router;

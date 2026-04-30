import express from "express";
import { updateReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for individual review management
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

export default router;

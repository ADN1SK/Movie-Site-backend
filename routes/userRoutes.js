import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Correct path to authMiddleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile);

export default router;

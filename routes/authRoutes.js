const express = require("express");
const router = express.Router();
const { registerUser, authUser, getUserProfile, logoutUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", logoutUser);

module.exports = router;

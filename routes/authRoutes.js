const express = require("express");
const router = express.Router();
const { registerUser, authUser, getUserProfile, updateUserProfile, logoutUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/logout", logoutUser);

module.exports = router;

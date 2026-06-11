const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getRecommendations);

module.exports = router;

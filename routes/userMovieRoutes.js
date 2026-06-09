const express = require("express");
const router = express.Router();
const { addItem, getItems, removeItem } = require("../controllers/userMovieController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware); // Protect all routes

router.post("/", addItem);
router.get("/:type", getItems);
router.delete("/:type/:tmdb_movie_id", removeItem);

module.exports = router;

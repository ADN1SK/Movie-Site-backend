const express = require("express");
const router = express.Router();
console.log("Loading history routes...");
const { addItem, getItems, clearHistory } = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware); // Protect all routes

router.post("/", addItem);
router.get("/", getItems);
router.delete("/", clearHistory);

console.log("History router stack:", router.stack);
module.exports = router;

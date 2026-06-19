const express = require("express");
const router = express.Router();
console.log("Loading history routes...");
const { addItem, getItems, clearHistory, deleteItem } = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware); // Protect all routes

router.post("/", addItem);
router.get("/", getItems);
router.delete("/", clearHistory);
router.delete("/:id", deleteItem);

console.log("History router stack:", router.stack);
module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { registerUser, authUser, getUserProfile, updateUserProfile, logoutUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Multer configuration for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure path is relative to the backend root
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  }
}).single("avatar");

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/logout", logoutUser);

// New upload route with better error handling
router.post("/upload-avatar", authMiddleware, (req, res) => {
  console.log(`[AVATAR_UPLOAD] Request received from user: ${req.user.userId}`);
  upload(req, res, (err) => {
    if (err) {
      console.error(`[AVATAR_UPLOAD] Multer error:`, err);
    }
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/api/uploads/${req.file.filename}`;
    res.json({ avatar_url: avatarUrl });
  });
});

module.exports = router;

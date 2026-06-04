const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const verifyGoogleToken = require("../googleVerify");
const auth = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" },
});

// SIGN UP
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 2. Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Account already exists with this email" });
    }

    // 3. Hash Password
    const hashed = await bcrypt.hash(password, 10);

    // 4. Create User
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, auth_provider)
       VALUES ($1, $2, $3, 'local')
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    res.status(201).json({ 
      message: "User created successfully",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// SIGN IN
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (user.auth_provider !== 'local') {
      return res.status(400).json({ error: "Please use Google login for this account" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Longer duration for better UX
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// VERIFY TOKEN & GET USER
router.get("/verify", auth, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// LOGOUT (Optional for Token-based, but good for consistency)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// GOOGLE LOGIN
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    const googleUser = await verifyGoogleToken(token);
    const { email, name, sub: google_id } = googleUser;

    let result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (name, email, google_id, auth_provider)
         VALUES ($1, $2, $3, 'google')
         RETURNING id, name, email`,
        [name, email, google_id]
      );

      user = newUser.rows[0];
    } else {
      user = result.rows[0];
      // If user exists but was local, we might want to link or just allow login
      // For now, we reuse the user.
    }

    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ 
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Google login failed" });
  }
});

module.exports = router;

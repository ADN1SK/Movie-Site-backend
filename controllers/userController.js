const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Consistent with your 7-day policy in routes
  });
};

// @desc    Register a new user
// @route   POST /users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, last_login_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword],
    );

    if (newUser.rows.length > 0) {
      const user = newUser.rows[0];
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        is_new_user: true,
        is_first_login_today: true
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /users/login
// @access  Public
exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (
      user &&
      (await bcrypt.compare(password, user.password_hash))
    ) {
      const oldLastLogin = user.last_login_at;
      let isFirstLoginToday = false;

      if (!oldLastLogin) {
        isFirstLoginToday = true;
      } else {
        const lastLoginDate = new Date(oldLastLogin).toDateString();
        const today = new Date().toDateString();
        if (lastLoginDate !== today) {
          isFirstLoginToday = true;
        }
      }

      // Update last_login_at
      await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        is_new_user: false,
        is_first_login_today: isFirstLoginToday
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email, avatar_url FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { name, avatar_url } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, name, email, avatar_url",
      [name, avatar_url, req.user.userId],
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

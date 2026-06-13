const pool = require("../db");

// @desc    Add movie to history
// @route   POST /api/history
// @access  Private
exports.addItem = async (req, res) => {
  const { tmdb_movie_id, movie_title, media_type } = req.body;
  const user_id = req.user.userId;
  
  try {
    const newItem = await pool.query(
      `INSERT INTO history (user_id, tmdb_movie_id, movie_title, media_type, watched_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, tmdb_movie_id) DO UPDATE SET watched_at = NOW()
       RETURNING *`,
      [user_id, tmdb_movie_id, movie_title, media_type],
    );

    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's history
// @route   GET /api/history
// @access  Private
exports.getItems = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const items = await pool.query(
      "SELECT * FROM history WHERE user_id = $1 ORDER BY watched_at DESC",
      [user_id],
    );
    res.json(items.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear user's history
// @route   DELETE /api/history
// @access  Private
exports.clearHistory = async (req, res) => {
  const user_id = req.user.userId;

  try {
    await pool.query("DELETE FROM history WHERE user_id = $1", [user_id]);
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

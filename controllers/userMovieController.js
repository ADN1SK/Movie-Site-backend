const pool = require("../db");

// @desc    Add movie to watchlist or favorites
// @route   POST /api/user-movies
// @access  Private
exports.addItem = async (req, res) => {
  const { tmdb_movie_id, movie_title, type } = req.body;
  const user_id = req.user.userId;
  const sqlParams = [user_id, tmdb_movie_id, movie_title, type];
  console.info("[USER_MOVIES] addItem", {
    loggedInUserId: user_id,
    jwtPayload: req.user,
    requestUrl: req.originalUrl,
    sqlParams,
  });

  try {
    const newItem = await pool.query(
      `INSERT INTO user_movies (user_id, tmdb_movie_id, movie_title, type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, tmdb_movie_id, type) DO NOTHING
       RETURNING *`,
      sqlParams,
    );

    if (newItem.rowCount === 0) {
      return res.status(409).json({ message: "Item already exists" });
    }

    console.info("[USER_MOVIES] addItem response", {
      loggedInUserId: user_id,
      requestUrl: req.originalUrl,
      responseData: newItem.rows[0],
    });
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's watchlist or favorites
// @route   GET /api/user-movies/:type
// @access  Private
exports.getItems = async (req, res) => {
  const user_id = req.user.userId;
  const { type } = req.params;
  const sqlParams = [user_id, type];
  console.info("[USER_MOVIES] getItems", {
    loggedInUserId: user_id,
    jwtPayload: req.user,
    requestUrl: req.originalUrl,
    sqlParams,
  });

  try {
    const items = await pool.query(
      "SELECT * FROM user_movies WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC",
      sqlParams,
    );
    console.info("[USER_MOVIES] getItems response", {
      loggedInUserId: user_id,
      requestUrl: req.originalUrl,
      responseData: items.rows,
    });
    res.json(items.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove movie from watchlist or favorites
// @route   DELETE /api/user-movies/:type/:tmdb_movie_id
// @access  Private
exports.removeItem = async (req, res) => {
  const user_id = req.user.userId;
  const { type, tmdb_movie_id } = req.params;
  const sqlParams = [user_id, type, tmdb_movie_id];
  console.info("[USER_MOVIES] removeItem", {
    loggedInUserId: user_id,
    jwtPayload: req.user,
    requestUrl: req.originalUrl,
    sqlParams,
  });

  try {
    const deletedItem = await pool.query(
      "DELETE FROM user_movies WHERE user_id = $1 AND type = $2 AND tmdb_movie_id = $3",
      sqlParams,
    );

    if (deletedItem.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    console.info("[USER_MOVIES] removeItem response", {
      loggedInUserId: user_id,
      requestUrl: req.originalUrl,
      responseData: { message: "Item removed successfully" },
    });
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

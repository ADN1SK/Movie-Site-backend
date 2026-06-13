const pool = require("../db");

// @desc    Get reviews for a movie
// @route   GET /api/movies/:id/reviews
exports.getReviewsByMovieId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.tmdb_movie_id = $1 ORDER BY r.created_at DESC",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in getReviewsByMovieId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
exports.getReviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in getReviewsByUserId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  const { tmdb_movie_id, movie_title, rating, review_text } = req.body;
  const user_id = req.user.userId;

  // Validation
  if (!tmdb_movie_id || !movie_title || !rating || !review_text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO reviews (user_id, tmdb_movie_id, movie_title, rating, review_text) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, tmdb_movie_id, movie_title, rating, review_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in createReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  const { rating, review_text } = req.body;
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    // Check if review exists and belongs to user
    const checkResult = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const result = await pool.query(
      "UPDATE reviews SET rating = COALESCE($1, rating), review_text = COALESCE($2, review_text) WHERE id = $3 RETURNING *",
      [rating, review_text, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in updateReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.userId;

  try {
    // Check if review exists and belongs to user
    const checkResult = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in deleteReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get all reviews (public feed)
// @route   GET /api/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in getAllReviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get comments for a review
// @route   GET /api/reviews/:id/comments
exports.getCommentsByReviewId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT c.*, u.name as user_name FROM review_comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.review_id = $1 ORDER BY c.created_at ASC",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in getCommentsByReviewId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add a comment to a review
// @route   POST /api/reviews/:id/comments
exports.createComment = async (req, res) => {
  const { id } = req.params;
  const { comment_text, parent_id } = req.body;
  const user_id = req.user.userId;

  if (!comment_text || comment_text.trim() === "") {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const checkReview = await pool.query("SELECT id FROM reviews WHERE id = $1", [id]);
    if (checkReview.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // If parent_id is provided, verify it exists and belongs to the same review
    if (parent_id) {
      const checkParent = await pool.query(
        "SELECT id FROM review_comments WHERE id = $1 AND review_id = $2",
        [parent_id, id]
      );
      if (checkParent.rows.length === 0) {
        return res.status(400).json({ message: "Invalid parent comment" });
      }
    }

    const result = await pool.query(
      "INSERT INTO review_comments (review_id, user_id, comment_text, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, user_id, comment_text, parent_id || null]
    );

    const commenter = await pool.query("SELECT name FROM users WHERE id = $1", [user_id]);
    const commentWithUser = {
      ...result.rows[0],
      user_name: commenter.rows[0]?.name || "Anonymous",
    };

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("[REVIEW_CONTROLLER] Error in createComment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


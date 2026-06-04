const pool = require("../db");

// @desc    Get reviews for a movie
// @route   GET /movies/:id/reviews
exports.getReviewsByMovieId = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews WHERE movie_id = $1", [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review for a movie
// @route   POST /movies/:id/reviews
exports.createReview = async (req, res) => {
  const { content, rating } = req.body;
  const movieId = req.params.id;
  try {
    // Note: req.user is populated by authMiddleware and contains { userId }
    const result = await pool.query(
      "INSERT INTO reviews (movie_id, user_id, content, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [movieId, req.user.userId, content, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /reviews/:id
exports.updateReview = async (req, res) => {
  const { content, rating } = req.body;
  try {
    const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [req.params.id]);
    if (result.rows.length > 0) {
      const review = result.rows[0];
      // Check if the logged-in user is the owner of the review
      if (review.user_id != req.user.userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this review" });
      }

      const updateResult = await pool.query(
        "UPDATE reviews SET content = COALESCE($1, content), rating = COALESCE($2, rating) WHERE id = $3 RETURNING *",
        [content, rating, req.params.id]
      );
      res.json(updateResult.rows[0]);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [req.params.id]);
    if (result.rows.length > 0) {
      const review = result.rows[0];
      // Check if the logged-in user is the owner of the review
      if (review.user_id != req.user.userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this review" });
      }
      await pool.query("DELETE FROM reviews WHERE id = $1", [req.params.id]);
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

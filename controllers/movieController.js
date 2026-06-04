const pool = require("../db");

// @desc    Fetch all movies
// @route   GET /movies
exports.getMovies = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single movie
// @route   GET /movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a movie
// @route   POST /movies
exports.createMovie = async (req, res) => {
  const { title, description, year } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO movies (title, description, year) VALUES ($1, $2, $3) RETURNING *",
      [title, description, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a movie
// @route   PUT /movies/:id
exports.updateMovie = async (req, res) => {
  const { title, description, year } = req.body;
  try {
    const result = await pool.query(
      "UPDATE movies SET title = $1, description = $2, year = $3 WHERE id = $4 RETURNING *",
      [title, description, year, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a movie
// @route   DELETE /movies/:id
exports.deleteMovie = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM movies WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length > 0) {
      res.json({ message: "Movie removed" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

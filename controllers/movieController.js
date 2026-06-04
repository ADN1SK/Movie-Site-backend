const pool = require("../db");

// @desc    Fetch all movies
// @route   GET /movies
exports.getMovies = async (req, res) => {
  const { page = 1, limit = 10, title, year } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = "SELECT * FROM movies";
    let countQuery = "SELECT COUNT(*) FROM movies";
    let params = [];
    let whereClauses = [];

    // Filtering logic
    if (title) {
      params.push(`%${title}%`);
      whereClauses.push(`title ILIKE $${params.length}`);
    }

    if (year) {
      params.push(year);
      whereClauses.push(`year = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      const whereString = " WHERE " + whereClauses.join(" AND ");
      query += whereString;
      countQuery += whereString;
    }

    // Sorting and Pagination
    query += " ORDER BY id DESC"; // Newest additions first

    const filterParamsCount = params.length;
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(parseInt(offset));
    query += ` OFFSET $${params.length}`;

    const [moviesResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, filterParamsCount)),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      movies: moviesResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single movie
// @route   GET /movies/:id
exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  const mediaType = req.query.type || "movie"; // Default to 'movie' if no type provided

  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);

    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }

    // Fallback to TMDB if movie isn't in local PostgreSQL
    if (process.env.TMDB_API_KEY) {
      const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.TMDB_API_KEY}`;
      const tmdbResponse = await fetch(tmdbUrl);

      if (tmdbResponse.ok) {
        const movie = await tmdbResponse.json();

        // Cache the result in PostgreSQL for future performance
        try {
          const title = movie.title || movie.name;
          const releaseDate = movie.release_date || movie.first_air_date;
          const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

          await pool.query(
            `INSERT INTO movies (id, title, description, year, backdrop_path, poster_path, vote_average, tagline, runtime)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO UPDATE SET
               vote_average = EXCLUDED.vote_average,
               description = EXCLUDED.description,
               last_cached = CURRENT_TIMESTAMP`,
            [
              id,
              title,
              movie.overview,
              year,
              movie.backdrop_path,
              movie.poster_path,
              movie.vote_average,
              movie.tagline,
              movie.runtime,
            ],
          );
        } catch (cacheErr) {
          // Log error but don't block the response; the user still gets their data
          console.error("Cache sync failed:", cacheErr.message);
        }

        return res.json(movie);
      }
    }

    res.status(404).json({ message: "Movie not found locally or on TMDB" });
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
      [title, description, year],
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
      [title, description, year, req.params.id],
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
    const result = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    if (result.rows.length > 0) {
      res.json({ message: "Movie removed" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

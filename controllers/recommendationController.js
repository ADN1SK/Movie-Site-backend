const pool = require("../db");

// @desc    Get personalized recommendations
// @route   GET /api/user/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  const user_id = req.user.userId;

  try {
    // 1. Get user movies (favorites and watchlist)
    const items = await pool.query(
      "SELECT genre_ids FROM user_movies WHERE user_id = $1 AND genre_ids IS NOT NULL",
      [user_id]
    );

    if (items.rows.length === 0) {
      return res.json({
        topGenres: [],
        recommendations: [],
        message: "Add movies to your favorites or watchlist to get recommendations."
      });
    }

    // 2. Calculate top genres
    const genreCounts = {};
    items.rows.forEach(item => {
      item.genre_ids.forEach(id => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => parseInt(entry[0]));

    if (topGenres.length === 0) {
       return res.json({ topGenres: [], recommendations: [] });
    }

    // 3. Fetch recommendations from TMDB (via proxy/internal fetch)
    const genreParamAnd = topGenres.join(",");
    let tmdbUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreParamAnd}&sort_by=vote_average.desc&vote_count.gte=500&api_key=${process.env.TMDB_API_KEY}`;
    
    let response = await fetch(tmdbUrl);
    let data = await response.json();

    if (!data.results || data.results.length < 4) {
      const genreParamOr = topGenres.join("|");
      tmdbUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreParamOr}&sort_by=vote_average.desc&vote_count.gte=500&api_key=${process.env.TMDB_API_KEY}`;
      response = await fetch(tmdbUrl);
      data = await response.json();
    }

    res.json({
      topGenres: topGenres,
      recommendations: data.results?.slice(0, 4) || []
    });

  } catch (error) {
    console.error("[RECOMMENDATION_ERROR]", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

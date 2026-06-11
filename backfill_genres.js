const pool = require('./db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function backfillGenres() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("❌ ERROR: TMDB_API_KEY is missing in .env");
    process.exit(1);
  }

  try {
    const res = await pool.query('SELECT id, tmdb_movie_id, movie_title FROM user_movies WHERE genre_ids IS NULL');
    console.log(`Found ${res.rows.length} entries to backfill.`);

    for (const row of res.rows) {
      console.log(`Processing: ${row.movie_title} (ID: ${row.tmdb_movie_id})...`);
      
      let genres = null;
      
      // Try fetching as movie first
      try {
        const movieUrl = `https://api.themoviedb.org/3/movie/${row.tmdb_movie_id}?api_key=${apiKey}`;
        const movieRes = await fetch(movieUrl);
        if (movieRes.ok) {
          const movieData = await movieRes.json();
          if (movieData.genres) {
            genres = movieData.genres.map(g => g.id);
          }
        }
      } catch (err) {
        console.log(`  Fetch error (movie): ${err.message}`);
      }

      // If movie failed, try as TV show
      if (!genres) {
        try {
          const tvUrl = `https://api.themoviedb.org/3/tv/${row.tmdb_movie_id}?api_key=${apiKey}`;
          const tvRes = await fetch(tvUrl);
          if (tvRes.ok) {
            const tvData = await tvRes.json();
            if (tvData.genres) {
              genres = tvData.genres.map(g => g.id);
            }
          }
        } catch (err) {
          console.log(`  Fetch error (tv): ${err.message}`);
        }
      }

      if (genres) {
        await pool.query('UPDATE user_movies SET genre_ids = $1 WHERE id = $2', [genres, row.id]);
        console.log(`  ✅ Updated with genres: ${JSON.stringify(genres)}`);
      } else {
        console.log(`  ❌ Could not find genres for ${row.movie_title}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("\nBackfill process complete!");
    process.exit(0);
  } catch (err) {
    console.error("Backfill failed:", err.message);
    process.exit(1);
  }
}

backfillGenres();

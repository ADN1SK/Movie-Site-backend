const pool = require('./db');

async function checkData() {
  try {
    const res = await pool.query(`
      SELECT tmdb_movie_id, movie_title, type, genre_ids 
      FROM user_movies 
      ORDER BY created_at DESC 
      LIMIT 10;
    `);
    
    console.log("--- Recent User Movies ---");
    if (res.rows.length === 0) {
      console.log("No movies found in the table.");
    } else {
      res.rows.forEach(row => {
        console.log(`Movie: ${row.movie_title} (${row.type})`);
        console.log(`- TMDB ID: ${row.tmdb_movie_id}`);
        console.log(`- Genre IDs: ${row.genre_ids ? JSON.stringify(row.genre_ids) : 'NULL'}`);
        console.log('---');
      });
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message);
    process.exit(1);
  }
}

checkData();

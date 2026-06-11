const pool = require('./db');

async function testInsert() {
  try {
    // Note: We need a valid user_id. Let's find one.
    const userRes = await pool.query('SELECT id FROM users LIMIT 1');
    if (userRes.rows.length === 0) {
      console.log("No users found to test with.");
      process.exit(0);
    }
    const userId = userRes.rows[0].id;

    console.log(`Testing insert for User ID: ${userId}`);
    
    const res = await pool.query(
      `INSERT INTO user_movies (user_id, tmdb_movie_id, movie_title, type, genre_ids)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, tmdb_movie_id, type) DO UPDATE 
       SET genre_ids = EXCLUDED.genre_ids
       RETURNING *`,
      [userId, 999999, "Test Movie", "favorite", [1, 2, 3]]
    );
    
    console.log("✅ Insert Successful!");
    console.log("Saved Row:", res.rows[0]);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ INSERT FAILED:", err.message);
    process.exit(1);
  }
}

testInsert();

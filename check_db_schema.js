const pool = require('./db');

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_movies' AND column_name = 'genre_ids';
    `);
    
    if (res.rows.length === 0) {
      console.log("❌ ERROR: The 'genre_ids' column does NOT exist in the 'user_movies' table.");
    } else {
      console.log("✅ SUCCESS: The 'genre_ids' column exists.");
      console.log("Column Details:", res.rows[0]);
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message);
    process.exit(1);
  }
}

checkSchema();

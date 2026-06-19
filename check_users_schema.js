const pool = require('./db');

async function checkUsersSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log("Users Table Schema:");
    console.table(res.rows);
    
    const avatarCol = res.rows.find(row => row.column_name === 'avatar_url');
    if (avatarCol) {
      console.log("✅ SUCCESS: 'avatar_url' column exists.");
    } else {
      console.log("❌ ERROR: 'avatar_url' column does NOT exist.");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message);
    process.exit(1);
  }
}

checkUsersSchema();

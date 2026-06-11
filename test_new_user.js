const crypto = require('crypto');

async function testNewUserFlow() {
  const BASE_URL = 'http://localhost:5000';
  
  // Create a unique user for this test
  const uniqueId = crypto.randomBytes(4).toString('hex');
  const testUser = {
    name: `Test User ${uniqueId}`,
    email: `test_${uniqueId}@example.com`,
    password: 'password123'
  };

  console.log(`🚀 Starting End-to-End Test for: ${testUser.email}`);

  try {
    // 1. SIGNUP
    console.log("\nStep 1: Signing up new user...");
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
    console.log("✅ User created successfully.");

    // 2. LOGIN
    console.log("\nStep 2: Logging in...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const { token } = await loginRes.json();
    if (!token) throw new Error("Login failed: No token received");
    console.log("✅ Login successful. Token acquired.");

    // 3. ADD MOVIES (SIMULATING INTEREST IN SCI-FI & ACTION)
    console.log("\nStep 3: Adding 'Sci-Fi' and 'Action' movies to favorites...");
    const moviesToAdd = [
      { id: 878, title: "Interstellar", genres: [878, 18, 12] }, // Sci-Fi
      { id: 28, title: "John Wick", genres: [28, 53, 80] },      // Action
      { id: 878, title: "The Matrix", genres: [28, 878] }       // Sci-Fi + Action
    ];

    for (const movie of moviesToAdd) {
      const res = await fetch(`${BASE_URL}/api/user-movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tmdb_movie_id: movie.id,
          movie_title: movie.title,
          type: 'favorite',
          genre_ids: movie.genres
        })
      });
      if (res.ok) console.log(`   Added: ${movie.title}`);
    }

    // 4. FETCH RECOMMENDATIONS
    console.log("\nStep 4: Requesting Intelligence recommendations...");
    const recRes = await fetch(`${BASE_URL}/api/recommendations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const text = await recRes.text();
    console.log(`Debug: Response Status: ${recRes.status}`);
    console.log(`Debug: Response Body (first 100 chars): ${text.substring(0, 100)}`);
    
    const recData = JSON.parse(text);

    console.log("\n--- TEST RESULTS ---");
    console.log(`Identified Top Genres: ${JSON.stringify(recData.topGenres)}`);
    console.log(`Movies Recommended: ${recData.recommendations?.length || 0}`);
    
    if (recData.topGenres.includes(878)) {
        console.log("✅ SUCCESS: System correctly identified Sci-Fi as a top interest!");
    } else {
        console.log("❌ FAILURE: Top genres do not match expected input.");
    }

    if (recData.recommendations.length > 0) {
        console.log("✅ SUCCESS: Personalized movies were fetched from TMDB.");
    }

  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
    console.log("Hint: Make sure your backend server is running on http://localhost:5000");
  }
}

testNewUserFlow();

-- Create user_movies table for Watchlist and Favorites
-- type: 'watchlist' or 'favorite'
CREATE TABLE IF NOT EXISTS user_movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tmdb_movie_id INTEGER NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('watchlist', 'favorite')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tmdb_movie_id, type)
);

-- Index for faster lookups by user
CREATE INDEX idx_user_movies_user_id ON user_movies(user_id);

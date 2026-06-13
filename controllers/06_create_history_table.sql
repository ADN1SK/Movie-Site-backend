-- Create history table to sync across devices
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tmdb_movie_id INTEGER NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tmdb_movie_id)
);

-- Index for faster lookups by user and sorting by watched_at
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_watched_at ON history(watched_at DESC);

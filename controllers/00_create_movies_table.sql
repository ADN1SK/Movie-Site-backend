-- Create movies table to store cached TMDB data
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    year INTEGER,
    backdrop_path VARCHAR(255),
    poster_path VARCHAR(255),
    vote_average NUMERIC(3, 1),
    tagline VARCHAR(255),
    runtime INTEGER,
    last_cached TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by title (for search)
CREATE INDEX idx_movies_title ON movies(title);

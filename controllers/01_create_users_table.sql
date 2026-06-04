-- Create users table for ADNFLIX
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT, -- Nullable for Google-only users
    google_id VARCHAR(255) UNIQUE, -- Stores the Google 'sub' ID
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'local', -- 'local' or 'google'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups during login/verification
CREATE INDEX idx_users_email ON users(email);
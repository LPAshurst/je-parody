-- Add migration script here
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- V1__create_notes.sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- notes table for the Notes app
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO notes (title, body) VALUES
 ('First note','This is the full text of the first note.'),
 ('Second note','This is the full text of the second note.');

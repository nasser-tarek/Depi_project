const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'appdb',
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
});

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from backend' }));

// Notes API
app.get('/api/notes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notes ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, body } = req.body;
  if (!body) return res.status(400).json({ error: 'body required' });
  try {
    const { rows } = await pool.query('INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING *', [title || null, body]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

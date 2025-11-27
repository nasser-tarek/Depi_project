const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// middleware: only patients
router.use(auth(['patient']));

router.get('/profile', async (req, res) => {
  const q = 'SELECT u.id, u.external_id, u.name, u.email, p.bio, p.extra FROM users u LEFT JOIN profiles p ON u.id=p.user_id WHERE u.id=$1';
  const r = await db.query(q, [req.user.userId]);
  res.json(r.rows[0] || {});
});

router.get('/health-data', async (req, res) => {
  const q = 'SELECT id, created_at, data FROM health_data WHERE patient_id=$1 ORDER BY created_at DESC';
  const r = await db.query(q, [req.user.userId]);
  res.json(r.rows);
});

// find doctors (simple query)
router.get('/find-doctors', async (req, res) => {
  const q = "SELECT id, external_id, name, email FROM users WHERE role='doctor' LIMIT 50";
  const r = await db.query(q);
  res.json(r.rows);
});

module.exports = router;

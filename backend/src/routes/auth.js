const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

/**
 * Login with external_id and password, and role (patient/doctor)
 * Request: { external_id, password, role }
 */
router.post('/login', async (req, res) => {
  const { external_id, password, role } = req.body;
  if (!external_id || !password || !role) return res.status(400).json({ error: 'missing fields' });

  const q = 'SELECT id, password_hash, role, name, email FROM users WHERE external_id=$1 AND role=$2';
  const r = await db.query(q, [external_id, role]);
  if (r.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const user = r.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth(['doctor']));

router.get('/profile', async (req, res) => {
  const q = 'SELECT u.id, u.external_id, u.name, u.email, p.bio FROM users u LEFT JOIN profiles p ON u.id=p.user_id WHERE u.id=$1';
  const r = await db.query(q, [req.user.userId]);
  res.json(r.rows[0] || {});
});

router.get('/find-patients', async (req, res) => {
  const q = "SELECT id, external_id, name, email FROM users WHERE role='patient' LIMIT 50";
  const r = await db.query(q);
  res.json(r.rows);
});

module.exports = router;

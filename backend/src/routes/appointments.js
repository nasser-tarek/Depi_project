const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// both doctors and patients can access their appointments (role-checked inside)
router.use(auth(['patient','doctor']));

router.get('/', async (req, res) => {
  const { role, userId } = req.user;
  let q, params;
  if (role === 'patient') {
    q = 'SELECT * FROM appointments WHERE patient_id=$1 ORDER BY scheduled_at DESC';
    params = [userId];
  } else {
    q = 'SELECT * FROM appointments WHERE doctor_id=$1 ORDER BY scheduled_at DESC';
    params = [userId];
  }
  const r = await db.query(q, params);
  res.json(r.rows);
});

// create appointment (patients only)
router.post('/', auth(['patient']), async (req, res) => {
  const { doctor_id, scheduled_at, notes } = req.body;
  const q = 'INSERT INTO appointments (patient_id, doctor_id, scheduled_at, notes) VALUES ($1,$2,$3,$4) RETURNING *';
  const r = await db.query(q, [req.user.userId, doctor_id, scheduled_at, notes]);
  res.json(r.rows[0]);
});

module.exports = router;

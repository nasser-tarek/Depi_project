const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const patients = require('./routes/patients');
const doctors = require('./routes/doctors');
const appointments = require('./routes/appointments');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patient', patients);
app.use('/api/doctor', doctors);
app.use('/api/appointments', appointments);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Backend listening on', PORT);
});

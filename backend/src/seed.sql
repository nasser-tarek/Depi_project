-- users: both patients and doctors
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(100) UNIQUE NOT NULL, -- login ID (like patient/doctor ID)
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('patient','doctor')),
  name TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  extra JSONB
);

CREATE TABLE IF NOT EXISTS health_data (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  data JSONB -- flexible health data, e.g. vitals, diagnoses
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled'
);

-- sample users: passwords will be set during seed via backend script or use plaintext for example (not secure)
INSERT INTO users (external_id, password_hash, role, name, email)
VALUES
('patient100', '$2b$10$PLACEHOLDER', 'patient', 'Alice Patient', 'alice@example.com'),
('doctor200', '$2b$10$PLACEHOLDER', 'doctor', 'Dr. Bob', 'bob@example.com');

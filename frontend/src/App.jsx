import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PatientLayout from './components/Patient/PatientLayout';
import DoctorLayout from './components/Doctor/DoctorLayout';
import { setToken } from './utils/api';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) setToken(token);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient/*" element={role === 'patient' ? <PatientLayout/> : <Navigate to="/" />} />
        <Route path="/doctor/*" element={role === 'doctor' ? <DoctorLayout/> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
export default App;

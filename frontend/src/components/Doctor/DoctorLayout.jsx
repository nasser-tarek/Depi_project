import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './Profile';
import Appointments from './Appointments';
import FindPatient from './FindPatient';

export default function DoctorLayout(){
  return (
    <div className="p-6">
      <nav className="mb-6 flex gap-4">
        <Link to="profile" className="text-blue-600">Profile</Link>
        <Link to="appointments" className="text-blue-600">Appointments</Link>
        <Link to="find-patient" className="text-blue-600">Find a Patient</Link>
      </nav>
      <div className="bg-white p-4 rounded shadow">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="find-patient" element={<FindPatient />} />
        </Routes>
      </div>
    </div>
  );
}

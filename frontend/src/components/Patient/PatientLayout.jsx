import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './Profile';
import HealthData from './HealthData';
import FindDoctor from './FindDoctor';

export default function PatientLayout(){
  return (
    <div className="p-6">
      <nav className="mb-6 flex gap-4">
        <Link to="profile" className="text-blue-600">Profile</Link>
        <Link to="health-data" className="text-blue-600">Health Data</Link>
        <Link to="find-doctor" className="text-blue-600">Find a Doctor</Link>
      </nav>
      <div className="bg-white p-4 rounded shadow">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="health-data" element={<HealthData />} />
          <Route path="find-doctor" element={<FindDoctor />} />
        </Routes>
      </div>
    </div>
  );
}

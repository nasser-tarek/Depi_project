import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FindDoctor(){
  const [docs, setDocs] = useState([]);
  useEffect(()=>{ (async()=>{ const r = await api.get('/patient/find-doctors'); setDocs(r.data) })() },[]);
  return (
    <div>
      <h3 className="text-xl font-bold">Find a Doctor</h3>
      <ul className="mt-4 space-y-2">
        {docs.map(d => (
          <li key={d.id} className="border p-2 rounded">
            <div className="font-semibold">{d.name}</div>
            <div className="text-sm">{d.email} — ID: {d.external_id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

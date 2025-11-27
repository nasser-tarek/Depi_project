import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function HealthData(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ (async()=>{ const r = await api.get('/patient/health-data'); setItems(r.data) })() },[]);
  return (
    <div>
      <h3 className="text-xl font-bold">Health Data</h3>
      {items.length === 0 && <p>No records yet</p>}
      <ul className="mt-4 space-y-3">
        {items.map(it => (
          <li key={it.id} className="border p-3 rounded">
            <div className="text-sm text-gray-500">{new Date(it.created_at).toLocaleString()}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(it.data, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

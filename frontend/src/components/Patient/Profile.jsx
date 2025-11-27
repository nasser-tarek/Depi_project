import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Profile(){
  const [profile, setProfile] = useState(null);
  useEffect(()=>{
    (async()=>{
      const res = await api.get('/patient/profile');
      setProfile(res.data);
    })();
  },[]);
  if(!profile) return <div>Loading...</div>;
  return (
    <div>
      <h3 className="text-xl font-bold">{profile.name}</h3>
      <p>{profile.email}</p>
      <div className="mt-4"><strong>Bio</strong><p>{profile.bio}</p></div>
    </div>
  );
}

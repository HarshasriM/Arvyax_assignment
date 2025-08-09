import React, { useEffect, useState } from 'react';
import api from '../api';
import SessionCard from '../components/SessionCard';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Discover Sessions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions && sessions.length ? sessions.map(s => <SessionCard key={s._id} session={s} />) : <div>No published sessions yet.</div>}
      </div>
    </div>
  );
}

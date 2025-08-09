import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../features/auth/AuthProvider';
import { toast } from 'react-toastify';

export default function Register() {
  const { setUser } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, password });
      setUser(res.data.user);
      toast.success('Registered');
      nav('/my-sessions');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-3 rounded border" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" className="w-full p-3 rounded border" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button className="w-full py-3 rounded bg-gray-400">Register</button>
      </form>
    </div>
  );
}

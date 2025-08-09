import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-primary">Arvyax Wellness</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hidden sm:inline text-gray-600">Home</Link>
          {user ? (
            <>
              <Link to="/my-sessions" className="text-gray-700">My Sessions</Link>
              <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-gray-400">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

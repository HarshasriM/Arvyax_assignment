import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const value = { user, setUser, loading, logout, refetch: fetchMe };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

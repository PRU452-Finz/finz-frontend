import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('finz_token');
    const savedUser = localStorage.getItem('finz_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('finz_token');
        localStorage.removeItem('finz_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const resp = await authAPI.login({ email, password });
    const { token, user: userData } = resp.data;
    localStorage.setItem('finz_token', token);
    localStorage.setItem('finz_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const resp = await authAPI.register(data);
    const { token, user: userData } = resp.data;
    localStorage.setItem('finz_token', token);
    localStorage.setItem('finz_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('finz_token');
    localStorage.removeItem('finz_user');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    if (!user) return;
    const resp = await userAPI.update(user.id, data);
    const updated = resp.data;
    localStorage.setItem('finz_user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  }), [user, loading, login, register, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;

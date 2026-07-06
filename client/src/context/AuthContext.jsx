import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));
  const saveSession = ({ token, user: nextUser }) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(nextUser)); setUser(nextUser); };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    api.get('/auth/me').then(({ data }) => { localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); }).catch(logout).finally(() => setLoading(false));
  }, []);
  const value = useMemo(() => ({ user, loading, saveSession, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

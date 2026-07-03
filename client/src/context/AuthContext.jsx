import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logoutUser } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      getMe()
        .then((res) => {
          if (res.success) setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.removeItem('adminTab'); // Start fresh at dashboard upon login
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminTab'); // Clean up saved tab on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

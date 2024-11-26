// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  username: string | null;
  admin: boolean;
  token: string | null;
  login: (username: string, isAdmin: boolean, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const login = (username: string, isAdmin: boolean, token: string) => {
    setUsername(username);
    setAdmin(isAdmin);
    setToken(token);
    localStorage.setItem('username', username);
    localStorage.setItem('admin', isAdmin? 'true' : 'false');
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUsername(null);
    setAdmin(false);
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedAdmin = localStorage.getItem('admin') === 'true';
    if (storedToken) {
      setToken(storedToken);
      setAdmin(storedAdmin);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ username, admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

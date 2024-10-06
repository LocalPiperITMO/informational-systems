import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string | null;
  login: (isAdmin: boolean, username: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedSessionId) {
      setIsAuthenticated(true);
      setIsAdmin(storedIsAdmin);
      setUsername(storedUsername);
    }
  }, []);

  const login = (isAdmin: boolean, username: string | null) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
    setUsername(username);

    localStorage.setItem('username', username || '');
    localStorage.setItem('isAdmin', String(isAdmin));
    localStorage.setItem('sessionId', 'someSessionId'); // Replace with actual ID from login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setIsAdmin(false);

    localStorage.removeItem('sessionId');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout }}>
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

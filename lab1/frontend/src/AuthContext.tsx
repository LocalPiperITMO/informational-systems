import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string | null;
  sessionId: string | null;
  login: (isAdmin: boolean, username: string | null, sessionId: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const errorMessage = 'Your free trial of life has expired';

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedSessionId) {
      validateSession(storedSessionId, storedUsername, storedIsAdmin);
    }
  }, []);

  const validateSession = async (storedSessionId: string, storedUsername: string | null, storedIsAdmin: boolean) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: storedSessionId }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setIsAdmin(storedIsAdmin);
        setUsername(storedUsername);
        setSessionId(storedSessionId);
      } else {
        // If the session is invalid, clear local storage and redirect to the login page
        localStorage.removeItem('sessionId');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        alert(errorMessage); // Show an error message to the user
        window.location.href = '/auth';
        
      }
    } catch (error) {
      console.error('Error validating session:', error);
    }
  };

  const login = (isAdmin: boolean, username: string | null, sessionId: string | null) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
    setUsername(username);
    setSessionId(sessionId);

    localStorage.setItem('username', username || '');
    localStorage.setItem('isAdmin', String(isAdmin));
    localStorage.setItem('sessionId', sessionId || '');
  };

  const logout = async () => {
    if (sessionId) {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sessionId }),
      });
      
      setIsAuthenticated(false);
      setUsername(null);
      setIsAdmin(false);
      setSessionId(null);
  
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      localStorage.removeItem('isAdmin');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, sessionId, login, logout }}>
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

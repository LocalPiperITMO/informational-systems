import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import AuthForm from './components/Auth/AuthForm';
import MainPage from './components/Main/MainPage';
import AdminPage from './components/Admin/AdminPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route
            path="/main"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminPage />
            </PrivateRoute>
            }/>
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ children: JSX.Element; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (allowedRoles.includes('admin') && !isAdmin) {
    return <Navigate to="/main" />;
  }

  return children;
};


export default App;

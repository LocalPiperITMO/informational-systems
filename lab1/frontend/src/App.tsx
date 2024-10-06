import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/Auth/AuthForm';
import AdminPage from './components/Admin/AdminPage';
import MainPage from './components/Main/MainPage';
import { AuthProvider, useAuth } from './AuthContext';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/admin" element={isAdmin ? <AdminPage /> : <MainPage/>} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/main' : '/auth'} />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/Auth/AuthForm';
import AdminPage from './components/Admin/AdminPage';
import MainPage from './components/Main/MainPage';
import { AuthProvider, useAuth } from './AuthContext'; // Ensure this import is correct

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth(); // This should work fine inside AuthProvider

  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/auth" />} />
      <Route path="/main" element={isAuthenticated ? <MainPage /> : <Navigate to="/auth" />} />
      <Route path="*" element={<Navigate to="/auth" />} /> {/* Redirect unknown routes */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/main' : '/auth'} />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider> {/* Wrap the Routes with AuthProvider */}
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;

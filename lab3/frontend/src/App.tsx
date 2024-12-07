// src/App.tsx
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './components/pages/AuthPage';
import MainPage from './components/pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './components/pages/AdminPage';
import {  ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <div>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />}/>
        <Route path="/main" element={<MainPage />}/>
        <Route path="/admin" element={<AdminPage />}/>
        <Route path="/" element={<Navigate to="/auth"/>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    <ToastContainer/>
    </div>
  );
};

export default App;

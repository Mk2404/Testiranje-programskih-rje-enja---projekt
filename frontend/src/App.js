// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddReimbursementPage from './pages/AddReimbursement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001'; 

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <Router>
      <div className="app-container">
        <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        <main>
          <Routes>
            {!isAuthenticated ? (
              <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard role={role} />} />
                <Route path="/add-reimbursement" element={<AddReimbursementPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
};

export default App;

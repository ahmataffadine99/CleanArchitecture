import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
        />
        <Route 
          path="/*" 
          element={isAuthenticated ? <Dashboard onLogout={() => { localStorage.removeItem('admin_token'); setIsAuthenticated(false); }} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CreateSummary from './components/CreateSummary';
import SummaryDetail from './components/SummaryDetail';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/login" 
            element={<Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={<Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/create" 
            element={<CreateSummary />} 
          />
          <Route 
            path="/summary/:id" 
            element={<SummaryDetail />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App; 
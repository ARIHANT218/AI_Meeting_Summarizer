import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: 'mock-user-id',
    name: 'Demo User',
    email: 'demo@example.com'
  });
  const [token, setToken] = useState('mock-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  const login = async (email, password) => {
    // Mock login - always successful
    return { success: true };
  };

  const register = async (name, email, password) => {
    // Mock registration - always successful
    return { success: true };
  };

  const logout = () => {
    // Mock logout - doesn't actually log out
    console.log('Mock logout - user remains logged in');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: true // Always authenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
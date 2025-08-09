import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getUserByUsername } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async (username) => {
    try {
      const latest = await getUserByUsername(username);
      if (latest?.user) {
        setUser(latest.user);
        localStorage.setItem('user', JSON.stringify(latest.user));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Always fetch fresh user data from backend
        refreshUserData(userData.username);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const userData = response;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token || 'authenticated');

      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const newUser = response;

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', newUser.token || 'authenticated');

      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    register,
    refreshUserData,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

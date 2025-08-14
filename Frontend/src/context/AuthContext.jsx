import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getUserByUsername } from '../services/userService';
import { usePosts } from './PostContext';
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
  const [loading, setLoading] = useState(true); // Start with loading as true

  const refreshUserData = async (username) => {
    try {
      const latest = await getUserByUsername(username);
      const { clearPosts } = usePosts();
      if (latest?.user) {
        // Preserve the role from the stored user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...latest.user,
          role: currentUser.role || latest.user.role || 'user'
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Optionally refresh user data in the background
          // await refreshUserData(userData.username);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      // This is the key change: ensure loading is set to false
      // after the initial check is complete.
      setLoading(false);
    };

    initializeAuth();
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
    clearPosts();
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

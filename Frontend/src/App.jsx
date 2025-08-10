// The main app file with all routes.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import MyPostsPage from './pages/MyPostsPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
// AdminLoginPage removed - using regular login for all users

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  return user && user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  return !user ? children : <Navigate to="/home" replace />;
};

// Layout for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <HomePage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <SettingsPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <MyPostsPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <UserProfilePage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          {/* Admin login route removed - using regular login page */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

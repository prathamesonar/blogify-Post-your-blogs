import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import CreatePost from './CreatePost';
import { PenTool, Plus, FileText, Settings, LogOut, Menu, X, Home } from 'lucide-react';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-dropdown')) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/', { replace: true });
    setMobileMenuOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setMobileMenuOpen(false);
  };

  const handleViewMyPosts = () => {
    navigate('/my-posts');
    setMobileMenuOpen(false);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden backdrop-blur-sm" />
      )}
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <Link 
                to={user ? "/home" : "/"} 
                className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Blogify
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  {/* User Welcome */}
                  <span className="text-lg xl:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome, {user.name || user.username}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/home"
                      className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </div>

                  {/* Create Post Button */}
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Post</span>
                  </button>

                  {/* My Posts Button */}
                  <button
                    onClick={handleViewMyPosts}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4" />
                    <span>My Posts</span>
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={handleSettings}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Navigation Links */}
                  <Link
                    to="/"
                    className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50"
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-lg hover:bg-gray-50"
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  
                  {/* Register Button */}
                  <Link 
                    to="/register" 
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    Start Writing
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center space-x-2">
              {user && (
                <>
                  {/* Create Post Button - Always visible on mobile */}
                  <button
                    onClick={handleCreatePost}
                    className="inline-flex items-center justify-center bg-indigo-600 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-1 sm:inline hidden">New</span>
                  </button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed left-4 right-4 top-16 z-50">
              <div className="mobile-menu-dropdown bg-white border border-gray-200 rounded-2xl shadow-2xl backdrop-blur-sm max-w-sm mx-auto">
                <div className="p-3 space-y-1">
                  {user ? (
                    <>
                      {/* User Welcome on Mobile */}
                      <div className="px-4 py-3 text-sm font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center border border-blue-100 mb-3">
                        Welcome, {user.name || user.username}
                      </div>
                      
                      <Link
                        to="/home"
                        className="flex items-center justify-center space-x-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 w-full"
                        onClick={closeMobileMenu}
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>

                      <button
                        onClick={handleViewMyPosts}
                        className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                      >
                        <FileText className="h-5 w-5" />
                        <span>My Posts</span>
                      </button>

                      <button
                        onClick={handleSettings}
                        className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </button>

                      <div className="border-t border-gray-100 my-3"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/"
                        className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 w-full"
                        onClick={closeMobileMenu}
                      >
                        Home
                      </Link>
                      <Link 
                        to="/about" 
                        className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 w-full" 
                        onClick={closeMobileMenu}
                      >
                        About
                      </Link>
                      <Link 
                        to="/contact" 
                        className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 w-full" 
                        onClick={closeMobileMenu}
                      >
                        Contact
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 w-full"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Link>
                      
                      <div className="pt-2">
                        <Link
                          to="/register"
                          className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm w-full"
                          onClick={closeMobileMenu}
                        >
                          Start Writing
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in duration-200">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <CreatePost onPostCreated={() => setShowCreatePost(false)} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

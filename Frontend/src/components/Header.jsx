import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import CreatePost from './CreatePost';
import { PenTool, Plus, FileText, Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/', { replace: true });
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleViewMyPosts = () => {
    navigate('/my-posts');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <PenTool className="h-8 w-8 text-indigo-600" />
            <Link 
              to={user ? "/home" : "/"} 
              className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              Blogify
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
              {/* User Welcome */}
              <span className="hidden lg:inline text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome, {user.name || user.username}
              </span>
              <div className="flex items-center space-x-2">
                  <Link
                    to={user ? "/home" : "/"}
                    className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="hidden md:inline">Home</span>
                  </Link>
                </div>
                {/* Create Post Button */}
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Post</span>
                </button>

                {/* My Posts Button */}
                <button
                  onClick={handleViewMyPosts}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline">My Posts</span>
                </button>

                {/* Settings Button */}
                <button
                  onClick={handleSettings}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Settings</span>
                </button>

                

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors"
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
        </div>
      </nav>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CreatePost onPostCreated={() => setShowCreatePost(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
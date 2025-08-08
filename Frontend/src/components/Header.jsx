import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import CreatePost from './CreatePost';

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
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
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={user ? "/home" : "/"} className="text-2xl font-bold text-blue-600">SocialApp</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Create Post
                </button>
                
                <button 
                  onClick={handleViewMyPosts}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  My Posts
                </button>
                
                <button 
                  onClick={handleSettings}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Settings
                </button>
                
                <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Login</Link>
                <Link to="/register" className="ml-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Post</h2>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreatePost onPostCreated={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

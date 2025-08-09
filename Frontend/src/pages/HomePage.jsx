import React, { useEffect, useState } from 'react';
import { getFeed, likePost, commentOnPost } from '../services/postService';
import { searchUsers } from '../services/userService';
import Post from '../components/Post';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      if (user) {
        try {
          const feedPosts = await getFeed();
          setPosts(Array.isArray(feedPosts) ? feedPosts : []);
        } catch (error) {
          console.error("Failed to fetch feed", error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [user]);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await likePost(postId);
      handlePostUpdate(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const updatedPost = await commentOnPost(postId, { text });
      handlePostUpdate(updatedPost);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleEdit = (updatedPost) => {
    handlePostUpdate(updatedPost);
  };

 

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      {user ? (
        <>
          {/* User Search Bar */}
          <div className="mb-8">
  {/* Search Input */}
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Search users by name or username..."
      value={searchQuery}
      onChange={handleSearch}
      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-lg"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>

  {/* Search Results */}
  {searchResults.length > 0 && (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Search Results ({searchResults.length})
        </h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {searchResults.map((user, index) => (
          <Link
            key={user._id}
            to={`/profile/${user.username}`}
            className="block px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
          >
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 p-0.5 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover bg-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=48`;
                    }}
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors duration-200">
                    {user.name}
                  </h4>
                  {user.verified && (
                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-indigo-600 font-medium">@{user.username}</p>
                  {user.followerCount && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {user.followerCount} followers
                    </span>
                  )}
                </div>
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Arrow Icon */}
              <div className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )}

  {/* No Results State */}
  {searchQuery && searchResults.length === 0 && (
    <div className="mt-4 text-center py-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-600">Try searching with different keywords or check your spelling.</p>
    </div>
  )}
</div>

          {/* Feed */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <Post 
                  key={post._id} 
                  post={post} 
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handlePostDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl mb-4">Your feed is empty.</p>
              <p>Follow some users to see their posts here!</p>
              <p className="mt-4 text-sm">Or check out what other users are sharing!</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center bg-white p-10 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Welcome to SocialApp!</h1>
          <p className="text-gray-600">Please login or register to see the feed and connect with others.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

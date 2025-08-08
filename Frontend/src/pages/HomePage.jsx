import React, { useEffect, useState } from 'react';
import { getFeed, likePost, commentOnPost } from '../services/postService';
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
        // This would need a backend endpoint for user search
        // For now, we'll simulate with a mock search
        setSearchResults([]);
      } catch (error) {
        console.error("Search failed", error);
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
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users by name or username..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                {searchResults.map(user => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
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

import React, { useState, useEffect } from 'react';
import { getUserPosts } from '../services/postService';
import Post from '../components/Post';
import { useAuth } from '../context/AuthContext';

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const userPosts = await getUserPosts();
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to fetch your posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <button 
          onClick={fetchUserPosts}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Posts</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-xl mb-4">You haven't created any posts yet.</p>
          <p>Start sharing your thoughts with the community!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Post 
              key={post._id} 
              post={post} 
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;

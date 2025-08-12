import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { getMyPosts, updatePost, deletePost, likePost, commentOnPost } from '../services/postService';
import { updateUserBio } from '../services/userService';
import Post from '../components/Post';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditBioModal from '../components/EditBioModal';
import { useAuth } from '../context/AuthContext';

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const { user, setUser } = useAuth();
  const location = useLocation();

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const userPosts = await getMyPosts();
      setPosts(Array.isArray(userPosts) ? userPosts : []);
    } catch (err) {
      setError('Failed to fetch your posts');
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  // Refresh posts when navigating to this page (helps catch new posts)
  useEffect(() => {
    // Add a small delay to ensure any pending operations complete
    const timer = setTimeout(() => {
      fetchUserPosts();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Listen for storage events (when posts are created from other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'postCreated') {
        fetchUserPosts();
        localStorage.removeItem('postCreated'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for custom events within the same tab
    const handlePostCreated = () => {
      fetchUserPosts();
    };

    window.addEventListener('postCreated', handlePostCreated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('postCreated', handlePostCreated);
    };
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
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
      // Make the API call and wait for the server's response
      const updatedPostFromServer = await commentOnPost(postId, { text });

      // --- THIS IS THE CRUCIAL DEBUGGING STEP ---
      console.log("Received updated post from server:", updatedPostFromServer);
      // -----------------------------------------

      // Update the state with the confirmed data from the server
      handlePostUpdate(updatedPostFromServer);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = (post) => {
    setDeletingPost(post);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      if (!editingPost || !editingPost._id) {
        console.error('Invalid post data for edit:', editingPost);
        alert(`Invalid post data for edit: ${editingPost ? JSON.stringify(editingPost) : 'null/undefined'}`);
        return;
      }
      const postId = editingPost._id.toString();
      if (!postId || typeof postId !== 'string') {
        console.error('Invalid post ID format:', postId);
        alert('Invalid post ID format. Please refresh and try again.');
        return;
      }
      const updatedPost = await updatePost(postId, updatedData);
      handlePostUpdate(updatedPost);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert(`Failed to update post: ${error.message || 'Please try again.'}`);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deletingPost || !deletingPost._id) {
        console.error('Invalid post data for delete:', deletingPost);
        alert(`Invalid post data for delete: ${deletingPost ? JSON.stringify(deletingPost) : 'null/undefined'}`);
        return;
      }
      const postId = deletingPost._id.toString();
      if (!postId || typeof postId !== 'string') {
        console.error('Invalid post ID format:', postId);
        alert('Invalid post ID format. Please refresh and try again.');
        return;
      }
      await deletePost(postId);
      handlePostDelete(postId);
      setDeletingPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: ${error.message || 'Please try again.'}`);
    }
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Profile */}
        <div className="lg:w-1/3">
          {user && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm sticky top-8">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 p-1">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Name & Username */}
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-indigo-600 font-medium text-lg mb-3">@{user.username}</p>

                {/* Bio */}
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {user.bio || (
                    <span className="text-gray-500 italic">
                      No bio available. Click "Add Bio" to tell your story!
                    </span>
                  )}
                </p>

                {/* Edit Bio Button */}
                <button
                  onClick={() => setEditingBio(true)}
                  className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-all duration-200"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{user.bio ? 'Edit Bio' : 'Add Bio'}</span>
                </button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-600 font-medium">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.followers?.length || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.following?.length || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">Following</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Posts */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Posts</h3>
            <button
              onClick={fetchUserPosts}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Refresh
            </button>
          </div>
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
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        post={deletingPost}
        onConfirm={handleConfirmDelete}
      />

      <EditBioModal
        isOpen={editingBio}
        onClose={() => setEditingBio(false)}
        currentBio={user?.bio || ''}
        onSave={async (newBio) => {
          try {
            const updated = await updateUserBio(newBio);
            if (updated?.user) {
              setUser(updated.user);
              localStorage.setItem('user', JSON.stringify(updated.user));
            }
            setEditingBio(false);
          } catch (error) {
            console.error('Error updating bio:', error);
            alert('Failed to update bio. Please try again.');
          }
        }}
      />
    </div>
  );
};

export default MyPostsPage;

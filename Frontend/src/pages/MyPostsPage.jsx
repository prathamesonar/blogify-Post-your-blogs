import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { updatePost, deletePost, likePost, commentOnPost } from '../services/postService';
import { updateUserBio } from '../services/userService';
import Post from '../components/Post';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditBioModal from '../components/EditBioModal';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext'; // Use the new PostContext

const MyPostsPage = () => {
  const { myPosts, loading: postsLoading, error, fetchMyPosts, setMyPosts } = usePosts(); // Use state from PostContext
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const { user, setUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // This will only fetch data if it hasn't been fetched before
    fetchMyPosts();
  }, [fetchMyPosts]);

  // Refresh posts when navigating to this page (optional, for real-time updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'postCreated') {
        fetchMyPosts(true); // Pass true to force a refetch
        localStorage.removeItem('postCreated');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchMyPosts]);

  const handlePostUpdate = (updatedPost) => {
    setMyPosts(prevPosts =>
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
      const updatedPostFromServer = await commentOnPost(postId, { text });
      handlePostUpdate(updatedPostFromServer);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handlePostDelete = (postId) => {
    setMyPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const updatedPost = await updatePost(editingPost._id, updatedData);
      handlePostUpdate(updatedPost);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(deletingPost._id);
      handlePostDelete(deletingPost._id);
      setDeletingPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (postsLoading) {
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
          onClick={() => fetchMyPosts(true)} // Force refetch on retry
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
        {/* Profile Column */}
        <div className="lg:w-1/3">
          {user && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm sticky top-8">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 p-1">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full rounded-full object-cover bg-white" />
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
                  {user.bio || <span className="text-gray-500 italic">No bio available. Click "Add Bio" to tell your story!</span>}
                </p>
                {/* Edit Bio Button */}
                <button onClick={() => setEditingBio(true)} className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-all duration-200">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{user.bio ? 'Edit Bio' : 'Add Bio'}</span>
                </button>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{myPosts?.length || 0}</div>
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
        {/* Posts Column */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Posts</h3>
            <button onClick={() => fetchMyPosts(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Refresh
            </button>
          </div>
          {myPosts && myPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl mb-4">You haven't created any posts yet.</p>
              <p>Start sharing your thoughts with the community!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myPosts?.map(post => (
                <Post
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={() => setDeletingPost(post)}
                  onEdit={() => setEditingPost(post)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPostModal isOpen={!!editingPost} onClose={() => setEditingPost(null)} post={editingPost} onSave={handleSaveEdit} />
      <DeleteConfirmationModal isOpen={!!deletingPost} onClose={() => setDeletingPost(null)} post={deletingPost} onConfirm={handleConfirmDelete} />
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

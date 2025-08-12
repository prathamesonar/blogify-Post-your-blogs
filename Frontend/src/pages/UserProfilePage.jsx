import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername, followUnfollowUser } from '../services/userService';
import { likePost, commentOnPost, updatePost, deletePost } from '../services/postService'; // Import post services
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import EditBioModal from '../components/EditBioModal';
import EditPostModal from '../components/EditPostModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setProfileData(data);
        if (currentUser && data.user.followers) {
          setIsFollowing(data.user.followers.some(f => f._id === currentUser._id));
        }
        setFollowersCount(data.followersCount);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username, currentUser]);

  const handlePostUpdate = (updatedPost) => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.map(p => p._id === updatedPost._id ? updatedPost : p)
    }));
  };
  
  const handlePostDelete = (postId) => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p._id !== postId),
      postsCount: prev.postsCount - 1
    }));
  };
  
  const handleLike = async (postId) => {
    try {
      const updatedPost = await likePost(postId);
      handlePostUpdate(updatedPost);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const updatedPost = await commentOnPost(postId, { text });
      handlePostUpdate(updatedPost);
    } catch (err) {
      console.error("Failed to comment on post", err);
    }
  };

  const handleFollowUnfollow = async () => {
    try {
      const response = await followUnfollowUser(profileData.user._id);
      setIsFollowing(response.isFollowing);
      setFollowersCount(response.followersCount);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return null;

  const { user, posts, followingCount, postsCount } = profileData;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Profile */}
        <div className="lg:w-1/3">
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
                    No bio available.
                  </span>
                )}
              </p>
              
              {/* Follow Button (only shown for non-own profiles) */}
              {!isOwnProfile && (
                <button 
                  onClick={handleFollowUnfollow} 
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 mb-6 ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{postsCount}</div>
                  <div className="text-sm text-gray-600 font-medium">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followersCount}</div>
                  <div className="text-sm text-gray-600 font-medium">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
                  <div className="text-sm text-gray-600 font-medium">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Posts */}
        <div className="lg:w-2/3">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
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
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

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
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
                <img
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=818cf8&color=fff`}
                    alt={user.name}
                />
            </div>
            <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-700 mt-2 max-w-md">{user.bio || 'No bio available.'}</p>
            </div>
          </div>
          {!isOwnProfile && (
            <button onClick={handleFollowUnfollow} className={`px-4 py-2 rounded-lg transition-colors ${isFollowing ? 'bg-gray-500' : 'bg-indigo-500'} text-white`}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="text-center"><div className="text-2xl font-bold">{postsCount}</div><div className="text-sm">Posts</div></div>
            <div className="text-center"><div className="text-2xl font-bold">{followersCount}</div><div className="text-sm">Followers</div></div>
            <div className="text-center"><div className="text-2xl font-bold">{followingCount}</div><div className="text-sm">Following</div></div>
        </div>
      </div>

      {/* Posts */}
      <div>
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
  );
};

export default UserProfilePage;

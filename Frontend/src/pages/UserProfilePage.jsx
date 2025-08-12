import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername, followUnfollowUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import EditBioModal from '../components/EditBioModal';

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, refreshUserData } = useAuth(); // Assuming refreshUserData is in useAuth

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setProfileData(data);

        if (currentUser && data.user.followers) {
          const isUserFollowing = data.user.followers.some(
            follower => follower === currentUser._id
          );
          setIsFollowing(isUserFollowing);
        }

        setFollowersCount(data.user.followers.length);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile');
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username, currentUser]);

  const handlePostUpdate = updatedPost => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    }));
  };

  const handlePostDelete = postId => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post._id !== postId),
      postsCount: prev.postsCount - 1
    }));
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser || !profileData) return;
    try {
      const response = await followUnfollowUser(profileData.user._id);
      setIsFollowing(response.isFollowing);
      setFollowersCount(response.followersCount);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleBioUpdate = async newBio => {
    try {
      const { updateUserBio } = await import('../services/userService');
      await updateUserBio(newBio);
      // Refresh user data to get the latest bio
      const updatedProfile = await getUserByUsername(username);
      setProfileData(updatedProfile);
      if(currentUser.username === username) {
        refreshUserData(username);
      }
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!profileData) return null;

  const { user, posts, followingCount, postsCount } = profileData;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* --- RESPONSIVE PROFILE HEADER --- */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          {/* Avatar */}
          <div className="relative mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
            {user.profilePic ? (
              <img
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-gray-100"
                src={user.profilePic}
                alt={user.name}
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* User Info & Actions */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="mt-2 sm:mt-0">
                    {isOwnProfile ? (
                        <button onClick={() => setIsEditingBio(true)} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                            Edit Bio
                        </button>
                    ) : (
                        <button onClick={handleFollowUnfollow} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isFollowing ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-600">@{user.username}</p>
            {user.bio && (
              <p className="text-gray-700 mt-2 max-w-md mx-auto sm:mx-0">{user.bio}</p>
            )}
          </div>
        </div>

        {/* --- RESPONSIVE STATS GRID --- */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-6 border-t border-gray-200 pt-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{postsCount}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{followersCount}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{followingCount}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Following</div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {posts.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">This user hasn't posted anything yet.</p>
          </div>
        )}
      </div>

      {/* Edit Bio Modal */}
      {isEditingBio && (
        <EditBioModal
          isOpen={isEditingBio}
          onClose={() => setIsEditingBio(false)}
          currentBio={user.bio || ''}
          onSave={handleBioUpdate}
        />
      )}
    </div>
  );
};

export default UserProfilePage;

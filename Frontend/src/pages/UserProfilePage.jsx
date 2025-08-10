import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername, followUnfollowUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import EditBioModal from '../components/EditBioModal';

const UserProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  // ✅ All hooks at the top
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [editingBio, setEditingBio] = useState(false); // moved up

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setProfileData(data);

        if (currentUser && data.user.followers) {
          const isUserFollowing = data.user.followers.some(
            follower =>
              follower._id === currentUser._id || follower === currentUser._id
          );
          setIsFollowing(isUserFollowing);
        }

        setFollowersCount(data.followersCount);
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
      console.log(response.message);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleBioUpdate = async newBio => {
    try {
      const { updateUserBio } = await import('../services/userService');
      const res = await updateUserBio(newBio); // should return updated user now
      setProfileData(prev => ({
        ...prev,
        user: res.user // use backend updated object
      }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };



  // ✅ Hooks are all declared already, so early returns are safe
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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

  if (!profileData) {
    return null;
  }

  const { user, posts, followingCount, postsCount } = profileData;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
  <div className="relative">
    {user.profilePic ? (
      <img
        className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
        src={user.profilePic}
        alt={user.name}
      />
    ) : (
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100">
        <span className="text-3xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>
    )}
  </div>
  <div>
    <h1 className="text-2xl font-bold">{user.name}</h1>
    <p className="text-gray-600">@{user.username}</p>
    <p className="text-gray-700 mt-2">{user.email}</p>
    {user.bio && (
      <p className="text-gray-700 mt-2 max-w-md">{user.bio}</p>
    )}
  </div>
</div>

          <div className="flex items-center space-x-4">
            {isOwnProfile && (
              <button
                onClick={() => setEditingBio(true)}
              // className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {/* {user.bio ? 'Edit Bio' : 'Add Bio'} */}
              </button>
            )}
            {!isOwnProfile && (
              <button
                onClick={handleFollowUnfollow}
                className={`px-4 py-2 rounded-lg transition-colors ${isFollowing
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="text-center group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
              <svg className="h-6 w-6 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-2xl font-bold text-gray-900">{postsCount}</div>
              <div className="text-sm text-gray-600 font-medium">Posts</div>
            </div>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-4 group-hover:from-purple-100 group-hover:to-pink-200 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
              <svg className="h-6 w-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="text-2xl font-bold text-gray-900">{followersCount}</div>
              <div className="text-sm text-gray-600 font-medium">Followers</div>
            </div>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 group-hover:from-green-100 group-hover:to-emerald-200 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
              <svg className="h-6 w-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
              <div className="text-sm text-gray-600 font-medium">Following</div>
            </div>
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
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>

      {/* Edit Bio Modal */}
      {editingBio && (
        <EditBioModal
          initialBio={user.bio || ''}
          onSave={handleBioUpdate}
          onClose={() => setEditingBio(false)}
        />
      )}
    </div>
  );
};

export default UserProfilePage;

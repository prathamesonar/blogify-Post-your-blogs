import api from './api';

// Search users by name or username
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const response = await api.get(`/users/${encodeURIComponent(username)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Follow/unfollow user
export const followUnfollowUser = async (userId) => {
  try {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    throw error;
  }
};

// Update user bio
export const updateUserBio = async (bio) => {
  try {
    const response = await api.put('/users/update-bio', { bio });
    return response.data;
  } catch (error) {
    console.error('Error updating bio:', error);
    throw error;
  }
};

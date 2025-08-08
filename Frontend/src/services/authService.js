import api from './api';

const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  followUnfollowUser: (userId) => api.post(`/users/follow/${userId}`),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  deleteAccount: () => api.delete('/users/delete-account'),
};

export default authService;

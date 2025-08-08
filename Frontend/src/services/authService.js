import api from './api';

const authService = {
  login: (credentials) => api.post('/users/login', credentials).then(response => response.data),
  register: (userData) => api.post('/users/register', userData).then(response => response.data),
  logout: () => api.post('/users/logout').then(response => response.data),
  searchUsers: (query) => api.get(`/users/search?q=${query}`).then(response => response.data),
  followUnfollowUser: (userId) => api.post(`/users/follow/${userId}`).then(response => response.data),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData).then(response => response.data),
  deleteAccount: () => api.delete('/users/delete-account').then(response => response.data),
};

export default authService;

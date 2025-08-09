import api from './api';

const authService = {
  login: (credentials) => api.post('/users/login', credentials).then(response => response.data),
  register: (userData) => api.post('/users/register', userData).then(response => response.data),
  logout: () => api.post('/users/logout').then(response => response.data),
  searchUsers: (query) => api.get(`/users/search?q=${query}`).then(response => response.data),
  followUnfollowUser: (userId) => api.post(`/users/follow/${userId}`).then(response => response.data),
  changePassword: (passwordData) => {
    const token = localStorage.getItem('token');
    return api.put('/users/change-password', passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data);
  },
    deleteAccount: () => {
    const token = localStorage.getItem('token'); // adjust key if different
    return api.delete('/users/delete-account', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => response.data);
  },
  
};

export default authService;

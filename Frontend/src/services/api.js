import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// ✅ ADD THIS INTERCEPTOR
// This block will run before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the request headers
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If there's an error, just pass it along
    return Promise.reject(error);
  }
);
// const api = axios.create({
  // baseURL: '/api', // The vite proxy will handle this
// });

// We can add interceptors here later to handle token refresh if needed
export default api;

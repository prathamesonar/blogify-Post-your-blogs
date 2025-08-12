import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
  // baseURL: '/api', // The vite proxy will handle this
});

// We can add interceptors here later to handle token refresh if needed
export default api;

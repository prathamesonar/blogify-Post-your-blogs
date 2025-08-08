import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The vite proxy will handle this
});

// We can add interceptors here later to handle token refresh if needed
export default api;
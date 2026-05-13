import axios from 'axios';

// Central axios instance — all API calls go through here
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach the JWT to every request automatically
// This way individual components don't need to manage headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

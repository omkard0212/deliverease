import axios from 'axios';

// In production the VITE_API_URL env var is set via Vercel.
// Fallback to the Render backend URL if the variable is missing.
const BASE_URL = import.meta.env.VITE_API_URL || 'https://deliverease-wftz.onrender.com';

// Central axios instance — all API calls go through here
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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

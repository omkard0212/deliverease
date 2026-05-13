import axios from 'axios';

// Force the Render backend URL — do not rely on env variables
// This ensures the deployed Vercel app always points to the correct backend
const BASE_URL = 'https://deliverease-uhbq.onrender.com';

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

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ai-interview-platform-production-8f2d.up.railway.app/api',
});

// Automatically attach JWT token to every request, if we have one
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
import axios from 'axios';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  withCredentials: true, // This is crucial for sending HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header if token exists in localStorage (for backward compatibility)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const aToken = localStorage.getItem('aToken');
    
    // Add token to headers for backward compatibility with existing middleware
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add admin token for admin routes
    if (aToken && config.url?.includes('/admin/')) {
      config.headers.atoken = aToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on 401
      localStorage.removeItem('token');
      localStorage.removeItem('aToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login user
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', {
      username,
      password
    });
    
    if (response.data.token) {
      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      // Backend returns username and role directly, not nested in user object
      const user = {
        username: response.data.username,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    
    if (response.data.token) {
      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      // Backend returns username and role directly, not nested in user object
      const user = {
        username: response.data.username,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Add token to axios requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

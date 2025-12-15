import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/bids` : '/api/bids';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors (token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const placeBid = async (auctionId, amount) => {
  const response = await api.post(`/auction/${auctionId}`, { amount });
  return response.data;
};

const getBidsForAuction = async (auctionId) => {
  const response = await api.get(`/auction/${auctionId}`);
  return response.data;
};

export default {
  placeBid,
  getBidsForAuction,
};

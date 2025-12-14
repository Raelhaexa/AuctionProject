import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auctions';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fetch all auctions
export const fetchAuctions = async () => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch auction by ID
export const fetchAuctionById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get open auctions only
export const getOpenAuctions = async () => {
  try {
    const response = await api.get('/open');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new auction
export const createAuction = async (auctionData) => {
  try {
    const response = await api.post('', auctionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update auction
export const updateAuction = async (id, auctionData) => {
  try {
    const response = await api.put(`/${id}`, auctionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete auction
export const deleteAuction = async (id) => {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
};

// Calculate time remaining
export const calculateTimeRemaining = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) {
    return 'Ended';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${minutes}m`;
};

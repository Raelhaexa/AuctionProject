import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all auctions
export const fetchAuctions = async () => {
  try {
    const response = await api.get('/auctions');
    return response.data;
  } catch (error) {
    console.error('Error fetching auctions:', error);
    throw error;
  }
};

// Fetch auction by ID
export const fetchAuctionById = async (id) => {
  try {
    const response = await api.get(`/auctions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching auction ${id}:`, error);
    throw error;
  }
};

// Search auctions by title
export const searchAuctions = async (searchQuery) => {
  try {
    const response = await api.get('/auctions', {
      params: { title_like: searchQuery }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching auctions:', error);
    throw error;
  }
};

// Filter auctions by status
export const filterAuctionsByStatus = async (status) => {
  try {
    const response = await api.get('/auctions', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error filtering auctions:', error);
    throw error;
  }
};

// Create new auction
export const createAuction = async (auctionData) => {
  try {
    const response = await api.post('/auctions', auctionData);
    return response.data;
  } catch (error) {
    console.error('Error creating auction:', error);
    throw error;
  }
};

// Update auction
export const updateAuction = async (id, auctionData) => {
  try {
    const response = await api.put(`/auctions/${id}`, auctionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating auction ${id}:`, error);
    throw error;
  }
};

// Delete auction
export const deleteAuction = async (id) => {
  try {
    await api.delete(`/auctions/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting auction ${id}:`, error);
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

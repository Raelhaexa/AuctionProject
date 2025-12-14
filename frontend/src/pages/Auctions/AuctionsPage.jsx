import React, { useState, useEffect } from 'react';
import { fetchAuctions, calculateTimeRemaining, deleteAuction, updateAuction, createAuction } from '../../services/auctionService';
import { getCurrentUser } from '../../services/authService';
import './AuctionsPage.css';

const AuctionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingAuction, setEditingAuction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: '',
    imageUrl: '',
    category: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch auctions from API
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true);
        const data = await fetchAuctions();
        setAuctions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load auctions. Please make sure the backend server is running on port 8080.');
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
    setCurrentUser(getCurrentUser());
  }, []);

  // Close kebab menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Handle delete auction
  const handleDelete = async (auctionId) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteAuction(auctionId);
        setAuctions(auctions.filter(a => a.id !== auctionId));
        alert('Auction deleted successfully');
      } catch (error) {
        alert('Failed to delete auction: ' + (error.response?.data || error.message));
      }
    }
  };

  // Handle edit auction - open modal
  const handleEditClick = (auction) => {
    setEditingAuction(auction);
    setShowEditModal(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAuction = await updateAuction(editingAuction.id, editingAuction);
      setAuctions(auctions.map(a => a.id === updatedAuction.id ? updatedAuction : a));
      setShowEditModal(false);
      setEditingAuction(null);
      alert('Auction updated successfully');
    } catch (error) {
      alert('Failed to update auction: ' + (error.response?.data || error.message));
    }
  };

  // Check if current user is the creator
  const isCreator = (auction) => {
    return currentUser && auction.createdBy && currentUser.username === auction.createdBy.username;
  };

  // Compress image before upload
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handle image upload for create modal
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      try {
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
        setNewAuction({...newAuction, imageUrl: compressedImage});
      } catch (error) {
        alert('Failed to process image');
      }
    }
  };

  // Handle create auction submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const endTimeISO = newAuction.endDate ? new Date(newAuction.endDate).toISOString() : null;
      const auctionData = {
        title: newAuction.title,
        description: newAuction.description,
        startingPrice: parseFloat(newAuction.startingPrice),
        currentPrice: parseFloat(newAuction.startingPrice),
        status: 'OPEN',
        endTime: endTimeISO,
        imageUrl: newAuction.imageUrl || '',
        category: newAuction.category || '',
        bids: 0
      };
      const created = await createAuction(auctionData);
      setAuctions([...auctions, created]);
      setShowCreateModal(false);
      setNewAuction({
        title: '',
        description: '',
        startingPrice: '',
        endDate: '',
        imageUrl: '',
        category: ''
      });
      setImagePreview(null);
      alert('Auction created successfully!');
    } catch (error) {
      alert('Failed to create auction: ' + (error.response?.data || error.message));
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || auction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get emoji based on title keywords
  const getEmojiForAuction = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('camera')) return '📷';
    if (lower.includes('card')) return '🎴';
    if (lower.includes('laptop') || lower.includes('computer')) return '💻';
    if (lower.includes('painting') || lower.includes('art')) return '🎨';
    if (lower.includes('watch')) return '⌚';
    if (lower.includes('furniture')) return '🪑';
    if (lower.includes('vinyl') || lower.includes('record')) return '🎵';
    if (lower.includes('drone')) return '🚁';
    if (lower.includes('book')) return '📚';
    if (lower.includes('arcade') || lower.includes('game')) return '🕹️';
    return '🏆';
  };

  return (
    <div className="auctions-page">
      <div className="auctions-header">
        <div>
          <h1>Browse Auctions</h1>
          <p>Discover unique items and place your bids</p>
        </div>
        {currentUser && (
          <button className="btn-create-auction" onClick={() => setShowCreateModal(true)}>
            <span>➕</span>
            Create Auction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="auctions-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="category-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading auctions...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-state">
          <span className="icon">⚠️</span>
          <h3>Error Loading Auctions</h3>
          <p>{error}</p>
          <p className="hint">Make sure the Spring Boot backend is running on port 8080</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Results count */}
          <div className="results-info">
            <span>{filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''} found</span>
          </div>

          {/* Auctions Grid */}
          <div className="auctions-grid">
            {filteredAuctions.map((auction, index) => (
              <div key={auction.id || index} className="auction-card">
                <div className="auction-image">
                  {auction.imageUrl ? (
                    <img src={auction.imageUrl} alt={auction.title} className="auction-image-img" />
                  ) : (
                    <span className="image-placeholder">{getEmojiForAuction(auction.title)}</span>
                  )}
                  <div className="auction-badge">{calculateTimeRemaining(auction.endTime)}</div>
                  <div className={`status-badge ${auction.status.toLowerCase()}`}>
                    {auction.status}
                  </div>
                </div>
                
                <div className="auction-content">
                  <h3>{auction.title}</h3>
                  <p className="description">{auction.description}</p>
                  
                  <div className="auction-meta">
                    <div className="bid-info">
                      <span className="label">Current Price</span>
                      <span className="amount">${(auction.currentPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="starting-price">
                      <span className="label">Starting</span>
                      <span className="value">${(auction.startingPrice || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="auction-actions">
                    {!isCreator(auction) && (
                      <button 
                        className="btn-bid" 
                        disabled={auction.status === 'CLOSED' || !currentUser}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!currentUser) {
                            alert('Please log in to place a bid');
                          } else {
                            alert('Bidding functionality coming soon!');
                          }
                        }}
                      >
                        {!currentUser ? 'Login to Bid' : 
                         auction.status === 'CLOSED' ? 'Auction Ended' : 'Place Bid'}
                      </button>
                    )}
                    
                    {isCreator(auction) && (
                      <>
                        <button 
                          className="btn-your-auction"
                          disabled
                        >
                          Your Auction
                        </button>
                        <div className="kebab-menu-container">
                          <button 
                            className="btn-kebab"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === auction.id ? null : auction.id);
                            }}
                            title="More options"
                          >
                            ⋮
                          </button>
                          {openMenuId === auction.id && (
                            <div className="kebab-dropdown">
                              <button 
                                className="dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  handleEditClick(auction);
                                }}
                              >
                                <span className="icon">✏️</span>
                                Edit
                              </button>
                              <button 
                                className="dropdown-item delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  handleDelete(auction.id);
                                }}
                              >
                                <span className="icon">🗑️</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAuctions.length === 0 && (
            <div className="no-results">
              <span className="icon">🔍</span>
              <h3>No auctions found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}

      {/* Create Auction Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Auction</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newAuction.title}
                  onChange={(e) => setNewAuction({...newAuction, title: e.target.value})}
                  required
                  placeholder="Enter auction title"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newAuction.description}
                  onChange={(e) => setNewAuction({...newAuction, description: e.target.value})}
                  rows="4"
                  required
                  placeholder="Describe your item"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Starting Price *</label>
                  <input
                    type="number"
                    value={newAuction.startingPrice}
                    onChange={(e) => setNewAuction({...newAuction, startingPrice: e.target.value})}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="datetime-local"
                    value={newAuction.endDate}
                    onChange={(e) => setNewAuction({...newAuction, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newAuction.category}
                  onChange={(e) => setNewAuction({...newAuction, category: e.target.value})}
                  placeholder="e.g., Electronics, Art, Collectibles"
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => {
                        setImagePreview(null);
                        setNewAuction({...newAuction, imageUrl: ''});
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Create Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAuction && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Auction</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingAuction.title}
                  onChange={(e) => setEditingAuction({...editingAuction, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingAuction.description}
                  onChange={(e) => setEditingAuction({...editingAuction, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Starting Price</label>
                  <input
                    type="number"
                    value={editingAuction.startingPrice}
                    onChange={(e) => setEditingAuction({...editingAuction, startingPrice: parseFloat(e.target.value)})}
                    required
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Current Price</label>
                  <input
                    type="number"
                    value={editingAuction.currentPrice}
                    onChange={(e) => setEditingAuction({...editingAuction, currentPrice: parseFloat(e.target.value)})}
                    required
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={editingAuction.category || ''}
                  onChange={(e) => setEditingAuction({...editingAuction, category: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={editingAuction.endTime ? new Date(editingAuction.endTime).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingAuction({...editingAuction, endTime: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;

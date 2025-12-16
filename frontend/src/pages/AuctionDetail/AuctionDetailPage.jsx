import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAuctionById, calculateTimeRemaining, updateAuction, deleteAuction } from '../../services/auctionService';
import { getCurrentUser } from '../../services/authService';
import bidService from '../../services/bidService';
import webSocketService from '../../services/webSocketService';
import './AuctionDetailPage.css';

const AuctionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    loadAuction();
    loadBids();
    setCurrentUser(getCurrentUser());

    // Connect to WebSocket and subscribe to auction updates
    webSocketService.connect(() => {
      // Subscribe to auction updates
      webSocketService.subscribeToAuction(id, (updatedAuction) => {
        setAuction(updatedAuction);
      });

      // Subscribe to new bids
      webSocketService.subscribeToAuctionBids(id, (newBid) => {
        setBids((prevBids) => [newBid, ...prevBids]);
      });
    });

    return () => {
      webSocketService.unsubscribe(`/topic/auction/${id}`);
      webSocketService.unsubscribe(`/topic/auction/${id}/bids`);
    };
  }, [id]);

  const loadAuction = async () => {
    try {
      setLoading(true);
      const data = await fetchAuctionById(id);
      setAuction(data);
      setError(null);
    } catch (err) {
      setError('Failed to load auction details');
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const bidsData = await bidService.getBidsForAuction(id);
      setBids(bidsData);
    } catch (err) {
      // Silently fail if bids can't be loaded
    }
  };

  const isCreator = () => {
    return currentUser && auction?.createdBy && currentUser.username === auction.createdBy.username;
  };

  const handleEditClick = () => {
    setEditingAuction(auction);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAuction = await updateAuction(editingAuction.id, editingAuction);
      setAuction(updatedAuction);
      setShowEditModal(false);
      setEditingAuction(null);
      alert('Auction updated successfully');
    } catch (error) {
      alert('Failed to update auction: ' + (error.response?.data || error.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteAuction(auction.id);
        alert('Auction deleted successfully');
        navigate('/dashboard/auctions');
      } catch (error) {
        alert('Failed to delete auction: ' + (error.response?.data || error.message));
      }
    }
  };

  const handleBidClick = () => {
    setBidAmount('');
    setBidError('');
    setShowBidModal(true);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    if (amount <= auction.currentPrice) {
      setBidError(`Bid must be higher than current price ($${auction.currentPrice})`);
      return;
    }
    
    try {
      await bidService.placeBid(id, amount);
      setShowBidModal(false);
      setBidAmount('');
      alert('Bid placed successfully!');
      // WebSocket will automatically update the auction and bids
    } catch (error) {
      setBidError(error.response?.data || 'Failed to place bid');
    }
  };

  if (loading) {
    return (
      <div className="auction-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading auction...</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="auction-detail-page">
        <div className="error-state">
          <h2>{error || 'Auction not found'}</h2>
          <button className="btn-back" onClick={() => navigate('/dashboard/auctions')}>
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auction-detail-page">
      <button className="btn-back" onClick={() => navigate('/dashboard/auctions')}>
        ← Back to Auctions
      </button>

      <div className="auction-detail-container">
        {/* Image Section */}
        <div className="auction-image-section">
          {auction.imageUrl ? (
            <img src={auction.imageUrl} alt={auction.title} className="auction-main-image" />
          ) : (
            <div className="auction-placeholder">
              <span>🏆</span>
            </div>
          )}
          <div className={`status-badge ${auction.status.toLowerCase()}`}>
            {auction.status}
          </div>
        </div>

        {/* Details Section */}
        <div className="auction-info-section">
          <div className="auction-header">
            <div>
              <h1>{auction.title}</h1>
              {auction.category && (
                <span className="category-tag">{auction.category}</span>
              )}
            </div>
            {isCreator() && (
              <div className="creator-actions">
                <button className="btn-edit" onClick={handleEditClick}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          <div className="auction-meta">
            <div className="meta-item">
              <span className="label">Time Remaining</span>
              <span className="value">{calculateTimeRemaining(auction.endTime)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Bids</span>
              <span className="value">{auction.bids || 0}</span>
            </div>
          </div>

          <div className="price-section">
            <div className="price-card">
              <span className="label">Starting Price</span>
              <span className="amount">${auction.startingPrice?.toLocaleString()}</span>
            </div>
            <div className="price-card current">
              <span className="label">Current Price</span>
              <span className="amount">${auction.currentPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div className="description-section">
            <h2>Description</h2>
            <p>{auction.description}</p>
          </div>

          {auction.createdBy && (
            <div className="seller-section">
              <h3>Seller Information</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  {auction.createdBy.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="seller-name">{auction.createdBy.username}</p>
                  <p className="seller-role">{auction.createdBy.role}</p>
                </div>
              </div>
            </div>
          )}

          {!isCreator() && (
            <button 
              className="btn-place-bid"
              disabled={auction.status === 'CLOSED' || !currentUser}
              onClick={handleBidClick}
            >
              {!currentUser ? 'Login to Bid' : 
               auction.status === 'CLOSED' ? 'Auction Ended' : 'Place Bid'}
            </button>
          )}

          {/* Bid History Section */}
          {bids.length > 0 && (
            <div className="bid-history-section">
              <h3>Bid History</h3>
              <div className="bid-list">
                {bids.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((bid, index) => (
                  <div key={bid.id} className="bid-item">
                    <div className="bid-info">
                      <div className="bidder-avatar">
                        {bid.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="bidder-name">{bid.user.username}</p>
                        <p className="bid-time">
                          {new Date(bid.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="bid-amount">
                      ${bid.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="modal-overlay" onClick={() => setShowBidModal(false)}>
          <div className="modal-content bid-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Place a Bid</h2>
              <button className="modal-close" onClick={() => setShowBidModal(false)}>×</button>
            </div>
            <div className="bid-modal-info">
              <p className="current-price-label">Current Price</p>
              <p className="current-price-amount">${auction?.currentPrice?.toLocaleString()}</p>
            </div>
            <form onSubmit={handleBidSubmit}>
              <div className="form-group">
                <label>Your Bid Amount</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum: $${(auction?.currentPrice + 1)?.toLocaleString()}`}
                  required
                  step="0.01"
                  min={auction?.currentPrice + 1}
                />
                {bidError && <p className="error-message">{bidError}</p>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBidModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Place Bid
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

export default AuctionDetailPage;

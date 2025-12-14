import React, { useState, useEffect } from 'react';
import { fetchAuctions, calculateTimeRemaining } from '../../services/auctionService';
import './AuctionsPage.css';

const AuctionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch auctions from API
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true);
        const data = await fetchAuctions();
        setAuctions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load auctions. Please make sure JSON server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, []);

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
        <h1>Browse Auctions</h1>
        <p>Discover unique items and place your bids</p>
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
          <p className="hint">Run: <code>npm run server</code></p>
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
            {filteredAuctions.map(auction => (
              <div key={auction.id} className="auction-card">
                <div className="auction-image">
                  <span className="image-placeholder">{getEmojiForAuction(auction.title)}</span>
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
                      <span className="amount">${auction.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="starting-price">
                      <span className="label">Starting</span>
                      <span className="value">${auction.startingPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-bid" 
                    disabled={auction.status === 'CLOSED'}
                  >
                    {auction.status === 'CLOSED' ? 'Auction Ended' : 'Place Bid'}
                  </button>
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
    </div>
  );
};

export default AuctionsPage;

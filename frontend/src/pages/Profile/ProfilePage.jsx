import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { fetchAuctions, calculateTimeRemaining } from '../../services/auctionService';
import webSocketService from '../../services/webSocketService';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userAuctions, setUserAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const allAuctions = await fetchAuctions();
          const myAuctions = allAuctions.filter(
            auction => auction.createdBy && auction.createdBy.username === currentUser.username
          );
          setUserAuctions(myAuctions);
        }
      } catch (error) {
        alert('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Connect to WebSocket for real-time updates
    const currentUser = getCurrentUser();
    if (currentUser) {
      webSocketService.connect(() => {
        // Subscribe to auction updates
        webSocketService.subscribeToAuctionUpdates((updatedAuction) => {
          setUserAuctions((prev) =>
            prev.map((auction) =>
              auction.id === updatedAuction.id ? updatedAuction : auction
            )
          );
        });

        // Subscribe to new auctions
        webSocketService.subscribeToAuctions((newAuction) => {
          if (newAuction.createdBy?.username === currentUser.username) {
            setUserAuctions((prev) => [newAuction, ...prev]);
          }
        });

        // Subscribe to auction deletes
        webSocketService.subscribeToAuctionDeletes((deletedId) => {
          setUserAuctions((prev) => prev.filter((auction) => auction.id !== deletedId));
        });
      });
    }

    return () => {
      webSocketService.unsubscribe('/topic/auctions');
      webSocketService.unsubscribe('/topic/auctions/update');
      webSocketService.unsubscribe('/topic/auctions/delete');
    };
  }, []);

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

  const stats = {
    totalAuctions: userAuctions.length,
    activeAuctions: userAuctions.filter(a => a.status === 'OPEN').length,
    closedAuctions: userAuctions.filter(a => a.status === 'CLOSED').length,
    totalValue: userAuctions.reduce((sum, a) => sum + (a.currentPrice || 0), 0)
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-state">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="user-role">{user.role}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalAuctions}</h3>
            <p>Total Auctions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.activeAuctions}</h3>
            <p>Active Auctions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.closedAuctions}</h3>
            <p>Closed Auctions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalValue.toLocaleString()}</h3>
            <p>Total Value</p>
          </div>
        </div>
      </div>

      {/* My Auctions Section */}
      <div className="section">
        <h2>My Auctions</h2>
        {userAuctions.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📦</span>
            <h3>No auctions yet</h3>
            <p>Create your first auction to get started</p>
          </div>
        ) : (
          <div className="auctions-list">
            {userAuctions.map(auction => (
              <div key={auction.id} className="auction-item">
                <div className="auction-item-image">
                  {auction.imageUrl ? (
                    <img src={auction.imageUrl} alt={auction.title} />
                  ) : (
                    <span className="placeholder">{getEmojiForAuction(auction.title)}</span>
                  )}
                </div>
                <div className="auction-item-info">
                  <h3>{auction.title}</h3>
                  <p className="description">{auction.description}</p>
                  <div className="auction-item-meta">
                    <span className={`status ${auction.status.toLowerCase()}`}>
                      {auction.status}
                    </span>
                    <span className="time">{calculateTimeRemaining(auction.endTime)}</span>
                  </div>
                </div>
                <div className="auction-item-price">
                  <span className="label">Current Price</span>
                  <span className="amount">${auction.currentPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

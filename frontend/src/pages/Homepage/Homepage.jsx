import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="logo-large">PB</div>
          <h1>Welcome to PulseBid</h1>
          <p className="hero-subtitle">
            Experience the thrill of real-time bidding. Join thousands of users in the most dynamic auction platform.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose PulseBid?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Bidding</h3>
            <p>Experience instant updates and never miss a beat in the auction.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Transactions</h3>
            <p>Your data and transactions are protected with industry-leading security.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy to Use</h3>
            <p>Intuitive interface designed for both beginners and experienced bidders.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Access</h3>
            <p>Participate in auctions from anywhere in the world, anytime.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Start Bidding?</h2>
        <p>Join our community and discover unique items up for auction today.</p>
        <button className="btn-primary" onClick={() => navigate('/register')}>
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2025 PulseBid. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;

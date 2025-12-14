import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import './Sidenav.css';

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className="dashboard-sidenav">
      <div className="sidenav-header">
        <div className="logo-small">PB</div>
        <h2>PulseBid</h2>
      </div>
      
      <nav className="sidenav-menu">
        <button 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <span className="icon">🏠</span>
          <span>Home</span>
        </button>
        <button 
          className={`nav-item ${isActive('/dashboard/auctions') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/auctions')}
        >
          <span className="icon">🔨</span>
          <span>Auctions</span>
        </button>
        <button 
          className={`nav-item ${isActive('/dashboard/profile') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard/profile')}
        >
          <span className="icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>

      <div className="sidenav-footer">
        <button className="nav-item logout" onClick={handleLogoutClick}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleCancelLogout}>
          <div className="modal-content logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Logout</h2>
              <button className="modal-close" onClick={handleCancelLogout}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelLogout}>
                Cancel
              </button>
              <button className="btn-logout" onClick={handleConfirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidenav;

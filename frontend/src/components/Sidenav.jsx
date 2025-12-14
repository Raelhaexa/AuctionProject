import { useNavigate, useLocation } from 'react-router-dom';
import './Sidenav.css';

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
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
      </nav>

      <div className="sidenav-footer">
        <button className="nav-item logout" onClick={() => navigate('/login')}>
          <span className="icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidenav;

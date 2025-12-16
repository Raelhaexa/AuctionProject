import { Outlet } from 'react-router-dom';
import Sidenav from '../../components/Sidenav';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidenav />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
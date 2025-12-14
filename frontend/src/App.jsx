import './App.css'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import { Route,Routes } from 'react-router-dom';
import AppRouter from './routes/index.jsx';

const App = () => {
  return <AppRouter />;

  }

export default App

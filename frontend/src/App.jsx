import './App.css'
// import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
// import RegisterPage from './pages/Register/RegisterPage.jsx';
import { Route,Routes } from 'react-router-dom';

const App = () => {
  return (

   <Routes>
      <Route path='/' element={<LoginPage/>} />
      {/* <Route path='/register' element={<RegisterPage/>} />
      <Route path='/dashboard' element={<DashboardPage/>} /> */}
   </Routes>
  )
}

export default App

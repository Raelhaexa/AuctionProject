import './App.css'
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { Route,Routes } from 'react-router-dom';

const App = () => {
  return (

   <Routes>
      <Route path='/' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
   </Routes>
  )
}

export default App

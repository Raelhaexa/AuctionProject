import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import Homepage from '../pages/Homepage/Homepage';
import AuctionsPage from '../pages/Auctions/AuctionsPage';


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
        children: [
            {
                index: true,
                element: <Homepage />
            },
            {
                path: 'auctions',
                element: <AuctionsPage />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
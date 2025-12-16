import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import Homepage from '../pages/Homepage/Homepage';
import AuctionsPage from '../pages/Auctions/AuctionsPage';
import AuctionDetailPage from '../pages/AuctionDetail/AuctionDetailPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import ProtectedRoute from '../components/ProtectedRoute';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
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
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Homepage />
            },
            {
                path: 'auctions',
                element: <AuctionsPage />
            },
            {
                path: 'auctions/:id',
                element: <AuctionDetailPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
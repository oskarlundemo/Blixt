

/**
 * This component is used in the App.jsx to protect routes from unauthorised users,
 * so only admins can access these pages
 */


import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "./AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Optional: loading state to prevent flashing
    if (loading) return<LoadingTitle/>;

    if (!user || !user.id) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
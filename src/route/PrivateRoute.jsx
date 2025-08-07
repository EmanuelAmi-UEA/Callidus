import { useAuth } from '../context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    const{isAuthenticated} = useAuth();

  return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />
};

export default PrivateRoute;
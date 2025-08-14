import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { usuario, token } = useAuth();
  // Para admin, exige token válido
  if (usuario && usuario.email === 'admin@pizzaria.com' && token) {
    return children;
  }
  // Para outros usuários, só exige token
  if (usuario && token) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;

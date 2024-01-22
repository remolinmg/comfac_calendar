import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('email') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}

export default ProtectedRoute;
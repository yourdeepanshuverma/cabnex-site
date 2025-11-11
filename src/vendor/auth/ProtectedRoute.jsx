import React from 'react';
import { Navigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

const ProtectedRoute = ({ children }) => {
  const { isVendorLoggedIn, loading } = useVendorAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isVendorLoggedIn) {
    return <Navigate to="/vendor-login" />;
  }

  return children;
};

export default ProtectedRoute;
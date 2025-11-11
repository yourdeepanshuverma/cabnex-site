import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api, endpoints } from '../../api/api-config';

const VendorAuthContext = createContext();

export const useVendorAuth = () => useContext(VendorAuthContext);

export const VendorAuthProvider = ({ children }) => {
  const [vendorUser, setVendorUser] = useState(null);
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendorStats, setVendorStats] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(endpoints.vendorMe);
        if (response.data.success) {
          setVendorUser(response.data.data.vendor);
          setIsVendorLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking vendor auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <VendorAuthContext.Provider
      value={{
        vendorUser,
        setVendorUser,
        isVendorLoggedIn,
        setIsVendorLoggedIn,
        loading,
        vendorStats,
        setVendorStats,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};


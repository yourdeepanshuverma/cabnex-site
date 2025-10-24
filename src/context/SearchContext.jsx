import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [searchFormData, setSearchFormData] = useState({
    pickupDate: null,
    dropoffDate: null,
    pickupDateTime: null,
    transferDateTime: null,
    outstationTripType: 'one-way',
    outstationPickupDateTime: null,
    outstationReturnDateTime: null,
    selectedPlaces: {},
    rentalPackage: '',
    multicityStops: [],
    serviceType: 'rental',
    dropoffLocation: null,
    pickupLocation: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userData = localStorage.getItem('userData');
    const userName = Cookies.get('userName');
    return !!(userData || userName);
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      console.log('Loaded userData from localStorage:', JSON.parse(savedUser));
      return JSON.parse(savedUser);
    }
    return null;
  });

  useEffect(() => {
    const savedFormData = localStorage.getItem('searchFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setSearchFormData(parsed);
      } catch (err) {
        console.error('Failed to load searchFormData from localStorage', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchFormData', JSON.stringify(searchFormData));
  }, [searchFormData]);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(user));
  }, [user]);

  return (
    <SearchContext.Provider
      value={{
        searchResult,
        setSearchResult,
        searchFormData,
        setSearchFormData,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
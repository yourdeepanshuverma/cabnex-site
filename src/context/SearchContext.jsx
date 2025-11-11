// context/SearchContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  // 1. searchFormData – localStorage se load + save
  const [searchFormData, setSearchFormData] = useState(() => {
    const saved = localStorage.getItem('searchFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse searchFormData', e);
      }
    }
    return {
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
      transferDirection: 'home-to-station',
      selectedCity: null,
      distance: 0,
    };
  });

  // 2. searchResult – localStorage se load
  const [searchResult, setSearchResult] = useState(() => {
    const saved = localStorage.getItem('lastSearch');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse lastSearch', e);
      }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userData = Cookies.get('userData') || localStorage.getItem('userData');
    const userName = Cookies.get('userName');
    return !!(userData || userName);
  });

  const [user, setUser] = useState(() => {
    let savedUser = Cookies.get('userData');
    if (!savedUser) {
      savedUser = localStorage.getItem('userData');
    }
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse userData', e);
      }
    }
    return null;
  });

  // SAVE searchFormData on change
  useEffect(() => {
    localStorage.setItem('searchFormData', JSON.stringify(searchFormData));
  }, [searchFormData]);

  // SAVE searchResult on change
  useEffect(() => {
    if (searchResult) {
      localStorage.setItem('lastSearch', JSON.stringify(searchResult));
    }
  }, [searchResult]);



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
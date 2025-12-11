// context/SearchContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(8, 0, 0, 0);
  return now;
};

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  // 1. searchFormData – localStorage se load + save
  const [searchFormData, setSearchFormData] = useState(() => {
    const defaultDateTimeISO = getDefaultDateTime().toISOString();

    return {
      pickupDate: null,
      dropoffDate: null,
      pickupDateTime: defaultDateTimeISO,
      transferDateTime: defaultDateTimeISO,
      outstationTripType: 'one-way',
      outstationPickupDateTime: defaultDateTimeISO,
      outstationReturnDateTime: defaultDateTimeISO,
      selectedPlaces: {},
      rentalPackage: '',
      multicityStops: [
        {
          pickupPlaceId: null,
          dropoffPlaceId: null,
          dateTime: defaultDateTimeISO,
          selectedPickupAddress: '',
          selectedDropoffAddress: '',
        }
      ],
      serviceType: 'rental',
      dropoffLocation: null,
      pickupLocation: null,
      transferDirection: 'home-to-station',
      selectedCity: null,
      distance: 0,
      activityDateTime: defaultDateTimeISO,
    };
  });

  // 2. searchResult – localStorage se load
  const [searchResult, setSearchResult] = useState(null);

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
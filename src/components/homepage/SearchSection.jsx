import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { FaMapMarkerAlt, FaChevronDown, FaCalendarAlt, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import enUS from 'date-fns/locale/en-US';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { googleConfig, api, endpoints } from '../../api/api-config';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

registerLocale('en-US', enUS);

const SearchSection = ({ isUpdate = false }) => {
  const { searchFormData, setSearchFormData, setSearchResult, isLoggedIn } = useSearch();
  const navigate = useNavigate();

  const tabServiceMap = {
    rental: 0,
    transfer: 1,
    outstation: 2,
    activity: 3,
  };

  const [activeTabIndex, setActiveTabIndex] = useState(
    searchFormData.serviceType && tabServiceMap[searchFormData.serviceType] !== undefined
      ? tabServiceMap[searchFormData.serviceType]
      : 0
  );
  const [expanded, setExpanded] = useState({});
  const [pickupDateTime, setPickupDateTime] = useState(searchFormData.pickupDate ? new Date(searchFormData.pickupDate) : null);
  const [transferDateTime, setTransferDateTime] = useState(
    searchFormData.transferDateTime ? new Date(searchFormData.transferDateTime) : null
  );
  const [outstationTripType, setOutstationTripType] = useState(searchFormData.outstationTripType || 'one-way');
  const [outstationPickupDateTime, setOutstationPickupDateTime] = useState(
    searchFormData.outstationPickupDateTime ? new Date(searchFormData.outstationPickupDateTime) : null
  );
  const [outstationReturnDateTime, setOutstationReturnDateTime] = useState(
    searchFormData.outstationReturnDateTime ? new Date(searchFormData.outstationReturnDateTime) : null
  );
  const [selectedPlaces, setSelectedPlaces] = useState(searchFormData.selectedPlaces || {});
  const [rentalPackage, setRentalPackage] = useState(searchFormData.rentalPackage || '');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pickupBounds, setPickupBounds] = useState(null);
  const [activityLocation, setActivityLocation] = useState(null);
  const [activityDateTime, setActivityDateTime] = useState(null);

  const createInitialStop = () => ({
    pickupPlaceId: null,
    dropoffPlaceId: null,
    dateTime: null,
    pickupRef: React.createRef(),
    dropoffRef: React.createRef(),
    selectedPickupAddress: '',
    selectedDropoffAddress: '',
  });

  const [multicityStops, setMulticityStops] = useState(() => {
    let stops = searchFormData.multicityStops || [];
    if (stops.length === 0) {
      stops = [createInitialStop()];
    } else {
      stops = stops.map(stop => ({
        ...stop,
        pickupRef: React.createRef(),
        dropoffRef: React.createRef(),
        dateTime: stop.dateTime ? new Date(stop.dateTime) : null,
      }));
    }
    return stops;
  });

  const rentalPickupRef = useRef(null);
  const transferFromRef = useRef(null);
  const transferToRef = useRef(null);
  const outstationPickupRef = useRef(null);
  const outstationDropoffRef = useRef(null);
  const activityLocationRef = useRef(null);

  const tabs = ['Rental', 'Transfer', 'Outstation', 'Activity'];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/v1/package/rental');
        const result = response.data;
        if (result.success) {
          setPackages(result.data);
          if (result.data.length > 0 && !rentalPackage) {
            setRentalPackage(result.data[0]._id);
          }
        } else {
          setError('Failed to load rental packages');
        }
      } catch (err) {
        setError('Network error while fetching packages');
        console.error('Package Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    setMulticityStops(prev => {
      const newStops = [...prev];
      newStops.forEach((stop, index) => {
        if (index > 0 && newStops[index - 1].selectedDropoffAddress) {
          newStops[index].pickupPlaceId = newStops[index - 1].dropoffPlaceId;
          newStops[index].selectedPickupAddress = newStops[index - 1].selectedDropoffAddress;
        }
      });
      return newStops;
    });
  }, [multicityStops.length]);

  useEffect(() => {
    saveFormToContext();
  }, [
    pickupDateTime,
    transferDateTime,
    outstationTripType,
    outstationPickupDateTime,
    outstationReturnDateTime,
    selectedPlaces,
    rentalPackage,
    multicityStops,
    activeTabIndex,
    activityLocation,
    activityDateTime,
  ]);

  const toggleExpanded = (tabKey) => setExpanded((prev) => ({ ...prev, [tabKey]: !prev[tabKey] }));

  const CustomInput = ({ value, onClick, placeholder }) => (
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
      />
      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );

  const handlePlaceSelect = (ref, key) => {
    if (!ref.current) return;
    const place = ref.current.getPlace();
    if (place && place.geometry && place.place_id) {
      const details = {
        name: place.formatted_address,
        place_id: place.place_id,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedPlaces((prev) => ({ ...prev, [key]: details }));
      if (key.includes('Pickup') || key === 'outstationPickup' || key === 'transferFrom') {
        setPickupBounds(place.geometry.viewport);
      }
    }
  };

  const saveFormToContext = () => {
  const cleanStops = multicityStops.map(({ pickupRef, dropoffRef, ...rest }) => ({
    ...rest,
    dateTime: rest.dateTime ? rest.dateTime.toISOString() : null,
  }));

  let pickupLocation = null;
  let dropoffLocation = null;
  const serviceType = tabs[activeTabIndex].toLowerCase().replace(' ', '_');

  // Reset irrelevant fields based on serviceType
  let newFormData = {
    serviceType,
    pickupDate: null,
    dropoffDate: null,
    transferDateTime: null,
    outstationTripType: serviceType === 'outstation' ? outstationTripType : 'one-way',
    outstationPickupDateTime: null,
    outstationReturnDateTime: null,
    selectedPlaces: selectedPlaces,
    rentalPackage: null,
    multicityStops: [],
    pickupLocation: null,
    dropoffLocation: null,
    activityDateTime: null,
    distance: searchFormData.distance || 0, // Preserve distance
  };

  if (serviceType === 'rental') {
    pickupLocation = selectedPlaces.rentalPickup || null;
    newFormData = {
      ...newFormData,
      pickupDateTime: pickupDateTime ? pickupDateTime.toISOString() : null,
      rentalPackage,
    };
  } else if (serviceType === 'transfer') {
    pickupLocation = selectedPlaces.transferFrom || null;
    dropoffLocation = selectedPlaces.transferTo || null;
    newFormData = {
      ...newFormData,
      transferDateTime: transferDateTime ? transferDateTime.toISOString() : null,
    };
  } else if (serviceType === 'outstation') {
    pickupLocation = selectedPlaces.outstationPickup || null;
    dropoffLocation = outstationTripType === 'multicity' ? null : selectedPlaces.outstationDropoff || null;
    newFormData = {
      ...newFormData,
      outstationPickupDateTime: outstationPickupDateTime ? outstationPickupDateTime.toISOString() : null,
      outstationReturnDateTime: outstationTripType === 'round-trip' ? outstationReturnDateTime?.toISOString() : null,
      multicityStops: outstationTripType === 'multicity' ? cleanStops : [],
    };
  } else if (serviceType === 'activity') {
    pickupLocation = selectedPlaces.activityLocation || null;
    newFormData = {
      ...newFormData,
      activityDateTime: activityDateTime ? activityDateTime.toISOString() : null,
    };
  }

  newFormData.pickupLocation = pickupLocation;
  newFormData.dropoffLocation = dropoffLocation;

  setSearchFormData(newFormData);
};
  const handleSearch = async (data, tab = '') => {
    if (!isLoggedIn) {
      navigate('/', { state: { openLogin: true, pendingSearch: { data, tab } } });
      return;
    }
    saveFormToContext();
    console.log('Form Data Before Send:', data);
    if (!data.pickupLocation || (data.destinations && data.destinations.some(d => !d))) {
      alert(`Invalid locations in ${tab}. Select valid from dropdown.`);
      return;
    }
    try {
      const response = await api.post(endpoints.search, data);
      const result = response.data;
      console.log('API Response:', result);
      if (result.success) {
        setSearchResult(result);
        // Fix: Save distance to searchFormData
        setSearchFormData((prev) => ({
          ...prev,
          distance: result.data.distance || 0, // Save distance from API response
        }));
        sessionStorage.setItem('lastSearch', JSON.stringify(result));
        if (!isUpdate) navigate('/car-listing');
      } else {
        alert(`API Error in ${tab}: ${result.message}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error.');
    }
  };

  const addMulticityStop = () => {
    const newStop = createInitialStop();
    setMulticityStops((prev) => [...prev, newStop]);
  };

  const removeMulticityStop = (index) => {
    setMulticityStops((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMulticityStop = (index, field, value) => {
    setMulticityStops((prev) => {
      const newStops = [...prev];
      newStops[index][field] = value;
      if ((field === 'dropoffPlaceId' || field === 'selectedDropoffAddress') && index < newStops.length - 1) {
        newStops[index + 1].pickupPlaceId = newStops[index].dropoffPlaceId;
        newStops[index + 1].selectedPickupAddress = newStops[index].selectedDropoffAddress;
      }
      return newStops;
    });
  };

  const handleMulticityPlaceSelect = (stopIndex, type) => {
    const ref = multicityStops[stopIndex][type === 'pickup' ? 'pickupRef' : 'dropoffRef'];
    if (!ref.current) return;
    const place = ref.current.getPlace();
    if (place && place.geometry && place.place_id) {
      const name = place.formatted_address;
      const placeId = place.place_id;
      updateMulticityStop(stopIndex, type === 'pickup' ? 'pickupPlaceId' : 'dropoffPlaceId', placeId);
      updateMulticityStop(stopIndex, type === 'pickup' ? 'selectedPickupAddress' : 'selectedDropoffAddress', name);
    }
  };

  const getPreviousDropoffDate = (index) => {
    if (index === 0) return new Date();
    const prevDateStr = multicityStops[index - 1].dateTime;
    return prevDateStr ? new Date(prevDateStr) : new Date();
  };

  const buttonText = isUpdate ? 'Update' : 'Search';
  const buttonIcon = isUpdate ? <FaSearch className="inline" /> : <FaSearch className="inline" />;

  return (
    <LoadScript googleMapsApiKey={googleConfig.apiKey} libraries={googleConfig.libraries}>
      <div className="search-section w-full max-w-7xl mx-auto mt-6 px-4 z-30 relative">
        <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex}>
          <TabList className="flex justify-center gap-0 md:justify-start border-gray-200 mb-0">
            {tabs.map((tab, index, arr) => (
              <Tab
                key={index}
                className={`px-6 py-3 font-grotesk text-md font-medium cursor-pointer backdrop-blur-xl bg-[#cdcdcd33] text-[#ffffff] hover:bg-black transition-colors ${
                  index === 0 ? 'rounded-tl-3xl' : index === arr.length - 1 ? 'rounded-tr-3xl' : ''
                }`}
                selectedClassName="bg-orange-600 text-white"
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const placeId = selectedPlaces.rentalPickup?.place_id;
                if (!placeId || !pickupDateTime || !rentalPackage) {
                  alert('Complete all fields.');
                  return;
                }
                const data = {
                  pickupLocation: placeId,
                  destinations: [],
                  oneWay: true,
                  serviceType: 'rental',
                  packageId: rentalPackage,
                  pickupDateTime: pickupDateTime.toISOString(),
                };
                handleSearch(data, 'Rental');
              }}
              className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Pickup Location</label>
                  <div className="relative">
                    <Autocomplete
                      onLoad={(ac) => (rentalPickupRef.current = ac)}
                      onPlaceChanged={() => handlePlaceSelect(rentalPickupRef, 'rentalPickup')}
                      options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                    >
                      <input
                        type="text"
                        placeholder="Enter pickup location"
                        defaultValue={selectedPlaces.rentalPickup?.name || ''}
                        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                        required
                      />
                    </Autocomplete>
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Pickup Date/Time</label>
                  <DatePicker
                    selected={pickupDateTime}
                    onChange={setPickupDateTime}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomInput placeholder="Select pickup date and time" />}
                    minDate={new Date()}
                    required
                  />
                </div>
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Package</label>
                  {loading ? (
                    <p>Loading packages...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <select
                      value={rentalPackage}
                      onChange={(e) => setRentalPackage(e.target.value)}
                      className="p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Package</option>
                      {packages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>
                          {`${pkg.duration} Hours - ${pkg.kilometer} KM`}
                        </option>
                      ))}
                    </select>
                  )}
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <div className="flex gap-3 items-end pb-3">
                  <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600">
                    {buttonIcon} {buttonText}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fromPlaceId = selectedPlaces.transferFrom?.place_id;
                const toPlaceId = selectedPlaces.transferTo?.place_id;
                if (!fromPlaceId || !toPlaceId || !transferDateTime) {
                  alert('Complete all fields.');
                  return;
                }
                const data = {
                  pickupLocation: fromPlaceId,
                  destinations: [toPlaceId],
                  oneWay: true,
                  serviceType: 'transfer',
                  packageId: null,
                  pickupDateTime: transferDateTime.toISOString(),
                };
                handleSearch(data, 'Transfer');
              }}
              className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">From Location</label>
                  <div className="relative">
                    <Autocomplete
                      onLoad={(ac) => (transferFromRef.current = ac)}
                      onPlaceChanged={() => handlePlaceSelect(transferFromRef, 'transferFrom')}
                      options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                    >
                      <input
                        type="text"
                        placeholder="Type & select from"
                        defaultValue={selectedPlaces.transferFrom?.name || ''}
                        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                        required
                      />
                    </Autocomplete>
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">To Location</label>
                  <div className="relative">
                    <Autocomplete
                      onLoad={(ac) => (transferToRef.current = ac)}
                      onPlaceChanged={() => handlePlaceSelect(transferToRef, 'transferTo')}
                      options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                    >
                      <input
                        type="text"
                        placeholder="Type & select to"
                        defaultValue={selectedPlaces.transferTo?.name || ''}
                        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                        required
                      />
                    </Autocomplete>
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Date/Time</label>
                  <DatePicker
                    selected={transferDateTime}
                    onChange={setTransferDateTime}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomInput placeholder="Select date and time" />}
                    minDate={new Date()}
                    required
                  />
                </div>
                <div className="flex gap-3 items-end pb-3">
                  <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600">
                    {buttonIcon} {buttonText}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (outstationTripType === 'multicity') {
                  const invalidStop = multicityStops.find((stop) => !stop.pickupPlaceId || !stop.dropoffPlaceId || !stop.dateTime);
                  if (invalidStop || multicityStops.length < 1) {
                    alert('Complete all legs.');
                    return;
                  }
                  const data = {
                    pickupLocation: multicityStops[0].pickupPlaceId,
                    destinations: multicityStops.map((stop) => stop.dropoffPlaceId),
                    oneWay: false,
                    serviceType: 'outstation',
                    packageId: null,
                    pickupDateTime: multicityStops[0].dateTime.toISOString(),
                    returnDateTime: multicityStops[multicityStops.length - 1].dateTime.toISOString(),
                  };
                  handleSearch(data, 'Outstation Multicity');
                } else {
                  const pickupPlaceId = selectedPlaces.outstationPickup?.place_id;
                  const dropoffPlaceId = selectedPlaces.outstationDropoff?.place_id;
                  if (!pickupPlaceId || !dropoffPlaceId || !outstationPickupDateTime) {
                    alert('Complete fields.');
                    return;
                  }
                  if (outstationTripType === 'round-trip' && !outstationReturnDateTime) {
                    alert('Select return date.');
                    return;
                  }
                  const data = {
                    pickupLocation: pickupPlaceId,
                    destinations: [dropoffPlaceId],
                    oneWay: outstationTripType === 'one-way',
                    serviceType: 'outstation',
                    packageId: null,
                    pickupDateTime: outstationPickupDateTime.toISOString(),
                    ...(outstationTripType === 'round-trip' && { returnDateTime: outstationReturnDateTime.toISOString() }),
                  };
                  handleSearch(data, 'Outstation');
                }
              }}
              className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
            >
              <div className="flex flex-col w-full relative mb-4">
                <label className="text-md font-grotesk font-semibold mb-2">Trip Type</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="one-way"
                      checked={outstationTripType === 'one-way'}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2"
                    />
                    One-way
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="round-trip"
                      checked={outstationTripType === 'round-trip'}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2"
                    />
                    Round-trip
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="multicity"
                      checked={outstationTripType === 'multicity'}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2"
                    />
                    Multicity
                  </label>
                </div>
              </div>

              {(outstationTripType === 'one-way' || outstationTripType === 'round-trip') && (
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">Pickup Location</label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (outstationPickupRef.current = ac)}
                        onPlaceChanged={() => handlePlaceSelect(outstationPickupRef, 'outstationPickup')}
                        options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                      >
                        <input
                          type="text"
                          placeholder="Type & select pickup"
                          defaultValue={selectedPlaces.outstationPickup?.name || ''}
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">Dropoff Location</label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (outstationDropoffRef.current = ac)}
                        onPlaceChanged={() => handlePlaceSelect(outstationDropoffRef, 'outstationDropoff')}
                        options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                      >
                        <input
                          type="text"
                          placeholder="Type & select dropoff"
                          defaultValue={selectedPlaces.outstationDropoff?.name || ''}
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">Pickup Date/Time</label>
                    <DatePicker
                      selected={outstationPickupDateTime}
                      onChange={setOutstationPickupDateTime}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      customInput={<CustomInput placeholder="Select date and time" />}
                      minDate={new Date()}
                      required
                    />
                  </div>
                  {outstationTripType === 'round-trip' && (
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">Return Date/Time</label>
                      <DatePicker
                        selected={outstationReturnDateTime}
                        onChange={setOutstationReturnDateTime}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={<CustomInput placeholder="Select return date and time" />}
                        minDate={outstationPickupDateTime || new Date()}
                        required
                      />
                    </div>
                  )}
                  <div className="flex gap-3 items-end pb-3">
                    <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600">
                      {buttonIcon} {buttonText}
                    </button>
                  </div>
                </div>
              )}

              {outstationTripType === 'multicity' && (
                <>
                  {multicityStops.map((stop, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 mb-6 border-b pb-6 relative">
                      {index === 0 ? (
                        <div className="flex flex-col w-full relative">
                          <label className="text-md font-grotesk font-semibold mb-2">Starting Pickup</label>
                          <div className="relative">
                            <Autocomplete
                              onLoad={(autocomplete) => {
                                stop.pickupRef.current = autocomplete;
                              }}
                              onPlaceChanged={() => handleMulticityPlaceSelect(index, 'pickup')}
                              options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                            >
                              <input
                                type="text"
                                placeholder="Type & select pickup"
                                defaultValue={stop.selectedPickupAddress || ''}
                                className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                                required
                              />
                            </Autocomplete>
                            <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col w-full relative">
                          <label className="text-md font-grotesk font-semibold mb-2">
                            Pickup Leg {index + 1} (Fixed from prev drop)
                          </label>
                          <div className="p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                            {stop.selectedPickupAddress || 'Waiting for previous drop selection'}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">Dropoff Leg {index + 1}</label>
                        <div className="relative">
                          <Autocomplete
                            onLoad={(autocomplete) => {
                              stop.dropoffRef.current = autocomplete;
                            }}
                            onPlaceChanged={() => handleMulticityPlaceSelect(index, 'dropoff')}
                            options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                          >
                            <input
                              type="text"
                              placeholder="Type & select dropoff"
                              defaultValue={stop.selectedDropoffAddress || ''}
                              className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                              required
                            />
                          </Autocomplete>
                          <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">Departure Date/Time Leg {index + 1}</label>
                        <DatePicker
                          selected={stop.dateTime}
                          onChange={(date) => updateMulticityStop(index, 'dateTime', date)}
                          showTimeSelect
                          dateFormat="MMMM d, yyyy h:mm aa"
                          customInput={<CustomInput placeholder="Select date and time" />}
                          minDate={getPreviousDropoffDate(index)}
                          required
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMulticityStop(index)}
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-4 items-center">
                    <button
                      type="button"
                      onClick={addMulticityStop}
                      className="text-orange-500 bg-[#ff71011a] p-3 rounded-xl flex items-center gap-2"
                    >
                      <FaPlus /> Add Leg
                    </button>
                    <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 ml-auto">
                      {buttonIcon} {buttonText} Multicity
                    </button>
                  </div>
                </>
              )}
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const activityPlaceId = selectedPlaces.activityLocation?.place_id;
                if (!activityPlaceId || !activityDateTime) {
                  alert('Complete all fields.');
                  return;
                }
                const data = {
                  pickupLocation: activityPlaceId,
                  destinations: [],
                  oneWay: true,
                  serviceType: 'activity',
                  packageId: null,
                  pickupDateTime: activityDateTime.toISOString(),
                };
                handleSearch(data, 'Activity');
              }}
              className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Activity Location</label>
                  <div className="relative">
                    <Autocomplete
                      onLoad={(ac) => (activityLocationRef.current = ac)}
                      onPlaceChanged={() => handlePlaceSelect(activityLocationRef, 'activityLocation')}
                      options={{ componentRestrictions: { country: 'IN' }, types: ['geocode'] }}
                    >
                      <input
                        type="text"
                        placeholder="Type & select location"
                        defaultValue={selectedPlaces.activityLocation?.name || ''}
                        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                        required
                      />
                    </Autocomplete>
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">Date/Time</label>
                  <DatePicker
                    selected={activityDateTime}
                    onChange={setActivityDateTime}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomInput placeholder="Select date and time" />}
                    minDate={new Date()}
                    required
                  />
                </div>
                <div className="flex gap-3 items-end pb-3">
                  <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600">
                    {buttonIcon} {buttonText}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>
        </Tabs>
      </div>
    </LoadScript>
  );
};

export default SearchSection;
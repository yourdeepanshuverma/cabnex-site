import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { googleConfig, api, endpoints } from "../../api/api-config";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

registerLocale("en-US", enUS);

const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(8, 0, 0, 0);
  return now;
};

const SearchSection = ({ isUpdate = false, onUpdateComplete }) => {
  const {
    searchFormData,
    setSearchFormData,
    user,
    setSearchResult,
    isLoggedIn,
  } = useSearch();
  const navigate = useNavigate();

  const tabServiceMap = {
    outstation: 0,
    transfer: 1,
    activity: 2,
    rental: 3,
  };

  const [activeTabIndex, setActiveTabIndex] = useState(
    searchFormData.serviceType &&
      tabServiceMap[searchFormData.serviceType] !== undefined
      ? tabServiceMap[searchFormData.serviceType]
      : 0,
  );

  // Transfer-specific states
  const [transferDirection, setTransferDirection] = useState("home-to-station");
  const [selectedCity, setSelectedCity] = useState(
    searchFormData.selectedCity || null,
  );
  const cityRef = useRef(null);

  // Refs
  const rentalPickupRef = useRef(null);
  const transferFromRef = useRef(null);
  const transferToRef = useRef(null);
  const outstationPickupRef = useRef(null);
  const outstationDropoffRef = useRef(null);
  const activityLocationRef = useRef(null);

  // States
  const [pickupDateTime, setPickupDateTime] = useState(
    searchFormData.pickupDate
      ? new Date(searchFormData.pickupDate)
      : getDefaultDateTime(),
  );
  const [transferDateTime, setTransferDateTime] = useState(
    searchFormData.transferDateTime
      ? new Date(searchFormData.transferDateTime)
      : getDefaultDateTime(),
  );
  const [outstationTripType, setOutstationTripType] = useState(
    searchFormData.outstationTripType || "multicity",
  );
  const [outstationPickupDateTime, setOutstationPickupDateTime] = useState(
    searchFormData.outstationPickupDateTime
      ? new Date(searchFormData.outstationPickupDateTime)
      : getDefaultDateTime(),
  );
  const [outstationReturnDateTime, setOutstationReturnDateTime] = useState(
    searchFormData.outstationReturnDateTime
      ? new Date(searchFormData.outstationReturnDateTime)
      : getDefaultDateTime(),
  );
  const [selectedPlaces, setSelectedPlaces] = useState(
    searchFormData.selectedPlaces || {},
  );
  const [rentalPackage, setRentalPackage] = useState(
    searchFormData.rentalPackage || "",
  );
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activityDateTime, setActivityDateTime] = useState(
    searchFormData.activityDateTime
      ? new Date(searchFormData.activityDateTime)
      : getDefaultDateTime(),
  );

  const createInitialStop = (dateTime) => ({
    pickupPlaceId: null,
    dropoffPlaceId: null,
    dateTime: dateTime ? new Date(dateTime) : getDefaultDateTime(),
    pickupRef: React.createRef(),
    dropoffRef: React.createRef(),
    selectedPickupAddress: "",
    selectedDropoffAddress: "",
  });

  const [multicityStops, setMulticityStops] = useState(() => {
    let stops = searchFormData.multicityStops || [];
    if (stops.length === 0) {
      stops = [createInitialStop()];
    } else {
      stops = stops.map((stop) => ({
        ...stop,
        pickupRef: React.createRef(),
        dropoffRef: React.createRef(),
        dateTime: stop.dateTime ? new Date(stop.dateTime) : null,
      }));
    }
    return stops;
  });

  const tabs = ["Outstation", "Transfer", "Activity", "Rental"];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/package/rental");
        const result = response.data;
        if (result.success) {
          setPackages(result.data);
          if (result.data.length > 0 && !rentalPackage) {
            setRentalPackage(result.data[0]._id);
          }
        } else {
          setError("Failed to load rental packages");
        }
      } catch (err) {
        setError("Network error while fetching packages");
        console.error("Package Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    setMulticityStops((prev) => {
      const newStops = [...prev];
      newStops.forEach((stop, index) => {
        if (index > 0 && newStops[index - 1].selectedDropoffAddress) {
          newStops[index].pickupPlaceId = newStops[index - 1].dropoffPlaceId;
          newStops[index].selectedPickupAddress =
            newStops[index - 1].selectedDropoffAddress;
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
    activityDateTime,
    selectedCity,
    transferDirection,
  ]);

  const CustomInput = ({ value, onClick, placeholder }) => (
    <div className="relative">
      <input
        type="text"
        value={value || ""}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
      />
      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );

  const handlePlaceSelect = (ref, key, onCitySelect = null) => {
    if (!ref.current) return;
    const place = ref.current.getPlace();
    if (place && place.geometry && place.place_id) {
      const details = {
        name: place.formatted_address,
        place_id: place.place_id,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        viewport: place.geometry.viewport,
      };

      // Set the place for all keys (rentalPickup, transferFrom, etc.)
      setSelectedPlaces((prev) => ({
        ...prev,
        [key]: details,
      }));

      if (onCitySelect && key === "transferCity") {
        setSelectedCity(details);
        onCitySelect(details);
      }
    }
  };

  const saveFormToContext = () => {
    const cleanStops = multicityStops.map(
      ({ pickupRef, dropoffRef, ...rest }) => ({
        ...rest,
        dateTime: rest.dateTime ? rest.dateTime.toISOString() : null,
      }),
    );

    let pickupLocation = null;
    let dropoffLocation = null;
    const serviceType = tabs[activeTabIndex].toLowerCase().replace(" ", "_");

    let newFormData = {
      serviceType,
      pickupDate: null,
      dropoffDate: null,
      transferDateTime: null,
      outstationTripType:
        serviceType === "outstation" ? outstationTripType : "multicity",
      outstationPickupDateTime: null,
      outstationReturnDateTime: null,
      selectedPlaces,
      rentalPackage: null,
      multicityStops: [],
      pickupLocation: null,
      dropoffLocation: null,
      activityDateTime: null,
      distance: searchFormData.distance || 0,
      transferDirection: serviceType === "transfer" ? transferDirection : null,
      selectedCity: serviceType === "transfer" ? selectedCity : null,
    };

    if (serviceType === "rental") {
      pickupLocation = selectedPlaces.rentalPickup || null;
      newFormData = {
        ...newFormData,
        pickupDateTime: pickupDateTime ? pickupDateTime.toISOString() : null,
        rentalPackage,
      };
    } else if (serviceType === "transfer") {
      pickupLocation = selectedPlaces.transferFrom || null;
      dropoffLocation = selectedPlaces.transferTo || null;
      newFormData = {
        ...newFormData,
        transferDateTime: transferDateTime
          ? transferDateTime.toISOString()
          : null,
        transferDirection,
      };
    } else if (serviceType === "outstation") {
      pickupLocation = selectedPlaces.outstationPickup || null;
      dropoffLocation =
        outstationTripType === "multicity"
          ? null
          : selectedPlaces.outstationDropoff || null;
      newFormData = {
        ...newFormData,
        outstationPickupDateTime: outstationPickupDateTime
          ? outstationPickupDateTime.toISOString()
          : null,
        outstationReturnDateTime:
          outstationTripType === "round-trip"
            ? outstationReturnDateTime?.toISOString()
            : null,
        multicityStops: outstationTripType === "multicity" ? cleanStops : [],
      };
    } else if (serviceType === "activity") {
      pickupLocation = selectedPlaces.activityLocation || null;
      newFormData = {
        ...newFormData,
        activityDateTime: activityDateTime
          ? activityDateTime.toISOString()
          : null,
      };
    }

    newFormData.pickupLocation = pickupLocation;
    newFormData.dropoffLocation = dropoffLocation;

    setSearchFormData(newFormData);
  };

  const handleSearch = async (data, tab = "") => {
    if (!isLoggedIn) {
      navigate("/", {
        state: { openLogin: true, pendingSearch: { data, tab } },
      });
      return;
    }
    if (!user.isVerified) {
      toast.error(
        "Please wait for your account to be verified to perform searches or contact support.",
      );
      return;
    }
    saveFormToContext();
    if (
      !data.pickupLocation ||
      (data.destinations && data.destinations.some((d) => !d))
    ) {
      alert(`Invalid locations in ${tab}. Select valid from dropdown.`);
      return;
    }
    try {
      const response = await api.post(endpoints.search, data);
      const result = response.data;
      if (result.success) {
        setSearchResult(result);
        setSearchFormData((prev) => ({
          ...prev,
          distance: result.data.distance || 0,
        }));
        sessionStorage.setItem("lastSearch", JSON.stringify(result));
        if (isUpdate) {
          if (onUpdateComplete) onUpdateComplete();
        } else {
          navigate("/car-listing");
        }
      } else {
        alert(`API Error in ${tab}: ${result.message}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error.");
    }
  };

  const addMulticityStop = () => {
    setMulticityStops((prev) => {
      const lastStop = prev[prev.length - 1];

      const defaultDateTime = lastStop?.dateTime
        ? new Date(lastStop.dateTime)
        : getDefaultDateTime();

      return [...prev, createInitialStop(defaultDateTime)];
    });
  };

  const removeMulticityStop = (index) => {
    setMulticityStops((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMulticityStop = (index, field, value) => {
    setMulticityStops((prev) => {
      const newStops = [...prev];
      newStops[index][field] = value;
      if (
        (field === "dropoffPlaceId" || field === "selectedDropoffAddress") &&
        index < newStops.length - 1
      ) {
        newStops[index + 1].pickupPlaceId = newStops[index].dropoffPlaceId;
        newStops[index + 1].selectedPickupAddress =
          newStops[index].selectedDropoffAddress;
      }
      return newStops;
    });
  };

  const handleMulticityPlaceSelect = (stopIndex, type) => {
    const ref =
      multicityStops[stopIndex][type === "pickup" ? "pickupRef" : "dropoffRef"];
    if (!ref.current) return;
    const place = ref.current.getPlace();
    if (place && place.geometry && place.place_id) {
      const name = place.formatted_address;
      const placeId = place.place_id;
      updateMulticityStop(
        stopIndex,
        type === "pickup" ? "pickupPlaceId" : "dropoffPlaceId",
        placeId,
      );
      updateMulticityStop(
        stopIndex,
        type === "pickup" ? "selectedPickupAddress" : "selectedDropoffAddress",
        name,
      );
    }
  };

  const getPreviousDropoffDate = (index) => {
    if (index === 0) return new Date();
    const prevDateStr = multicityStops[index - 1].dateTime;
    return prevDateStr ? new Date(prevDateStr) : new Date();
  };

  const buttonText = isUpdate ? "Update Search" : "Search";
  const buttonIcon = <FaSearch className="inline" />;

  const handleTabSwitch = (index) => {
    const newServiceType = tabs[index].toLowerCase().replace(" ", "_");
    const defaultDateTime = getDefaultDateTime(); // Get default date/time once
    const defaultDateTimeISO = defaultDateTime.toISOString();

    // Reset internal component state
    setPickupDateTime(defaultDateTime);
    setTransferDateTime(defaultDateTime);
    setOutstationTripType("multicity");
    setOutstationPickupDateTime(defaultDateTime);
    setOutstationReturnDateTime(defaultDateTime);
    setSelectedPlaces({});
    setRentalPackage("");
    setMulticityStops([createInitialStop()]); // createInitialStop already uses getDefaultDateTime()
    setActivityDateTime(defaultDateTime);
    setSelectedCity(null);
    setTransferDirection("home-to-station");

    // Reset the context state, preserving only the new service type and setting default times
    setSearchFormData((prev) => ({
      ...prev,
      pickupDate: null,
      dropoffDate: null,
      pickupDateTime: defaultDateTimeISO,
      transferDateTime: defaultDateTimeISO,
      outstationTripType: "multicity",
      outstationPickupDateTime: defaultDateTimeISO,
      outstationReturnDateTime: defaultDateTimeISO,
      selectedPlaces: {},
      rentalPackage: "",
      multicityStops: [
        {
          // Default multicity stop with default time
          pickupPlaceId: null,
          dropoffPlaceId: null,
          dateTime: defaultDateTimeISO,
          selectedPickupAddress: "",
          selectedDropoffAddress: "",
        },
      ],
      serviceType: newServiceType,
      dropoffLocation: null,
      pickupLocation: null,
      transferDirection: "home-to-station",
      selectedCity: null,
      distance: 0,
      activityDateTime: defaultDateTimeISO,
    }));

    // Set the new tab as active
    setActiveTabIndex(index);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="font-grotesk"
      />
      <LoadScript
        googleMapsApiKey={googleConfig.apiKey}
        libraries={googleConfig.libraries}
      >
        <div className="search-section w-full max-w-7xl mx-auto mt-6 px-4 z-30 relative">
          <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSwitch}>
            <TabList className="flex flex-wrap justify-center gap-0 md:justify-start border-gray-200 mb-0">
              {tabs.map((tab, index, arr) => (
                <Tab
                  key={index}
                  className={`w-1/2 md:w-auto text-center px-6 py-3 font-grotesk text-md font-medium cursor-pointer backdrop-blur-xl bg-black md:bg-[#cdcdcd33] text-[#ffffff] hover:bg-black transition-colors ${
                    index === 0
                      ? "rounded-tl-3xl md:rounded-tl-3xl"
                      : index === arr.length - 1
                        ? "rounded-tr-3xl md:rounded-tr-3xl"
                        : ""
                  }`}
                  selectedClassName="!bg-orange-600 text-white"
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            {/* OUTSTATION TAB */}
            <TabPanel>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (outstationTripType === "multicity") {
                    const invalidStop = multicityStops.find(
                      (stop) =>
                        !stop.pickupPlaceId ||
                        !stop.dropoffPlaceId ||
                        !stop.dateTime,
                    );
                    if (invalidStop || multicityStops.length < 1) {
                      alert("Complete all legs.");
                      return;
                    }
                    const data = {
                      pickupLocation: multicityStops[0].pickupPlaceId,
                      destinations: multicityStops.map(
                        (stop) => stop.dropoffPlaceId,
                      ),
                      oneWay: false,
                      serviceType: "outstation",
                      packageId: null,
                      pickupDateTime: multicityStops[0].dateTime.toISOString(),
                      returnDateTime:
                        multicityStops[
                          multicityStops.length - 1
                        ].dateTime.toISOString(),
                    };
                    handleSearch(data, "Outstation Multicity");
                  } else {
                    const pickupPlaceId =
                      selectedPlaces.outstationPickup?.place_id;
                    const dropoffPlaceId =
                      selectedPlaces.outstationDropoff?.place_id;
                    if (
                      !pickupPlaceId ||
                      !dropoffPlaceId ||
                      !outstationPickupDateTime
                    ) {
                      alert("Complete fields.");
                      return;
                    }
                    if (
                      outstationTripType === "round-trip" &&
                      !outstationReturnDateTime
                    ) {
                      alert("Select return date.");
                      return;
                    }
                    const data = {
                      pickupLocation: pickupPlaceId,
                      destinations: [dropoffPlaceId],
                      oneWay: outstationTripType === "one-way",
                      serviceType: "outstation",
                      packageId: null,
                      pickupDateTime: outstationPickupDateTime.toISOString(),
                      ...(outstationTripType === "round-trip" && {
                        returnDateTime: outstationReturnDateTime.toISOString(),
                      }),
                    };
                    handleSearch(data, "Outstation");
                  }
                }}
                className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
              >
                <div className="flex flex-col w-full relative mb-4">
                  <label className="text-md font-grotesk font-semibold mb-2">
                    Trip Type
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="outstationTripType"
                        value="multicity"
                        checked={outstationTripType === "multicity"}
                        onChange={(e) => setOutstationTripType(e.target.value)}
                        className="mr-2"
                      />
                      Multicity
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="outstationTripType"
                        value="round-trip"
                        checked={outstationTripType === "round-trip"}
                        onChange={(e) => setOutstationTripType(e.target.value)}
                        className="mr-2"
                      />
                      Round-trip
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="outstationTripType"
                        value="one-way"
                        checked={outstationTripType === "one-way"}
                        onChange={(e) => setOutstationTripType(e.target.value)}
                        className="mr-2"
                      />
                      One-way
                    </label>
                  </div>
                </div>

                {(outstationTripType === "one-way" ||
                  outstationTripType === "round-trip") && (
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">
                        Pickup Location
                      </label>
                      <div className="relative">
                        <Autocomplete
                          onLoad={(ac) => (outstationPickupRef.current = ac)}
                          onPlaceChanged={() =>
                            handlePlaceSelect(
                              outstationPickupRef,
                              "outstationPickup",
                            )
                          }
                          options={{
                            componentRestrictions: { country: "IN" },
                            types: ["geocode"],
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Type & select pickup"
                            defaultValue={
                              selectedPlaces.outstationPickup?.name || ""
                            }
                            className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                            required
                          />
                        </Autocomplete>
                        <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">
                        Dropoff Location
                      </label>
                      <div className="relative">
                        <Autocomplete
                          onLoad={(ac) => (outstationDropoffRef.current = ac)}
                          onPlaceChanged={() =>
                            handlePlaceSelect(
                              outstationDropoffRef,
                              "outstationDropoff",
                            )
                          }
                          options={{
                            componentRestrictions: { country: "IN" },
                            types: ["geocode"],
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Type & select dropoff"
                            defaultValue={
                              selectedPlaces.outstationDropoff?.name || ""
                            }
                            className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                            required
                          />
                        </Autocomplete>
                        <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">
                        Pickup Date/Time
                      </label>
                      <DatePicker
                        selected={outstationPickupDateTime}
                        onChange={setOutstationPickupDateTime}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={
                          <CustomInput placeholder="Select date and time" />
                        }
                        minDate={new Date()}
                        required
                      />
                    </div>
                    {outstationTripType === "round-trip" && (
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">
                          Return Date/Time
                        </label>
                        <DatePicker
                          selected={outstationReturnDateTime}
                          onChange={setOutstationReturnDateTime}
                          showTimeSelect
                          dateFormat="MMMM d, yyyy h:mm aa"
                          customInput={
                            <CustomInput placeholder="Select return date and time" />
                          }
                          minDate={outstationPickupDateTime || new Date()}
                          required
                        />
                      </div>
                    )}
                    <div className="flex gap-3 items-end pb-3">
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600"
                      >
                        {buttonIcon} {buttonText}
                      </button>
                    </div>
                  </div>
                )}

                {outstationTripType === "multicity" && (
                  <>
                    {multicityStops.map((stop, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-4 mb-6 border-b pb-6 relative"
                      >
                        {index === 0 ? (
                          <div className="flex flex-col w-full relative">
                            <label className="text-md font-grotesk font-semibold mb-2">
                              Starting Pickup
                            </label>
                            <div className="relative">
                              <Autocomplete
                                onLoad={(autocomplete) => {
                                  stop.pickupRef.current = autocomplete;
                                }}
                                onPlaceChanged={() =>
                                  handleMulticityPlaceSelect(index, "pickup")
                                }
                                options={{
                                  componentRestrictions: { country: "IN" },
                                  types: ["geocode"],
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Type & select pickup"
                                  defaultValue={
                                    stop.selectedPickupAddress || ""
                                  }
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
                              Pickup Destination {index + 1}
                            </label>
                            <div className="p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                              {stop.selectedPickupAddress ||
                                "Waiting for previous drop selection"}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col w-full relative">
                          <label className="text-md font-grotesk font-semibold mb-2">
                            Destination – Stop {index + 1}
                          </label>
                          <div className="relative">
                            <Autocomplete
                              onLoad={(autocomplete) => {
                                stop.dropoffRef.current = autocomplete;
                              }}
                              onPlaceChanged={() =>
                                handleMulticityPlaceSelect(index, "dropoff")
                              }
                              options={{
                                componentRestrictions: { country: "IN" },
                                types: ["geocode"],
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Type & select dropoff"
                                defaultValue={stop.selectedDropoffAddress || ""}
                                className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                                required
                              />
                            </Autocomplete>
                            <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex flex-col w-full relative">
                          <label className="text-md font-grotesk font-semibold mb-2">
                            Travel Date & Time – Stop {index + 1}
                          </label>
                          <DatePicker
                            selected={stop.dateTime}
                            onChange={(date) =>
                              updateMulticityStop(index, "dateTime", date)
                            }
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            customInput={
                              <CustomInput placeholder="Select date and time" />
                            }
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
                        <FaPlus /> Add Stop
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 ml-auto"
                      >
                        {buttonIcon} {buttonText} Multicity
                      </button>
                    </div>
                  </>
                )}
              </form>
            </TabPanel>

            {/* TRANSFER TAB - SENDS transferDirection */}
            <TabPanel>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fromPlaceId = selectedPlaces.transferFrom?.place_id;
                  const toPlaceId = selectedPlaces.transferTo?.place_id;
                  if (
                    !selectedCity ||
                    !fromPlaceId ||
                    !toPlaceId ||
                    !transferDateTime
                  ) {
                    alert("Complete all fields: City, From, To, Date/Time.");
                    return;
                  }
                  const data = {
                    pickupLocation: fromPlaceId,
                    destinations: [toPlaceId],
                    oneWay: true,
                    serviceType: "transfer",
                    packageId: null,
                    pickupDateTime: transferDateTime.toISOString(),
                    transferDirection,
                  };
                  handleSearch(data, "Transfer");
                }}
                className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
              >
                {/* Trip Direction */}
                <div className="mb-4">
                  <label className="text-md font-grotesk font-semibold mb-2 block">
                    Trip Direction
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="direction"
                        value="home-to-station"
                        checked={transferDirection === "home-to-station"}
                        onChange={(e) => setTransferDirection(e.target.value)}
                        className="mr-2"
                      />
                      Home to Station
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="direction"
                        value="station-to-home"
                        checked={transferDirection === "station-to-home"}
                        onChange={(e) => setTransferDirection(e.target.value)}
                        className="mr-2"
                      />
                      Station to Home
                    </label>
                  </div>
                </div>

                {/* City Selection */}
                <div className="mb-4">
                  <label className="text-md font-grotesk font-semibold mb-2 block">
                    Select City
                  </label>
                  <div className="relative">
                    <Autocomplete
                      onLoad={(ac) => (cityRef.current = ac)}
                      onPlaceChanged={() =>
                        handlePlaceSelect(cityRef, "transferCity", () => {
                          setSelectedPlaces((prev) => ({
                            ...prev,
                            transferFrom: null,
                            transferTo: null,
                          }));
                        })
                      }
                      options={{
                        types: ["(cities)"],
                        componentRestrictions: { country: "IN" },
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Type city name (e.g., Delhi)"
                        defaultValue={selectedCity?.name || ""}
                        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                        required
                      />
                    </Autocomplete>
                    <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* From & To Fields */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* FROM */}
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      {transferDirection === "home-to-station"
                        ? `Home Address in ${selectedCity?.name || "City"}`
                        : "Station in City"}
                    </label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (transferFromRef.current = ac)}
                        onPlaceChanged={() =>
                          handlePlaceSelect(transferFromRef, "transferFrom")
                        }
                        options={{
                          bounds: selectedCity?.viewport || undefined,
                          strictBounds: true,
                          types:
                            transferDirection === "home-to-station"
                              ? ["geocode"]
                              : ["train_station", "bus_station", "airport"],
                          componentRestrictions: { country: "IN" },
                        }}
                        disabled={!selectedCity}
                      >
                        <input
                          type="text"
                          placeholder={
                            selectedCity ? "Type address" : "Select city first"
                          }
                          defaultValue={selectedPlaces.transferFrom?.name || ""}
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          disabled={!selectedCity}
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* TO */}
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      {transferDirection === "home-to-station"
                        ? "Station in City"
                        : `Home Address in ${selectedCity?.name || "City"}`}
                    </label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (transferToRef.current = ac)}
                        onPlaceChanged={() =>
                          handlePlaceSelect(transferToRef, "transferTo")
                        }
                        options={{
                          bounds: selectedCity?.viewport || undefined,
                          strictBounds: true,
                          types:
                            transferDirection === "home-to-station"
                              ? ["train_station", "bus_station", "airport"]
                              : ["geocode"],
                          componentRestrictions: { country: "IN" },
                        }}
                        disabled={!selectedCity}
                      >
                        <input
                          type="text"
                          placeholder={
                            selectedCity
                              ? "Select station"
                              : "Select city first"
                          }
                          defaultValue={selectedPlaces.transferTo?.name || ""}
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          disabled={!selectedCity}
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Date/Time
                    </label>
                    <DatePicker
                      selected={transferDateTime}
                      onChange={setTransferDateTime}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      customInput={
                        <CustomInput placeholder="Select date and time" />
                      }
                      minDate={new Date()}
                      required
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 items-end pb-3">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600"
                    >
                      {buttonIcon} {buttonText}
                    </button>
                  </div>
                </div>
              </form>
            </TabPanel>

            {/* ACTIVITY TAB */}
            <TabPanel>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const activityPlaceId =
                    selectedPlaces.activityLocation?.place_id;
                  if (!activityPlaceId || !activityDateTime) {
                    alert("Complete all fields.");
                    return;
                  }
                  const data = {
                    pickupLocation: activityPlaceId,
                    destinations: [],
                    oneWay: true,
                    serviceType: "activity",
                    packageId: null,
                    pickupDateTime: activityDateTime.toISOString(),
                  };
                  handleSearch(data, "Activity");
                }}
                className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Activity Location
                    </label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (activityLocationRef.current = ac)}
                        onPlaceChanged={() =>
                          handlePlaceSelect(
                            activityLocationRef,
                            "activityLocation",
                          )
                        }
                        options={{
                          componentRestrictions: { country: "IN" },
                          types: ["geocode"],
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Type & select location"
                          defaultValue={
                            selectedPlaces.activityLocation?.name || ""
                          }
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Date/Time
                    </label>
                    <DatePicker
                      selected={activityDateTime}
                      onChange={setActivityDateTime}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      customInput={
                        <CustomInput placeholder="Select date and time" />
                      }
                      minDate={new Date()}
                      required
                    />
                  </div>
                  <div className="flex gap-3 items-end pb-3">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600"
                    >
                      {buttonIcon} {buttonText}
                    </button>
                  </div>
                </div>
              </form>
            </TabPanel>

            {/* RENTAL TAB */}
            <TabPanel>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const placeId = selectedPlaces.rentalPickup?.place_id;
                  if (!placeId || !pickupDateTime || !rentalPackage) {
                    alert("Complete all fields.");
                    return;
                  }
                  const data = {
                    pickupLocation: placeId,
                    destinations: [],
                    oneWay: true,
                    serviceType: "rental",
                    packageId: rentalPackage,
                    pickupDateTime: pickupDateTime.toISOString(),
                  };
                  handleSearch(data, "Rental");
                }}
                className="flex flex-col w-full rounded-tl-none rounded-3xl py-3 px-5 bg-gray-50 shadow-md"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <Autocomplete
                        onLoad={(ac) => (rentalPickupRef.current = ac)}
                        onPlaceChanged={() =>
                          handlePlaceSelect(rentalPickupRef, "rentalPickup")
                        }
                        options={{
                          componentRestrictions: { country: "IN" },
                          types: ["geocode"],
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Enter pickup location"
                          defaultValue={selectedPlaces.rentalPickup?.name || ""}
                          className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                          required
                        />
                      </Autocomplete>
                      <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Pickup Date/Time
                    </label>
                    <DatePicker
                      selected={pickupDateTime}
                      onChange={setPickupDateTime}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      customInput={
                        <CustomInput placeholder="Select pickup date and time" />
                      }
                      minDate={new Date()}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full relative">
                    <label className="text-md font-grotesk font-semibold mb-2">
                      Package
                    </label>
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
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600"
                    >
                      {buttonIcon} {buttonText}
                    </button>
                  </div>
                </div>
              </form>
            </TabPanel>
          </Tabs>
        </div>
      </LoadScript>
    </>
  );
};

export default SearchSection;

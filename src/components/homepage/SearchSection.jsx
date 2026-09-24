import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import { api, endpoints } from "../../api/api-config";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CityAutocomplete, {
  formatCityDisplay,
} from "../common/CityAutocomplete";
import SearchLoadingModal from "../common/SearchLoadingModal";

registerLocale("en-US", enUS);

const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(8, 0, 0, 0);
  return now;
};

// Start-of-day date helper for multicity date-only inputs
const getDefaultDateOnly = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
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

  const [isSearching, setIsSearching] = useState(false);
  const [searchMeta, setSearchMeta] = useState({});

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
  const [transferDirection, setTransferDirection] = useState(
    searchFormData.transferDirection || "home-to-station",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchFormData.selectedCity || null,
  );
  const [availableTransfers, setAvailableTransfers] = useState([]);
  const [selectedTransferId, setSelectedTransferId] = useState(
    searchFormData.selectedTransfer?._id || "",
  );

  // Date/Time States
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

  // Multicity helper to initialize stop (DATE ONLY - time stripped)
  const createInitialStop = (date) => {
    const d = date ? new Date(date) : getDefaultDateOnly();
    d.setHours(0, 0, 0, 0);
    return {
      pickupCityId: null,
      dropoffCityId: null,
      pickupCity: null,
      dropoffCity: null,
      selectedPickupAddress: "",
      selectedDropoffAddress: "",
      dateTime: d,
      nightsAtCity: 0,
    };
  };

  const [multicityStops, setMulticityStops] = useState(() => {
    let stops = searchFormData.multicityStops || [];
    if (stops.length === 0) {
      stops = [createInitialStop()];
    } else {
      stops = stops.map((stop) => {
        const d = stop.dateTime ? new Date(stop.dateTime) : getDefaultDateOnly();
        d.setHours(0, 0, 0, 0);
        return {
          ...stop,
          pickupCityId: stop.pickupCityId || stop.pickupPlaceId || null,
          dropoffCityId: stop.dropoffCityId || stop.dropoffPlaceId || null,
          dateTime: d,
          nightsAtCity: stop.nightsAtCity || 0,
        };
      });
    }
    return stops;
  });

  const tabs = ["Outstation", "Transfer", "Activity", "Rental"];

  // Fetch rental packages
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

  // Fetch transfers when transfer city changes
  useEffect(() => {
    if (!selectedCity) {
      setAvailableTransfers([]);
      setSelectedTransferId("");
      return;
    }
    const fetchTransfers = async () => {
      try {
        const cityName = selectedCity.city || selectedCity.name || "";
        const url = cityName
          ? `${endpoints.masterTransfers}?city=${cityName}`
          : endpoints.masterTransfers;
        const response = await api.get(url);
        if (response.data?.success) {
          const transfers = response.data?.data?.transfers || [];
          setAvailableTransfers(transfers);
          if (transfers.length > 0) {
            setSelectedTransferId(transfers[0]._id);
          } else {
            setSelectedTransferId("");
          }
        }
      } catch (err) {
        console.error("Transfer Fetch Error:", err);
      }
    };
    fetchTransfers();
  }, [selectedCity]);

  // Keep subsequent multicity stops' pickup in sync with previous dropoff
  useEffect(() => {
    setMulticityStops((prev) => {
      let changed = false;
      const newStops = [...prev];
      newStops.forEach((stop, index) => {
        if (index > 0) {
          const prevDropoff = newStops[index - 1].dropoffCityId;
          const prevAddress = newStops[index - 1].selectedDropoffAddress;
          const prevCityObj = newStops[index - 1].dropoffCity;
          if (
            stop.pickupCityId !== prevDropoff ||
            stop.selectedPickupAddress !== prevAddress
          ) {
            newStops[index] = {
              ...stop,
              pickupCityId: prevDropoff,
              pickupCity: prevCityObj,
              selectedPickupAddress: prevAddress,
            };
            changed = true;
          }
        }
      });
      return changed ? newStops : prev;
    });
  }, [multicityStops.length]);

  // Save form to context on change
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
    selectedTransferId,
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
        className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full cursor-pointer bg-white"
      />
      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );

  const saveFormToContext = () => {
    const cleanStops = multicityStops.map((stop) => ({
      pickupCityId: stop.pickupCityId,
      dropoffCityId: stop.dropoffCityId,
      pickupPlaceId: stop.pickupCityId,
      dropoffPlaceId: stop.dropoffCityId,
      pickupCity: stop.pickupCity,
      dropoffCity: stop.dropoffCity,
      selectedPickupAddress: stop.selectedPickupAddress,
      selectedDropoffAddress: stop.selectedDropoffAddress,
      dateTime: stop.dateTime ? stop.dateTime.toISOString() : null,
      nightsAtCity: stop.nightsAtCity || 0,
    }));

    const serviceType = tabs[activeTabIndex].toLowerCase().replace(" ", "_");
    const selectedTransfer =
      availableTransfers.find((t) => t._id === selectedTransferId) || null;

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
      pickupCityId: null,
      dropoffCityId: null,
      activityDateTime: null,
      distance: searchFormData.distance || 0,
      transferDirection: serviceType === "transfer" ? transferDirection : null,
      selectedCity: serviceType === "transfer" ? selectedCity : null,
      selectedTransfer,
    };

    if (serviceType === "rental") {
      newFormData = {
        ...newFormData,
        pickupDateTime: pickupDateTime ? pickupDateTime.toISOString() : null,
        pickupCityId: selectedPlaces.rentalPickup?._id || null,
        pickupLocation: selectedPlaces.rentalPickup?.city || null,
        rentalPackage,
      };
    } else if (serviceType === "transfer") {
      newFormData = {
        ...newFormData,
        transferDateTime: transferDateTime
          ? transferDateTime.toISOString()
          : null,
        transferDirection,
        pickupCityId: selectedCity?._id || null,
        pickupLocation: selectedCity?.city || null,
      };
    } else if (serviceType === "outstation") {
      const pickupCity = selectedPlaces.outstationPickup;
      const dropoffCity = selectedPlaces.outstationDropoff;
      newFormData = {
        ...newFormData,
        outstationPickupDateTime: outstationPickupDateTime
          ? outstationPickupDateTime.toISOString()
          : null,
        outstationReturnDateTime:
          outstationTripType === "round-trip" && outstationReturnDateTime
            ? outstationReturnDateTime.toISOString()
            : null,
        pickupCityId: pickupCity?._id || null,
        dropoffCityId: dropoffCity?._id || null,
        pickupLocation: pickupCity?.city || null,
        dropoffLocation: dropoffCity?.city || null,
        multicityStops: outstationTripType === "multicity" ? cleanStops : [],
      };
    } else if (serviceType === "activity") {
      newFormData = {
        ...newFormData,
        activityDateTime: activityDateTime
          ? activityDateTime.toISOString()
          : null,
        pickupCityId: selectedPlaces.activityLocation?._id || null,
        pickupLocation: selectedPlaces.activityLocation?.city || null,
      };
    }

    setSearchFormData(newFormData);
  };

  const handleSearch = async (data, tab = "") => {
    if (!isLoggedIn) {
      navigate("/", {
        state: { openLogin: true, pendingSearch: { data, tab } },
      });
      return;
    }
    if (user && !user.isVerified) {
      toast.error(
        "Please wait for your account to be verified to perform searches or contact support.",
      );
      return;
    }

    // Determine descriptive metadata for the animation
    let meta = {
      tripType: tab || "Cab Search",
    };

    if (tab === "Outstation Multicity") {
      const originName =
        multicityStops[0]?.pickupCity?.city ||
        multicityStops[0]?.selectedPickupAddress ||
        "";
      const destName =
        multicityStops[multicityStops.length - 1]?.dropoffCity?.city ||
        multicityStops[multicityStops.length - 1]?.selectedDropoffAddress ||
        "";
      meta = {
        origin: originName,
        destination: destName,
        legsCount: multicityStops.length,
        tripType: "Outstation Multicity",
      };
    } else if (tab === "Outstation") {
      meta = {
        origin: selectedPlaces.outstationPickup?.city || "",
        destination: selectedPlaces.outstationDropoff?.city || "",
        tripType:
          outstationTripType === "round-trip"
            ? "Outstation Round-Trip"
            : "Outstation One-Way",
      };
    } else if (tab === "Transfer") {
      meta = {
        origin: selectedCity?.city || "",
        destination:
          transferDirection === "home-to-station"
            ? "Airport / Station"
            : "City Address",
        tripType: "City Transfer",
      };
    } else if (tab === "Activity") {
      meta = {
        origin: selectedPlaces.activityLocation?.city || "",
        destination: "Activity Tour",
        tripType: "Sightseeing & Activities",
      };
    } else if (tab === "Rental") {
      meta = {
        origin: selectedPlaces.rentalPickup?.city || "",
        destination: "Hourly Package",
        tripType: "Rental",
      };
    }

    setSearchMeta(meta);
    setIsSearching(true);
    saveFormToContext();

    try {
      const minDisplayDelay = new Promise((resolve) => setTimeout(resolve, 1400));
      const [response] = await Promise.all([
        api.post(endpoints.search, data),
        minDisplayDelay,
      ]);
      const result = response.data;
      if (result.success) {
        setSearchResult(result);
        setSearchFormData((prev) => ({
          ...prev,
          distance: result.data?.distance || 0,
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
      console.error("Search Error:", error);
      toast.error(error?.response?.data?.message || "Error performing search");
    } finally {
      setIsSearching(false);
    }
  };

  const addMulticityStop = () => {
    setMulticityStops((prev) => {
      const lastStop = prev[prev.length - 1];
      const nextDate = lastStop?.dateTime
        ? new Date(lastStop.dateTime)
        : getDefaultDateOnly();
      nextDate.setHours(0, 0, 0, 0);

      const newStop = createInitialStop(nextDate);
      if (lastStop?.dropoffCityId) {
        newStop.pickupCityId = lastStop.dropoffCityId;
        newStop.pickupCity = lastStop.dropoffCity;
        newStop.selectedPickupAddress = lastStop.selectedDropoffAddress;
      }
      return [...prev, newStop];
    });
  };

  const removeMulticityStop = (index) => {
    setMulticityStops((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMulticityStop = (index, field, value) => {
    setMulticityStops((prev) => {
      const newStops = [...prev];
      newStops[index] = { ...newStops[index], [field]: value };

      // Cascade dropoff to next stop's pickup
      if (
        (field === "dropoffCityId" ||
          field === "selectedDropoffAddress" ||
          field === "dropoffCity") &&
        index < newStops.length - 1
      ) {
        newStops[index + 1] = {
          ...newStops[index + 1],
          pickupCityId: newStops[index].dropoffCityId,
          pickupCity: newStops[index].dropoffCity,
          selectedPickupAddress: newStops[index].selectedDropoffAddress,
        };
      }
      return newStops;
    });
  };

  const getPreviousDropoffDate = (index) => {
    if (index === 0) return new Date();
    const prevDate = multicityStops[index - 1]?.dateTime;
    return prevDate ? new Date(prevDate) : new Date();
  };

  const handleTabSwitch = (index) => {
    const newServiceType = tabs[index].toLowerCase().replace(" ", "_");
    const defaultDateTime = getDefaultDateTime();
    const defaultDateTimeISO = defaultDateTime.toISOString();

    setPickupDateTime(defaultDateTime);
    setTransferDateTime(defaultDateTime);
    setOutstationPickupDateTime(defaultDateTime);
    setOutstationReturnDateTime(defaultDateTime);
    setSelectedPlaces({});
    setRentalPackage("");
    setMulticityStops([createInitialStop()]);
    setActivityDateTime(defaultDateTime);
    setSelectedCity(null);
    setSelectedTransferId("");
    setTransferDirection("home-to-station");

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
      multicityStops: [createInitialStop()],
      serviceType: newServiceType,
      dropoffLocation: null,
      pickupLocation: null,
      pickupCityId: null,
      dropoffCityId: null,
      transferDirection: "home-to-station",
      selectedCity: null,
      selectedTransfer: null,
      distance: 0,
      activityDateTime: defaultDateTimeISO,
    }));

    setActiveTabIndex(index);
  };

  const buttonText = isUpdate ? "Update" : "Search";
  const buttonIcon = isUpdate ? null : <FaSearch className="inline mr-2" />;

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

      {/* Animated Fullscreen Search Overlay */}
      <SearchLoadingModal
        isOpen={isSearching}
        searchMeta={searchMeta}
        onClose={() => setIsSearching(false)}
      />

      <div className="search-section w-full max-w-7xl mx-auto mt-6 px-4 z-30 relative">
        <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSwitch}>
          <TabList className="flex flex-wrap justify-center gap-0 md:justify-start border-gray-200 mb-0">
            {tabs.map((tab, index, arr) => (
              <Tab
                key={index}
                className={`w-1/2 md:w-auto text-center px-6 py-3 font-grotesk text-md font-medium cursor-pointer backdrop-blur-xl bg-black md:bg-[#cdcdcd33] text-[#ffffff] hover:bg-black transition-colors ${index === 0
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

          {/* ═══════════════════════════════════════════ */}
          {/* OUTSTATION TAB */}
          {/* ═══════════════════════════════════════════ */}
          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (outstationTripType === "multicity") {
                  const invalidStop = multicityStops.find(
                    (stop) =>
                      !stop.pickupCityId ||
                      !stop.dropoffCityId ||
                      !stop.dateTime,
                  );
                  if (invalidStop || multicityStops.length < 1) {
                    alert("Please select pickup, dropoff cities and travel date for all stops.");
                    return;
                  }
                  const data = {
                    pickupCityId: multicityStops[0].pickupCityId,
                    destinations: multicityStops.map((stop) => ({
                      cityId: stop.dropoffCityId,
                      nightsAtCity: stop.nightsAtCity || 0,
                    })),
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
                  const pickupCity = selectedPlaces.outstationPickup;
                  const dropoffCity = selectedPlaces.outstationDropoff;
                  if (!pickupCity?._id || !dropoffCity?._id || !outstationPickupDateTime) {
                    alert("Please select pickup city, dropoff city, and date/time.");
                    return;
                  }
                  if (
                    outstationTripType === "round-trip" &&
                    !outstationReturnDateTime
                  ) {
                    alert("Please select return date/time.");
                    return;
                  }
                  const data = {
                    pickupCityId: pickupCity._id,
                    destinations: [{ cityId: dropoffCity._id, nightsAtCity: 0 }],
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
              {/* Trip Type Selector */}
              <div className="flex flex-col w-full relative mb-4">
                <label className="text-md font-grotesk font-semibold mb-2">
                  Trip Type
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="multicity"
                      checked={outstationTripType === "multicity"}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2 accent-orange-500"
                    />
                    Multicity
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="round-trip"
                      checked={outstationTripType === "round-trip"}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2 accent-orange-500"
                    />
                    Round-trip
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="outstationTripType"
                      value="one-way"
                      checked={outstationTripType === "one-way"}
                      onChange={(e) => setOutstationTripType(e.target.value)}
                      className="mr-2 accent-orange-500"
                    />
                    One-way
                  </label>
                </div>
              </div>

              {/* ONE-WAY / ROUND-TRIP INPUTS */}
              {(outstationTripType === "one-way" ||
                outstationTripType === "round-trip") && (
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">
                        Pickup City
                      </label>
                      <CityAutocomplete
                        value={selectedPlaces.outstationPickup}
                        onSelect={(city) =>
                          setSelectedPlaces((prev) => ({
                            ...prev,
                            outstationPickup: city,
                          }))
                        }
                        placeholder="Select pickup city"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full relative">
                      <label className="text-md font-grotesk font-semibold mb-2">
                        Dropoff City
                      </label>
                      <CityAutocomplete
                        value={selectedPlaces.outstationDropoff}
                        onSelect={(city) =>
                          setSelectedPlaces((prev) => ({
                            ...prev,
                            outstationDropoff: city,
                          }))
                        }
                        placeholder="Select dropoff city"
                        required
                      />
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
                    <div className="flex gap-3 items-end pb-1">
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                      >
                        {isSearching ? (
                          <>
                            <FaSpinner className="animate-spin inline" /> Searching...
                          </>
                        ) : (
                          <>
                            {buttonIcon} {buttonText}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              {/* MULTICITY INPUTS (DATE ONLY - TIME REMOVED) */}
              {outstationTripType === "multicity" && (
                <>
                  {multicityStops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-4 mb-4 relative bg-white p-4 rounded-xl border border-gray-200"
                    >
                      {/* Pickup City */}
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">
                          Pickup City – Leg {index + 1}
                        </label>
                        <CityAutocomplete
                          value={stop.selectedPickupAddress}
                          disabled={index > 0}
                          onSelect={(city) => {
                            updateMulticityStop(
                              index,
                              "pickupCityId",
                              city?._id || null,
                            );
                            updateMulticityStop(index, "pickupCity", city);
                            updateMulticityStop(
                              index,
                              "selectedPickupAddress",
                              city ? formatCityDisplay(city) : "",
                            );
                          }}
                          placeholder={
                            index > 0
                              ? "Auto-matched from previous dropoff"
                              : "Select pickup city"
                          }
                          required
                        />
                      </div>

                      {/* Dropoff City */}
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">
                          Dropoff City – Leg {index + 1}
                        </label>
                        <CityAutocomplete
                          value={stop.selectedDropoffAddress}
                          onSelect={(city) => {
                            updateMulticityStop(
                              index,
                              "dropoffCityId",
                              city?._id || null,
                            );
                            updateMulticityStop(index, "dropoffCity", city);
                            updateMulticityStop(
                              index,
                              "selectedDropoffAddress",
                              city ? formatCityDisplay(city) : "",
                            );
                          }}
                          placeholder="Select dropoff city"
                          required
                        />
                      </div>

                      {/* Travel Date (DATE ONLY - NO TIME SELECT) */}
                      <div className="flex flex-col w-full relative">
                        <label className="text-md font-grotesk font-semibold mb-2">
                          Travel Date – Leg {index + 1}
                        </label>
                        <DatePicker
                          selected={stop.dateTime}
                          onChange={(date) => {
                            if (date) {
                              date.setHours(0, 0, 0, 0);
                            }
                            updateMulticityStop(index, "dateTime", date);
                          }}
                          dateFormat="MMMM d, yyyy"
                          customInput={
                            <CustomInput placeholder="Select travel date" />
                          }
                          minDate={getPreviousDropoffDate(index)}
                          required
                        />
                      </div>

                      {/* Remove stop button */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMulticityStop(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                          title="Remove Leg"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-4 items-center mt-2">
                    <button
                      type="button"
                      onClick={addMulticityStop}
                      className="text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition"
                    >
                      <FaPlus /> Add Leg
                    </button>
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 ml-auto transition font-medium flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                    >
                      {isSearching ? (
                        <>
                          <FaSpinner className="animate-spin inline" /> Searching...
                        </>
                      ) : (
                        <>
                          {buttonIcon} {buttonText} Multicity
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </TabPanel>

          {/* ═══════════════════════════════════════════ */}
          {/* TRANSFER TAB */}
          {/* ═══════════════════════════════════════════ */}
          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedCity || !transferDateTime) {
                  alert("Please select a city and date/time.");
                  return;
                }
                if (availableTransfers.length === 0 && !selectedTransferId) {
                  toast.error(
                    "No transfer routes available for this city. Please select another city.",
                  );
                  return;
                }
                const data = {
                  serviceType: "transfer",
                  transferId: selectedTransferId || null,
                  pickupCityId: selectedCity._id,
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
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="home-to-station"
                      checked={transferDirection === "home-to-station"}
                      onChange={(e) => setTransferDirection(e.target.value)}
                      className="mr-2 accent-orange-500"
                    />
                    Home to Station / Airport
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="direction"
                      value="station-to-home"
                      checked={transferDirection === "station-to-home"}
                      onChange={(e) => setTransferDirection(e.target.value)}
                      className="mr-2 accent-orange-500"
                    />
                    Station / Airport to Home
                  </label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-2">
                {/* City Selection */}
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">
                    Select City
                  </label>
                  <CityAutocomplete
                    value={selectedCity}
                    onSelect={(city) => setSelectedCity(city)}
                    placeholder="Select city"
                    required
                  />
                </div>

                {/* Transfer Route / Package */}
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">
                    Transfer Route
                  </label>
                  <select
                    value={selectedTransferId}
                    onChange={(e) => setSelectedTransferId(e.target.value)}
                    className="p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full capitalize"
                    disabled={!selectedCity || availableTransfers.length === 0}
                  >
                    {availableTransfers.length === 0 ? (
                      <option value="">
                        {selectedCity ? "No transfer routes available" : "Select city first"}
                      </option>
                    ) : (
                      availableTransfers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name} ({t.distanceKm} km)
                        </option>
                      ))
                    )}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none mt-4" />
                </div>

                {/* Date/Time */}
                <div className="flex flex-col w-full relative">
                  <label className="text-md font-grotesk font-semibold mb-2">
                    Pickup Date & Time
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
                <div className="flex gap-3 items-end pb-1">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                  >
                    {isSearching ? (
                      <>
                        <FaSpinner className="animate-spin inline" /> Searching...
                      </>
                    ) : (
                      <>
                        {buttonIcon} {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>

          {/* ═══════════════════════════════════════════ */}
          {/* ACTIVITY TAB */}
          {/* ═══════════════════════════════════════════ */}
          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const city = selectedPlaces.activityLocation;
                if (!city?._id || !activityDateTime) {
                  alert("Please select city and date/time.");
                  return;
                }
                const data = {
                  pickupCityId: city._id,
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
                    Activity City
                  </label>
                  <CityAutocomplete
                    value={selectedPlaces.activityLocation}
                    onSelect={(city) =>
                      setSelectedPlaces((prev) => ({
                        ...prev,
                        activityLocation: city,
                      }))
                    }
                    placeholder="Select city for activities"
                    required
                  />
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
                <div className="flex gap-3 items-end pb-1">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                  >
                    {isSearching ? (
                      <>
                        <FaSpinner className="animate-spin inline" /> Searching...
                      </>
                    ) : (
                      <>
                        {buttonIcon} {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>

          {/* ═══════════════════════════════════════════ */}
          {/* RENTAL TAB */}
          {/* ═══════════════════════════════════════════ */}
          <TabPanel>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const city = selectedPlaces.rentalPickup;
                if (!city?._id || !pickupDateTime || !rentalPackage) {
                  alert("Please select city, date/time, and rental package.");
                  return;
                }
                const data = {
                  pickupCityId: city._id,
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
                    Pickup City
                  </label>
                  <CityAutocomplete
                    value={selectedPlaces.rentalPickup}
                    onSelect={(city) =>
                      setSelectedPlaces((prev) => ({
                        ...prev,
                        rentalPickup: city,
                      }))
                    }
                    placeholder="Select city"
                    required
                  />
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
                    <p className="p-3 text-sm text-gray-500">Loading packages...</p>
                  ) : error ? (
                    <p className="p-3 text-sm text-red-500">{error}</p>
                  ) : (
                    <select
                      value={rentalPackage}
                      onChange={(e) => setRentalPackage(e.target.value)}
                      className="p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 capitalize"
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
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none mt-4" />
                </div>
                <div className="flex gap-3 items-end pb-1">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                  >
                    {isSearching ? (
                      <>
                        <FaSpinner className="animate-spin inline" /> Searching...
                      </>
                    ) : (
                      <>
                        {buttonIcon} {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default SearchSection;

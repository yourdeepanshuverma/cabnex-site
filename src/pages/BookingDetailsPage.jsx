import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  CreditCardIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Header from "../components/header";
import { loadRazorpay, createOfflineBooking } from "../utils/payment";
import { toast } from "sonner";

const iconMap = {
  CheckCircleIcon,
  ArrowPathIcon,
  CreditCardIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
};

const BookingDetailsPage = () => {
  const { user, searchFormData, isLoggedIn, searchResult } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};



  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in to proceed with booking.");
      navigate("/login", { state: { from: location.pathname, item } });
    }
  }, [isLoggedIn, navigate, location.pathname, item]);

  const isActivity = item?.type === "activity";

  const transformFeatures = (features) => {
    if (!Array.isArray(features)) return [];
    const featureMap = {
      AC: {
        text: "Air Conditioning",
        description: "Stay cool with advanced climate control system.",
      },
      Automatic: {
        text: "Automatic Transmission",
        description: "Smooth and effortless gear shifting.",
      },
      Petrol: {
        text: "Petrol Engine",
        description: "Fuel efficient engine for city and highway driving.",
      },
      "4 Seats": {
        text: "4 Seater",
        description: "Compact seating for small groups or families.",
      },
      "5 Seats": {
        text: "5 Seater",
        description: "Spacious seating for family or business travel.",
      },
      "7 Seats": {
        text: "7 Seater",
        description: "Large capacity for groups and luggage.",
      },
      Manual: {
        text: "Manual Transmission",
        description: "Traditional gear shifting for experienced drivers.",
      },
      Diesel: {
        text: "Diesel Engine",
        description: "High mileage for long distance travel.",
      },
    };
    return features.map(
      (f) =>
        featureMap[f] || {
          text: f,
          description: "Feature available for your journey.",
        }
    );
  };

  const defaultItem = {
    id: 1,
    image: "https://via.placeholder.com/300x200?text=Item+Image",
    name: "Default Item",
    features: transformFeatures(["AC", "Automatic", "Petrol", "5 Seats"]),
    inclusions: [
      { text: "24/7 Roadside Assistance", icon: "CheckCircleIcon" },
      { text: "Free Cancellation & Return", icon: "ArrowPathIcon" },
      { text: "Rent Now Pay When You Arrive", icon: "CreditCardIcon" },
      { text: "600Kms included. After that ₹15/Kms", icon: "MapPinIcon" },
      { text: "2 luggage bags", icon: "BriefcaseIcon" },
      { text: "Free waiting up to 45 minutes", icon: "ClockIcon" },
    ],
    actualPrice: 4500,
    description: "Comfortable item perfect for your needs.",
    type: "car",
    cancellationPolicy: "Non-refundable",
  };

  const selectedItem = item
    ? {
        ...item,
        features: isActivity ? [] : transformFeatures(item.features || []),
        actualPrice: item.actualPrice || 4500,
        description: item.description || "Selected item for your booking.",
        inclusions: item.inclusions || defaultItem.inclusions,
        image: item.image || defaultItem.image,
        cancellationPolicy: item.cancellationPolicy || "Non-refundable",
      }
    : defaultItem;

  const formatDate = (date) => {
    if (!date) return "Not specified";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "Not specified";
    const d = new Date(dateTime);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const distance = searchResult?.data?.distance || 0;

  const serviceType = searchFormData.serviceType || "outstation";
  let pickupLocation = { name: "Not specified", place_id: null };
  let dropoffLocation = { name: "Not specified", place_id: null };
  let pickupDateTimeForState = null;
  let dropoffDateTimeForState = null;

  if (serviceType === "rental") {
    pickupLocation =
      searchFormData.pickupLocation ||
      searchFormData.selectedPlaces?.rentalPickup ||
      pickupLocation;
    dropoffLocation =
      searchFormData.dropoffLocation ||
      searchFormData.selectedPlaces?.rentalDropoff ||
      pickupLocation;
    pickupDateTimeForState = searchFormData.pickupDateTime;
  } else if (serviceType === "city_taxi") {
    pickupLocation =
      searchFormData.pickupLocation ||
      searchFormData.selectedPlaces?.cityTaxiPickup ||
      pickupLocation;
    dropoffLocation =
      searchFormData.dropoffLocation ||
      searchFormData.selectedPlaces?.cityTaxiDropoff ||
      dropoffLocation;
    pickupDateTimeForState = searchFormData.pickupDateTime;
  } else if (serviceType === "transfer") {
    pickupLocation =
      searchFormData.pickupLocation ||
      searchFormData.selectedPlaces?.transferFrom ||
      pickupLocation;
    dropoffLocation =
      searchFormData.dropoffLocation ||
      searchFormData.selectedPlaces?.transferTo ||
      dropoffLocation;
    pickupDateTimeForState = searchFormData.transferDateTime;
  } else if (serviceType === "outstation") {
    if (
      searchFormData.outstationTripType === "multicity" &&
      searchFormData.multicityStops?.length > 0
    ) {
      const firstStop = searchFormData.multicityStops[0];
      const lastStop =
        searchFormData.multicityStops[searchFormData.multicityStops.length - 1];
      pickupLocation = {
        name: firstStop.selectedPickupAddress,
        place_id: firstStop.pickupPlaceId,
      };
      dropoffLocation = {
        name: lastStop.selectedDropoffAddress,
        place_id: lastStop.dropoffPlaceId,
      };
      pickupDateTimeForState = firstStop.dateTime;
      dropoffDateTimeForState = lastStop.dateTime;
    } else {
      pickupLocation =
        searchFormData.pickupLocation ||
        searchFormData.selectedPlaces?.outstationPickup ||
        pickupLocation;
      dropoffLocation =
        searchFormData.dropoffLocation ||
        searchFormData.selectedPlaces?.outstationDropoff ||
        dropoffLocation;
      pickupDateTimeForState = searchFormData.outstationPickupDateTime;
      dropoffDateTimeForState = searchFormData.outstationReturnDateTime;
    }
  } else if (serviceType === "activity") {
    pickupLocation =
      searchFormData.pickupLocation ||
      searchFormData.selectedPlaces?.activityLocation ||
      pickupLocation;
    dropoffLocation = pickupLocation;
    pickupDateTimeForState = searchFormData.activityDateTime;
  }

  const [travellerInfo, setTravellerInfo] = useState({
    name: user?.fullName || "Guest",
    mobile: user?.mobile || "",
    email: user?.email || "",
    exactPickupLocation: "",
    pickupLocation,
    pickupDate: formatDate(pickupDateTimeForState),
    pickupTime: formatTime(pickupDateTimeForState),
    dropoffLocation,
    dropoffDate: formatDate(dropoffDateTimeForState),
    dropoffTime: formatTime(dropoffDateTimeForState),
  });

  const [isBookingForOther, setIsBookingForOther] = useState(false);
  const [alternateName, setAlternateName] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [paymentOption, setPaymentOption] = useState("half");
  const [showFeatures, setShowFeatures] = useState(false);
  const [showInclusions, setShowInclusions] = useState(false);

  const handleExactPickupLocationChange = (e) => {
    setTravellerInfo({ ...travellerInfo, exactPickupLocation: e.target.value });
  };

  const handleTravellerInfoChange = (field, value) => {
    setTravellerInfo({ ...travellerInfo, [field]: value });
  };

  const handlePayNow = async () => {
    if (!travellerInfo.exactPickupLocation)
      return toast.error("Please enter exact pickup location.");
    if (!travellerInfo.mobile)
      return toast.error("Please enter a mobile number.");
    if (!travellerInfo.email)
      return toast.error("Please enter an email address.");
    if (
      isBookingForOther &&
      (!alternateName || !alternatePhone || !alternateEmail)
    ) {
      return toast.error("Please enter all alternate traveller details.");
    }

    const rawPayAmount =
      paymentOption === "half" ? totalAmount / 2 : totalAmount;
    const payAmount = parseFloat(rawPayAmount.toFixed(2));

    const pickupDateTimeStr = `${travellerInfo.pickupDate} ${travellerInfo.pickupTime}`;
    const pickupDateTimeISO = new Date(pickupDateTimeStr).toISOString();

    const showDropoff = dropoffLocation.name !== "Not specified";
    let bookingDetails; // Renamed from paymentParams for clarity

    if (isActivity) {
      bookingDetails = {
        amount: payAmount,
        activityId: item.data._id,
        serviceType: "activity",
        exactLocation: travellerInfo.exactPickupLocation,
        pickupDateTime: pickupDateTimeISO,
        startLocation: {
          address: travellerInfo.pickupLocation.name,
          place_id: travellerInfo.pickupLocation.place_id || null,
        },
        totalAmount: totalAmount,
        city:
          travellerInfo.pickupLocation.name.split(",")[0]?.trim() || "Unknown",
        user: {
          _id: user?._id || null,
          fullName: isBookingForOther ? alternateName : travellerInfo.name,
          email: isBookingForOther ? alternateEmail : travellerInfo.email,
          mobile: isBookingForOther ? alternatePhone : travellerInfo.mobile,
        },
        paymentMethod: paymentOption, // Add payment method
        paymentStatus: paymentOption === "offline" ? "pending" : "paid", // Set status based on option
      };
    } else {
      const oneWay =
        serviceType === "outstation" &&
        (searchFormData.outstationTripType === "round-trip" ||
          searchFormData.outstationTripType === "multicity")
          ? false
          : true;

      bookingDetails = {
        amount: payAmount,
        carCategoryName: selectedItem.name || "Default Car",
        carCategory: selectedItem.name || null,
        serviceType,
        packageType:
          serviceType === "rental"
            ? searchFormData.rentalPackage || null
            : null,
        packageId: serviceType === "rental"
            ? searchFormData.rentalPackage || null
            : null,
        exactLocation: travellerInfo.exactPickupLocation,
        pickupDateTime: pickupDateTimeISO,
        startLocation: {
          address: travellerInfo.pickupLocation.name,
          place_id: travellerInfo.pickupLocation.place_id || null,
        },
        destinations:
          serviceType === "outstation" &&
          searchFormData.outstationTripType === "multicity"
            ? searchFormData.multicityStops.map((stop) => ({
                address: stop.selectedDropoffAddress,
                place_id: stop.dropoffPlaceId || null,
              }))
            : showDropoff
            ? [
                {
                  address: travellerInfo.dropoffLocation.name,
                  place_id: travellerInfo.dropoffLocation.place_id || null,
                },
              ]
            : [],
        returnDateTime:
          serviceType === "outstation" &&
          searchFormData.outstationTripType === "round-trip"
            ? searchFormData.outstationReturnDateTime
            : serviceType === "outstation" &&
              searchFormData.outstationTripType === "multicity" &&
              searchFormData.multicityStops.length > 0
            ? searchFormData.multicityStops[
                searchFormData.multicityStops.length - 1
              ].dateTime
            : null,
        distance: searchFormData.distance || 0,
        totalAmount: totalAmount,
        city:
          travellerInfo.pickupLocation.name.split(",")[0]?.trim() || "Unknown",
        oneWay,
        ...(serviceType === "transfer" && {
          transferDirection: searchFormData.transferDirection,
        }),
        user: {
          _id: user?._id || null,
          fullName: isBookingForOther ? alternateName : travellerInfo.name,
          email: isBookingForOther ? alternateEmail : travellerInfo.email,
          mobile: isBookingForOther ? alternatePhone : travellerInfo.mobile,
        },
        paymentMethod: paymentOption, // Add payment method
        paymentStatus: paymentOption === "offline" ? "pending" : "paid", // Set status based on option
      };
    }

    try {
      if (paymentOption === "offline") {
        await createOfflineBooking(bookingDetails);
        toast.success("Booking requested! Awaiting offline payment.");
      } else {
        await loadRazorpay(bookingDetails);
        toast.success("Payment initiated successfully!");
      }
    } catch (err) {
      console.error("Payment/Booking Error:", err);
      toast.error("Process interrupted.");
    }
  };

  // ==================== FARE BREAKDOWN (API SE) ====================
  const apiCategory = item?.data?.categories?.[0];

  // Use API totalAmount, fallback to selectedItem.actualPrice
  const totalAmount = isActivity
    ? selectedItem.actualPrice
    : apiCategory?.totalAmount || selectedItem.actualPrice;

  // Direct values from apiCategory
  const baseFare = apiCategory?.baseFare || 0;
  const taxAmount = apiCategory?.tax || 0; // Using 'tax' directly as requested
  const extraKmCharges = apiCategory?.extraKmCharges || 0;
  const totalNightCharge = apiCategory?.totalNightCharge || 0;
  const hillCharge = apiCategory?.hillCharge || 0;
  const totalDriverAllowance = apiCategory?.totalDriverAllowance || 0;
  const tollCharges = apiCategory?.tollCharges || 0; // No change requested for this
  const discount = apiCategory?.discount || 0; // No change requested for this

  // ======================================================================

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      <Header />

      {/* Breadcrumb Header */}
      <div className="mt-16 sm:mt-20 mb-6">
        <h3 className="text-lg sm:text-xl font-grotesk font-semibold text-gray-700">
          {selectedItem.name} | {serviceType.replace(/_/g, " ").toUpperCase()} |{" "}
          {travellerInfo.pickupDate} - {travellerInfo.pickupTime}
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Item Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 lg:w-1/4 bg-[#F5F5F6] p-6 flex items-center justify-center">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-auto max-h-48 object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Item+Image";
                  }}
                />
              </div>
              <div className="flex-1 p-5 sm:p-6">
                <h3 className="text-2xl sm:text-3xl font-grotesk font-extrabold mb-3">
                  {selectedItem.name}
                </h3>
                {!isActivity && selectedItem.features.length > 0 && (
                  <button
                    onClick={() => setShowFeatures(!showFeatures)}
                    className="flex items-center gap-2 text-orange-500 font-grotesk text-sm font-semibold mb-3 sm:hidden"
                  >
                    Features{" "}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        showFeatures ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
                <div
                  className={`${
                    showFeatures || window.innerWidth >= 640
                      ? "block"
                      : "hidden"
                  } sm:block`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedItem.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-grotesk font-bold text-sm text-black">
                            {feature.text}
                          </p>
                          <p className="font-grotesk text-xs text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {isActivity && (
                  <p className="text-gray-600 mt-3">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-[#F5F5F6] px-5 py-3">
              <p className="text-sm text-gray-600 font-grotesk">
                {selectedItem.description}
              </p>
            </div>
          </div>

          {/* Traveller Info */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 space-y-5">
            <h4 className="text-xl sm:text-2xl font-grotesk font-extrabold">
              Traveller Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: UserIcon,
                  label: "Name",
                  value: travellerInfo.name,
                  field: "name",
                  type: "text",
                },
                {
                  icon: UserIcon,
                  label: "Phone Number",
                  value: travellerInfo.mobile,
                  field: "mobile",
                  type: "tel",
                },
                {
                  icon: EnvelopeIcon,
                  label: "Email",
                  value: travellerInfo.email,
                  field: "email",
                  type: "email",
                },
              ].map(({ icon: Icon, label, value, field, type }) => (
                <div key={field} className="flex items-start gap-3">
                  <Icon className="h-6 w-6 text-[#5143D9] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-grotesk font-semibold text-sm text-black">
                      {label}
                    </p>
                    <input
                      type={type}
                      value={value}
                      disabled
                      onChange={(e) =>
                        handleTravellerInfoChange(field, e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 bg-gray-300 rounded-md text-sm font-grotesk focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPinIcon className="h-6 w-6 text-[#5143D9] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-grotesk font-semibold text-sm text-black">
                    Exact Pickup Location
                  </p>
                  <input
                    type="text"
                    value={travellerInfo.exactPickupLocation}
                    onChange={handleExactPickupLocationChange}
                    placeholder="Hotel name, building, landmark..."
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm font-grotesk focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {[
                {
                  icon: MapPinIcon,
                  label: "Pickup Location",
                  value: travellerInfo.pickupLocation?.name,
                },
                travellerInfo.dropoffLocation.name !== "Not specified" && {
                  icon: MapPinIcon,
                  label: "Drop-off Location",
                  value: travellerInfo.dropoffLocation.name,
                },
                {
                  icon: CalendarIcon,
                  label: "Pickup Date",
                  value: travellerInfo.pickupDate,
                },
                {
                  icon: ClockIcon,
                  label: "Pickup Time",
                  value: travellerInfo.pickupTime,
                },
                travellerInfo.dropoffDate !== "Not specified" && {
                  icon: CalendarIcon,
                  label: "Final Drop-off Date",
                  value: travellerInfo.dropoffDate,
                },
                travellerInfo.dropoffTime !== "Not specified" && {
                  icon: ClockIcon,
                  label: "Final Drop-off Time",
                  value: travellerInfo.dropoffTime,
                },
              ]
                .filter(Boolean)
                .map(({ icon: Icon, label, value }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-[#5143D9] flex-shrink-0" />
                    <div>
                      <p className="font-grotesk font-semibold text-sm text-black">
                        {label}
                      </p>
                      <p className="font-grotesk text-xs text-gray-600">
                        {value || "Not specified"}
                      </p>
                    </div>
                  </div>
                ))}

              {searchFormData.outstationTripType === "multicity" &&
                searchFormData.multicityStops.length > 0 && (
                  <div className="sm:col-span-2">
                    <h5 className="font-grotesk font-semibold text-md text-black mb-2">
                      Multi-City Itinerary
                    </h5>
                    <div className="space-y-4">
                      {searchFormData.multicityStops.map((stop, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-md bg-gray-50"
                        >
                          <p className="font-grotesk font-bold text-sm">
                            Leg {index + 1}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <MapPinIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0" />
                            <div>
                              <p className="font-grotesk font-semibold text-xs text-black">
                                From
                              </p>
                              <p className="font-grotesk text-xs text-gray-600">
                                {stop.selectedPickupAddress}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <MapPinIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0" />
                            <div>
                              <p className="font-grotesk font-semibold text-xs text-black">
                                To
                              </p>
                              <p className="font-grotesk text-xs text-gray-600">
                                {stop.selectedDropoffAddress}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <CalendarIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0" />
                            <div>
                              <p className="font-grotesk font-semibold text-xs text-black">
                                Departure
                              </p>
                              <p className="font-grotesk text-xs text-gray-600">
                                {formatDate(stop.dateTime)} -{" "}
                                {formatTime(stop.dateTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {isActivity && selectedItem.cancellationPolicy && (
                <div className="flex items-center gap-3 sm:col-span-2">
                  <ArrowPathIcon className="h-6 w-6 text-[#5143D9]" />
                  <div>
                    <p className="font-grotesk font-semibold text-sm text-black">
                      Cancellation Policy
                    </p>
                    <p className="font-grotesk text-xs text-gray-600">
                      {selectedItem.cancellationPolicy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
            <button
              onClick={() => setShowInclusions(!showInclusions)}
              className="flex items-center justify-between w-full text-left sm:hidden"
            >
              <h4 className="text-xl font-grotesk font-extrabold">
                Inclusions
              </h4>
              <ChevronDownIcon
                className={`h-6 w-6 transition-transform ${
                  showInclusions ? "rotate-180" : ""
                }`}
              />
            </button>
            <h4 className="text-xl sm:text-2xl font-grotesk font-extrabold mb-4 hidden sm:block">
              Inclusions
            </h4>
            <div
              className={`${
                showInclusions || window.innerWidth >= 640 ? "block" : "hidden"
              } sm:block`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedItem.inclusions.map((inc, i) => {
                  const Icon = iconMap[inc.icon];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {Icon ? (
                        <Icon className="h-6 w-6 text-[#5143D9]" />
                      ) : (
                        <div className="h-6 w-6 bg-gray-300 rounded-full" />
                      )}
                      <p className="font-grotesk text-sm font-semibold text-black">
                        {inc.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* ==================== PAYMENT SIDEBAR ==================== */}
        <aside className="lg:w-1/3 w-full">
          <div className="sticky top-4 space-y-4">
            {/* ==================== FARE BREAKDOWN CARD ==================== */}
            {!isActivity && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h4 className="font-grotesk font-extrabold text-lg mb-3 text-gray-800">
                  Fare Breakdown
                </h4>

                <div className="space-y-2 my-2 text-sm font-grotesk">
                  {/* Total Distance - Always shown for non-activities */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Distance</span>
                    <span className="font-semibold">
                      {distance.toLocaleString("en-IN")} km
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm font-grotesk">
                  {/* Base Fare - Always shown for non-activities */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">
                      ₹
                      {apiCategory?.baseFare?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}
                    </span>
                  </div>

                  {/* Extra KM Charges - For Transfer and Outstation */}
                  {(serviceType === "transfer" ||
                    serviceType === "outstation") &&
                    apiCategory?.extraKmCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Extra KM Charges (
                          {distance -
                            apiCategory?.freeKmPerDay * apiCategory?.totalDays}
                          km)
                        </span>
                        <span className="font-semibold">
                          ₹
                          {apiCategory.extraKmCharges.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                  {/* Total Driver Allowance - For Outstation */}
                  {serviceType === "outstation" &&
                    apiCategory?.totalDriverAllowance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Driver Allowance{" "}
                          {`(${apiCategory?.totalDays} day${
                            apiCategory?.totalDays > 1 ? "s" : ""
                          })`}
                        </span>
                        <span className="font-semibold">
                          ₹
                          {apiCategory.totalDriverAllowance.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )}

                  {/* Total Night Charge - For Outstation */}
                  {serviceType === "outstation" &&
                    apiCategory?.totalNightCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Night Charge{" "}
                          {`(${apiCategory?.totalNights} night${
                            apiCategory?.totalNights > 1 ? "s" : ""
                          })`}
                        </span>
                        <span className="font-semibold">
                          ₹
                          {apiCategory.totalNightCharge.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )}

                  {/* Hill Charge - For Outstation */}
                  {serviceType === "outstation" &&
                    apiCategory?.hillCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hill Charge</span>
                        <span className="font-semibold">
                          ₹
                          {apiCategory.hillCharge.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                  {/* Tax - For all non-activities */}
                  {apiCategory?.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tax ({apiCategory?.taxSlab}%)
                      </span>
                      <span className="font-semibold">
                        ₹
                        {apiCategory.tax.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Total Amount - Always shown for non-activities */}
                  <div className="border-t pt-2 mt-3 flex justify-between font-bold text-base text-black">
                    <span>Total Amount</span>
                    <span>
                      ₹
                      {totalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== PAYMENT OPTIONS CARD ==================== */}
            <div className="bg-[#F5F5F6] rounded-2xl p-5 border border-gray-200">
              <p className="text-orange-500 font-grotesk text-sm sm:text-base mb-3">
                Hurry! Limited {isActivity ? "spots" : "cars"} left
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="font-grotesk font-semibold text-lg sm:text-xl text-black">
                  Total
                </span>
                <span className="font-grotesk font-bold text-xl sm:text-2xl text-black">
                  ₹
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "half",
                    label: `Pay ₹${(totalAmount / 2).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })} now (Half Payment)`,
                  },
                  {
                    value: "full",
                    label: `Pay ₹${totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })} now (Full Payment)`,
                  },
                  {
                    value: "offline",
                    label: "Book Now Pay Later",
                  },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentOption === value}
                      onChange={() => setPaymentOption(value)}
                      className="accent-orange-500 mt-0.5"
                    />
                    <span className="font-grotesk text-sm text-gray-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handlePayNow}
                className="w-full mt-5 bg-orange-500 hover:bg-black text-white font-grotesk font-bold py-3 rounded-full text-base transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default BookingDetailsPage;

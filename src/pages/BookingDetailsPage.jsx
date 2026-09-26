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
  FunnelIcon,
  BanknotesIcon,
  TicketIcon,
  XMarkIcon,
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
  FunnelIcon,
  BanknotesIcon,
  TicketIcon,
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
      },
      Automatic: {
        text: "Automatic Transmission",
      },
      Comfort: {
        text: " Comfortable for Outstation Travel",
      },
      Petrol: {
        text: "Petrol Engine",
      },
      Manual: {
        text: "Manual Transmission",
      },
      Diesel: {
        text: "Diesel Engine",
      },
    };
    return features.map(
      (f) =>
        featureMap[f] || {
          text: f,
          description: "Feature available for your journey.",
        },
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
    type: "car",
    cancellationPolicy: "Non-refundable",
  };

  const selectedItem = item
    ? {
        ...item,
        features: isActivity ? [] : transformFeatures(item.features || []),
        actualPrice: item.actualPrice || 4500,
        description: item.description || "Selected car for your booking.",
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
  const distanceBreakdown = searchResult?.data?.distanceBreakdown || null;

  const serviceType = searchFormData.serviceType || "outstation";
  const normalizeLocation = (loc) => {
    if (!loc) return { name: "Not specified", place_id: null, cityId: null };
    if (typeof loc === "string")
      return { name: loc, place_id: null, cityId: null };
    const name = loc.city
      ? loc.city.replace(/-/g, " ")
      : loc.name || "Not specified";
    return {
      name,
      place_id: loc._id || loc.place_id || null,
      cityId: loc._id || null,
    };
  };

  let pickupLocation = { name: "Not specified", place_id: null, cityId: null };
  let dropoffLocation = { name: "Not specified", place_id: null, cityId: null };
  let pickupDateTimeForState = null;
  let dropoffDateTimeForState = null;

  if (serviceType === "rental") {
    pickupLocation = normalizeLocation(
      searchFormData.selectedPlaces?.rentalPickup ||
        searchFormData.pickupLocation,
    );
    dropoffLocation = pickupLocation;
    pickupDateTimeForState = searchFormData.pickupDateTime;
  } else if (serviceType === "transfer") {
    pickupLocation = normalizeLocation(
      searchFormData.selectedCity ||
        searchFormData.selectedPlaces?.transferFrom ||
        searchFormData.pickupLocation,
    );
    dropoffLocation = normalizeLocation(
      searchFormData.selectedPlaces?.transferTo ||
        searchFormData.dropoffLocation,
    );
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
        name: firstStop.selectedPickupAddress || "Not specified",
        place_id: firstStop.pickupCityId || firstStop.pickupPlaceId || null,
        cityId: firstStop.pickupCityId || null,
      };
      dropoffLocation = {
        name: lastStop.selectedDropoffAddress || "Not specified",
        place_id: lastStop.dropoffCityId || lastStop.dropoffPlaceId || null,
        cityId: lastStop.dropoffCityId || null,
      };
      pickupDateTimeForState =
        firstStop?.dateTime ||
        searchFormData.multicityPickupDate ||
        searchFormData.pickupDateTime ||
        searchFormData.outstationPickupDateTime;
      dropoffDateTimeForState =
        lastStop?.dateTime || searchFormData.outstationReturnDateTime;
    } else {
      pickupLocation = normalizeLocation(
        searchFormData.selectedPlaces?.outstationPickup ||
          searchFormData.pickupLocation,
      );
      dropoffLocation = normalizeLocation(
        searchFormData.selectedPlaces?.outstationDropoff ||
          searchFormData.dropoffLocation,
      );
      pickupDateTimeForState = searchFormData.outstationPickupDateTime;
      dropoffDateTimeForState = searchFormData.outstationReturnDateTime;
    }
  } else if (serviceType === "activity") {
    pickupLocation = normalizeLocation(
      searchFormData.selectedPlaces?.activityLocation ||
        searchFormData.pickupLocation,
    );
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
  const [showTaxesBreakdown, setShowTaxesBreakdown] = useState(false);

  // State for selected add-on activities
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);
  const [selectedActivityForDetails, setSelectedActivityForDetails] =
    useState(null);

  // Extract cityActivities from searchResult
  const cityActivities = searchResult?.data?.cityActivities || [];

  // Calculate activitiesTotal whenever selectedActivities changes
  useEffect(() => {
    const total = selectedActivities.reduce(
      (sum, activity) => sum + activity.price,
      0,
    );
    setActivitiesTotal(total);
  }, [selectedActivities]);

  // Handler for selecting/deselecting activities
  const handleActivitySelection = (activity) => {
    setSelectedActivities((prevSelected) => {
      if (prevSelected.some((selected) => selected._id === activity._id)) {
        return prevSelected.filter((selected) => selected._id !== activity._id);
      } else {
        return [...prevSelected, activity];
      }
    });
  };

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
      paymentOption === "half" ? finalTotalAmount / 2 : finalTotalAmount;
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
        totalAmount: finalTotalAmount,
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
        packageId:
          serviceType === "rental"
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
                place_id: stop.dropoffCityId || stop.dropoffPlaceId || null,
                cityId: stop.dropoffCityId || null,
                dateTime: stop.dateTime,
              }))
            : showDropoff
              ? [
                  {
                    address: travellerInfo.dropoffLocation.name,
                    place_id: travellerInfo.dropoffLocation.place_id || null,
                    cityId: travellerInfo.dropoffLocation.cityId || null,
                  },
                ]
              : [],
        returnDateTime:
          serviceType === "outstation" &&
          searchFormData.outstationTripType === "round-trip"
            ? searchFormData.outstationReturnDateTime
            : serviceType === "outstation" &&
                searchFormData.outstationTripType === "multicity"
              ? searchFormData.outstationReturnDateTime ||
                (searchFormData.multicityStops?.length > 0
                  ? searchFormData.multicityStops[
                      searchFormData.multicityStops.length - 1
                    ]?.dateTime
                  : null)
              : null,
        distance: searchFormData.distance || 0,
        totalAmount: finalTotalAmount,
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
        ...(selectedActivities.length > 0 && {
          addons: selectedActivities.map((a) => ({
            activityId: a._id,
            title: a.title,
            price: a.price,
          })),
          addonsTotal: activitiesTotal,
        }),
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
  const apiCategory =
    item?.data?.categories?.[0] ||
    item?.categoryData ||
    searchResult?.data?.categories?.find(
      (cat) =>
        (cat._id && cat._id === selectedItem?.id) ||
        (cat.type?._id && cat.type?._id === selectedItem?.id) ||
        (cat.rateId && cat.rateId === selectedItem?.id) ||
        (cat.type?.category &&
          selectedItem?.name &&
          cat.type.category.toLowerCase().replace(/[-_]/g, " ") ===
            selectedItem.name.toLowerCase().replace(/[-_]/g, " ")),
    ) ||
    searchResult?.data?.categories?.[0];

  // Use API totalAmount, fallback to selectedItem.actualPrice
  const carOrActivityBaseTotal = isActivity
    ? selectedItem.actualPrice
    : apiCategory?.totalAmount || selectedItem.actualPrice;

  // Calculate finalTotalAmount including activities
  const finalTotalAmount = isActivity
    ? carOrActivityBaseTotal
    : carOrActivityBaseTotal + activitiesTotal;

  // Fare component calculations
  const totalDays =
    apiCategory?.totalDays ??
    apiCategory?.serviceDays ??
    1;

  const totalNights =
    apiCategory?.totalNights ??
    Math.max(0, totalDays - 1);

  const baseFare =
    apiCategory?.baseFare ??
    apiCategory?.baseVehicleCost ??
    selectedItem?.baseFare ??
    0;

  const extraKmCharges =
    apiCategory?.extraKmCharges ??
    apiCategory?.kmCost ??
    0;

  const freeKm =
    apiCategory?.freeKmPerDay ??
    apiCategory?.includedKmPerDay ??
    0;

  const extraKm =
    apiCategory?.extraKm ??
    (freeKm > 0 && totalDays > 0
      ? Math.max(0, distance - freeKm * totalDays)
      : 0);

  const driverAllowance =
    apiCategory?.totalDriverAllowance ??
    apiCategory?.driverBata ??
    0;

  const nightCharge =
    apiCategory?.totalNightCharge ??
    apiCategory?.nightHalt ??
    0;

  const hillCharge =
    apiCategory?.totalHillCharge ??
    apiCategory?.hillCharge ??
    0;

  const permitCharge =
    apiCategory?.totalPermitCharge ??
    apiCategory?.permit ??
    0;

  const surchargeAmount =
    apiCategory?.surchargeAmount ??
    0;

  const surchargeName =
    apiCategory?.surchargeName ||
    searchResult?.data?.surchargeInfo?.matchedPeriod ||
    "Peak Season Surcharge";

  const surchargePercent = Math.round(
    (apiCategory?.surchargePercent ||
      searchResult?.data?.surchargeInfo?.percent ||
      0) * 100,
  );

  const taxAmount = apiCategory?.taxAmount ?? apiCategory?.tax ?? 0;
  const taxSlab = apiCategory?.taxSlab ?? 0;

  const knownCostSum =
    baseFare +
    extraKmCharges +
    driverAllowance +
    nightCharge +
    hillCharge +
    permitCharge +
    surchargeAmount;

  const totalTaxesAndService = Math.max(
    0,
    carOrActivityBaseTotal - knownCostSum,
  );

  const platformFee = apiCategory?.cabnexMargin || 0;
  const gstAmount = taxAmount || 0;

  const feeBreakdown = [];
  if (platformFee > 0) {
    feeBreakdown.push({
      label: "Platform & Service Fee",
      amount: platformFee,
    });
  }
  if (gstAmount > 0) {
    feeBreakdown.push({
      label: `GST ${taxSlab ? `(${taxSlab}%)` : ""}`,
      amount: gstAmount,
    });
  }

  const itemizedSum = feeBreakdown.reduce((s, f) => s + f.amount, 0);
  const remainingFee = totalTaxesAndService - itemizedSum;
  if (remainingFee > 0) {
    feeBreakdown.push({
      label: "Facilitation Charges",
      amount: remainingFee,
    });
  } else if (feeBreakdown.length === 0 && totalTaxesAndService > 0) {
    feeBreakdown.push({
      label: "Taxes & Service Fee",
      amount: totalTaxesAndService,
    });
  }

  const displayBaseFare =
    baseFare > 0
      ? baseFare
      : knownCostSum === 0
        ? carOrActivityBaseTotal
        : 0;

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

              {/* Checkbox for Booking for someone else */}
              <div className="flex items-center gap-3 sm:col-span-2 mt-2">
                <input
                  type="checkbox"
                  id="isBookingForOther"
                  checked={isBookingForOther}
                  onChange={(e) => setIsBookingForOther(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-[#5143D9] focus:ring-[#5143D9] accent-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="isBookingForOther"
                  className="font-grotesk font-semibold text-sm text-gray-700 cursor-pointer select-none"
                >
                  Booking for someone else? (Enter traveller details below)
                </label>
              </div>

              {isBookingForOther && (
                <div className="sm:col-span-2 border-t border-gray-200 pt-4 mt-2 space-y-4">
                  <h5 className="font-grotesk font-bold text-base text-[#5143D9]">
                    Passenger Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-6 w-6 text-[#5143D9] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <label className="font-grotesk font-semibold text-sm text-black">
                          Passenger Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={alternateName}
                          onChange={(e) => setAlternateName(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm font-grotesk focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          placeholder="Enter passenger's full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-6 w-6 text-[#5143D9] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <label className="font-grotesk font-semibold text-sm text-black">
                          Passenger Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={alternatePhone}
                          onChange={(e) => setAlternatePhone(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm font-grotesk focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          placeholder="Enter passenger's phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <EnvelopeIcon className="h-6 w-6 text-[#5143D9] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <label className="font-grotesk font-semibold text-sm text-black">
                          Passenger Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={alternateEmail}
                          onChange={(e) => setAlternateEmail(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm font-grotesk focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          placeholder="Enter passenger's email address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                            <ClockIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0" />
                            <div>
                              <p className="font-grotesk font-semibold text-xs text-black">
                                Stay
                              </p>
                              <p className="font-grotesk text-xs text-gray-600">
                                {stop.nightsAtCity || 0}{" "}
                                {(stop.nightsAtCity || 0) === 1 ? "Night" : "Nights"}
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
                  {/* Total Distance */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Distance</span>
                    <span className="font-semibold">
                      {distance.toLocaleString("en-IN")} km
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm font-grotesk">
                  {/* Base Fare */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Base Fare
                      {totalDays > 1 ? ` (${totalDays} days)` : ""}
                    </span>
                    <span className="font-semibold">
                      ₹
                      {displayBaseFare.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Extra KM Charges */}
                  {extraKmCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Extra KM Charges
                        {extraKm > 0 ? ` (${extraKm.toLocaleString("en-IN")} km)` : ""}
                      </span>
                      <span className="font-semibold">
                        ₹
                        {extraKmCharges.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Driver Allowance */}
                  {driverAllowance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Driver Allowance ({totalDays} day{totalDays > 1 ? "s" : ""})
                      </span>
                      <span className="font-semibold">
                        ₹
                        {driverAllowance.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Night Charge */}
                  {nightCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Night Charge ({totalNights} night{totalNights > 1 ? "s" : ""})
                      </span>
                      <span className="font-semibold">
                        ₹
                        {nightCharge.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Hill Charge */}
                  {hillCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hill Charge</span>
                      <span className="font-semibold">
                        ₹
                        {hillCharge.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* State Permit Charges */}
                  {permitCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">State Permit Charges</span>
                      <span className="font-semibold">
                        ₹
                        {permitCharge.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Surge Charge */}
                  {surchargeAmount > 0 && (
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-gray-600">
                          Surge Charge
                          {surchargePercent > 0 ? ` (+${surchargePercent}%)` : ""}
                        </span>
                        {surchargeName &&
                          surchargeName !== "NORMAL / NO SURCHARGE" && (
                            <p className="text-xs text-gray-500 font-normal">
                              {surchargeName}
                            </p>
                          )}
                      </div>
                      <span className="font-semibold">
                        ₹
                        {surchargeAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Taxes & Service Fee - Togglable with itemized breakdown */}
                  {totalTaxesAndService > 0 && (
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => setShowTaxesBreakdown(!showTaxesBreakdown)}
                        className="w-full flex justify-between items-center text-left py-0.5 group cursor-pointer focus:outline-none"
                      >
                        <span className="text-gray-600 flex items-center gap-1.5 group-hover:text-black transition-colors">
                          <span>Taxes & Service Fee</span>
                          <ChevronDownIcon
                            className={`h-4 w-4 text-gray-400 group-hover:text-black transition-transform duration-200 ${
                              showTaxesBreakdown ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹
                          {totalTaxesAndService.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </button>

                      {showTaxesBreakdown && (
                        <div className="mt-1.5 ml-2 pl-3 border-l-2 border-orange-300 space-y-1 py-1 text-xs text-gray-500 animate-in fade-in duration-150">
                          {feeBreakdown.map((fee, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span>↳ {fee.label}</span>
                              <span className="font-medium text-gray-700">
                                ₹
                                {fee.amount.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add-on Total - Only show if activities are selected */}
                  {activitiesTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-on Total</span>
                      <span className="font-semibold">
                        ₹
                        {activitiesTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="border-t pt-2 mt-3 flex justify-between font-bold text-base text-black">
                    <span>Total Amount</span>
                    <span>
                      ₹
                      {finalTotalAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-orange-500 font-grotesk text-sm sm:text-base mb-3 text-center">
              Hurry! Limited {isActivity ? "spots" : "cars"} left
            </p>

            {/* Add-on Activities */}
            {!isActivity && cityActivities && cityActivities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 space-y-5">
                <h4 className="text-xl sm:text-2xl font-grotesk font-extrabold">
                  Add-on Activities
                </h4>
                <div className="space-y-4">
                  {cityActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedActivities.some(
                            (selected) => selected._id === activity._id,
                          )}
                          onChange={() => handleActivitySelection(activity)}
                          className="accent-orange-500 h-5 w-5"
                        />
                        <p className="font-grotesk font-semibold text-base text-black line-clamp-1">
                          {activity.title}
                        </p>
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="font-grotesk font-bold text-base text-orange-500">
                          ₹
                          {activity.price.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedActivityForDetails(activity)
                          }
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== PAYMENT OPTIONS CARD ==================== */}
            <div className="bg-[#F5F5F6] rounded-2xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-grotesk font-semibold text-lg sm:text-xl text-black">
                  Total
                </span>
                <span className="font-grotesk font-bold text-xl sm:text-2xl text-black">
                  ₹
                  {finalTotalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "half",
                    label: `Pay ₹${(finalTotalAmount / 2).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                      },
                    )} now (Half Payment)`,
                  },
                  {
                    value: "full",
                    label: `Pay ₹${finalTotalAmount.toLocaleString("en-IN", {
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

      {/* Activity Details Modal */}
      {selectedActivityForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-xl sm:text-2xl font-grotesk font-extrabold">
                {selectedActivityForDetails.title}
              </h4>
              <button onClick={() => setSelectedActivityForDetails(null)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-600 mb-4">
                {selectedActivityForDetails.description ||
                  "No description available."}
              </p>
              <span className="font-grotesk font-bold text-lg text-orange-500">
                Price: ₹
                {selectedActivityForDetails.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="p-5 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => {
                  handleActivitySelection(selectedActivityForDetails);
                  setSelectedActivityForDetails(null);
                }}
                className="bg-orange-500 hover:bg-black text-white font-grotesk font-bold py-2 px-4 rounded-full text-base transition-colors"
              >
                {selectedActivities.some(
                  (a) => a._id === selectedActivityForDetails._id,
                )
                  ? "Remove from Booking"
                  : "Add to Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingDetailsPage;

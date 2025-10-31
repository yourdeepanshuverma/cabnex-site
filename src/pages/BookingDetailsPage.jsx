import React, { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import Header from '../components/header';
import { loadRazorpay } from '../utils/payment';
import { toast } from 'sonner';

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
  const { user, searchFormData, isLoggedIn } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to proceed with booking.');
      navigate('/login', { state: { from: location.pathname, item } });
    }
  }, [isLoggedIn, navigate, location.pathname, item]);

  const isActivity = item?.type === 'activity';

  // Transform features from strings to objects with descriptions (for cars)
  const transformFeatures = (features) => {
    if (!Array.isArray(features)) return [];
    
    const featureMap = {
      'AC': { text: 'Air Conditioning', description: 'Stay cool with advanced climate control system.' },
      'Automatic': { text: 'Automatic Transmission', description: 'Smooth and effortless gear shifting.' },
      'Petrol': { text: 'Petrol Engine', description: 'Fuel efficient engine for city and highway driving.' },
      '4 Seats': { text: '4 Seater', description: 'Compact seating for small groups or families.' },
      '5 Seats': { text: '5 Seater', description: 'Spacious seating for family or business travel.' },
      '7 Seats': { text: '7 Seater', description: 'Large capacity for groups and luggage.' },
      'Manual': { text: 'Manual Transmission', description: 'Traditional gear shifting for experienced drivers.' },
      'Diesel': { text: 'Diesel Engine', description: 'High mileage for long distance travel.' },
    };

    return features.map(feature => {
      const matchedFeature = featureMap[feature] || { 
        text: feature, 
        description: 'Feature available for your journey.' 
      };
      return matchedFeature;
    });
  };

  const defaultItem = {
    id: 1,
    image: 'https://via.placeholder.com/300x200?text=Item+Image',
    name: 'Default Item',
    features: transformFeatures(['AC', 'Automatic', 'Petrol', '5 Seats']),
    inclusions: [
      { text: '24/7 Roadside Assistance', icon: 'CheckCircleIcon' },
      { text: 'Free Cancellation & Return', icon: 'ArrowPathIcon' },
      { text: 'Rent Now Pay When You Arrive', icon: 'CreditCardIcon' },
      { text: '600Kms included. After that ₹15/Kms', icon: 'MapPinIcon' },
      { text: '2 luggage bags', icon: 'BriefcaseIcon' },
      { text: 'Free waiting up to 45 minutes', icon: 'ClockIcon' },
    ],
    actualPrice: 4500,
    description: 'Comfortable item perfect for your needs.',
    type: 'car',
    cancellationPolicy: 'Non-refundable',
  };

  // Transform the incoming item features if they exist
  const selectedItem = item ? {
    ...item,
    features: isActivity ? [] : transformFeatures(item.features || []),
    actualPrice: item.actualPrice || 4500,
    description: item.description || 'Selected item for your booking.',
    inclusions: item.inclusions || defaultItem.inclusions,
    image: item.image || defaultItem.image,
    cancellationPolicy: item.cancellationPolicy || 'Non-refundable',
  } : defaultItem;

  // Debug logs
  console.log('User Data:', user);
  console.log('Transformed Features:', selectedItem.features);
  console.log('Search Form Data:', searchFormData);
  console.log('Selected Item Price Debug:', selectedItem.actualPrice);

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return 'Not specified';
    const d = new Date(dateTime);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Determine pickup and dropoff based on serviceType
  const serviceType = searchFormData.serviceType || 'outstation';
  let pickupLocation = { name: 'Not specified', place_id: null };
  let dropoffLocation = { name: 'Not specified', place_id: null };

  if (serviceType === 'rental') {
    pickupLocation = searchFormData.pickupLocation || searchFormData.selectedPlaces?.rentalPickup || pickupLocation;
    dropoffLocation = searchFormData.dropoffLocation || searchFormData.selectedPlaces?.rentalDropoff || pickupLocation;
  } else if (serviceType === 'city_taxi') {
    pickupLocation = searchFormData.pickupLocation || searchFormData.selectedPlaces?.cityTaxiPickup || pickupLocation;
    dropoffLocation = searchFormData.dropoffLocation || searchFormData.selectedPlaces?.cityTaxiDropoff || dropoffLocation;
  } else if (serviceType === 'transfer') {
    pickupLocation = searchFormData.pickupLocation || searchFormData.selectedPlaces?.transferFrom || pickupLocation;
    dropoffLocation = searchFormData.dropoffLocation || searchFormData.selectedPlaces?.transferTo || dropoffLocation;
  } else if (serviceType === 'outstation') {
    pickupLocation = searchFormData.pickupLocation || searchFormData.selectedPlaces?.outstationPickup || pickupLocation;
    dropoffLocation = searchFormData.dropoffLocation || searchFormData.selectedPlaces?.outstationDropoff || dropoffLocation;
  } else if (serviceType === 'activity') {
    pickupLocation = searchFormData.pickupLocation || searchFormData.selectedPlaces?.activityLocation || pickupLocation;
    dropoffLocation = pickupLocation;
  }

  const [travellerInfo, setTravellerInfo] = useState({
    name: user?.fullName || 'Guest',
    mobile: user?.mobile || '',
    email: user?.email || '',
    exactPickupLocation: '',
    pickupLocation,
    pickupDate: formatDate(
      searchFormData.pickupDate ||
        searchFormData.outstationPickupDateTime ||
        searchFormData.transferDateTime ||
        searchFormData.pickupDateTime ||
        searchFormData.activityDateTime
    ),
    pickupTime: formatTime(
      searchFormData.pickupDateTime ||
        searchFormData.outstationPickupDateTime ||
        searchFormData.transferDateTime ||
        searchFormData.activityDateTime
    ),
    dropoffLocation,
  });

  const [isBookingForOther, setIsBookingForOther] = useState(false);
  const [alternateName, setAlternateName] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [paymentOption, setPaymentOption] = useState('half');

  const handleExactPickupLocationChange = (e) => {
    setTravellerInfo({ ...travellerInfo, exactPickupLocation: e.target.value });
  };

  const handleTravellerInfoChange = (field, value) => {
    setTravellerInfo({ ...travellerInfo, [field]: value });
  };

const handlePayNow = async () => {
  // Validation
  if (!travellerInfo.exactPickupLocation) {
    toast.error('Please enter exact pickup location.');
    return;
  }
  if (!travellerInfo.mobile) {
    toast.error('Please enter a mobile number.');
    return;
  }
  if (!travellerInfo.email) {
    toast.error('Please enter an email address.');
    return;
  }
  if (isBookingForOther && (!alternateName || !alternatePhone || !alternateEmail)) {
    toast.error('Please enter all alternate traveller details.');
    return;
  }

  // Amount Calculation
  const rawPayAmount = paymentOption === 'half' ? selectedItem.actualPrice / 2 : selectedItem.actualPrice;
  const payAmount = parseFloat(rawPayAmount.toFixed(2));
  console.log(`Payment Amount Calculation: Option=${paymentOption}, Raw=${rawPayAmount}, Fixed=${payAmount}`);

  // Pickup DateTime ISO format
  const pickupDateTimeStr = `${travellerInfo.pickupDate} ${travellerInfo.pickupTime}`;
  const pickupDateObj = new Date(pickupDateTimeStr);
  const pickupDateTimeISO = pickupDateObj.toISOString();

  // Helper to check if dropoff should be shown
  const showDropoff = dropoffLocation.name !== 'Not specified';

  // Determine oneWay based on serviceType and outstationTripType
  const oneWay = serviceType === 'outstation' && 
    (searchFormData.outstationTripType === 'round-trip' || searchFormData.outstationTripType === 'multicity')
    ? false
    : true;

  // Payment Params
  const paymentParams = {
    amount: payAmount,
    carCategoryName: isActivity ? selectedItem.name : selectedItem.name || 'Default Car',
    serviceType,
    packageType: serviceType === 'rental' ? searchFormData.rentalPackage || null : null,
    packageId: null,
    exactLocation: travellerInfo.exactPickupLocation,
    pickupDateTime: pickupDateTimeISO,
    startLocation: {
      address: travellerInfo.pickupLocation.name,
      place_id: travellerInfo.pickupLocation.place_id || null,
    },
    destinations: showDropoff ? [{
      address: travellerInfo.dropoffLocation.name,
      place_id: travellerInfo.dropoffLocation.place_id || null,
    }] : [],
    returnDateTime: serviceType === 'outstation' && searchFormData.outstationTripType === 'round-trip'
      ? searchFormData.outstationReturnDateTime
      : serviceType === 'outstation' && searchFormData.outstationTripType === 'multicity' && searchFormData.multicityStops.length > 0
      ? searchFormData.multicityStops[searchFormData.multicityStops.length - 1].dateTime
      : null,
    distance: searchFormData.distance || 0,
    totalAmount: selectedItem.actualPrice,
    city: travellerInfo.pickupLocation.name.split(',')[0]?.trim() || 'Unknown',
    oneWay, // Added oneWay field
    user: {
      _id: user?._id || null,
      fullName: isBookingForOther ? alternateName : travellerInfo.name,
      email: isBookingForOther ? alternateEmail : travellerInfo.email,
      mobile: isBookingForOther ? alternatePhone : travellerInfo.mobile,
    },
  };

  console.log('Payment Params:', paymentParams);

  try {
    await loadRazorpay(paymentParams);
    toast.success('Payment initiated successfully!');
  } catch (err) {
    console.error('Payment Error:', err);
    toast.error('Payment process interrupted.');
  }
};

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="text-black">
        <Header />
      </div>

      <div className="listing-head mb-8 mt-24">
        <h3 className="text-xl font-grotesk font-semibold text-gray-700">
          {selectedItem.name} | {serviceType.replace(/_/g, ' ').toUpperCase()} | {travellerInfo.pickupDate} - {travellerInfo.pickupTime}
        </h3>
      </div>

      <div className="flex gap-6">
        <main className="w-2/3 space-y-6">
          {/* Item Details Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition">
            <div className="flex gap-6 mb-4">
              <div className="w-1/4 bg-[#F5F5F6] rounded-2xl px-5 py-7 h-40 flex justify-center items-center">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-auto max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Item+Image';
                  }}
                />
              </div>
              <div className="w-3/4 pt-1">
                <h3 className="text-3xl font-grotesk font-extrabold mb-4">{selectedItem.name}</h3>
                {!isActivity && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {selectedItem.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-[#5143D9] flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-grotesk font-bold text-md text-black leading-tight">
                            {feature.text}
                          </p>
                          <p className="font-grotesk text-sm text-gray-600 leading-snug break-words max-w-prose">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isActivity && (
                  <p className="font-grotesk text-md text-gray-600">{selectedItem.description}</p>
                )}
              </div>
            </div>
            <div className="bg-[#F5F5F6] rounded-md px-2 py-2">
              <p className="text-gray-600 font-grotesk">{selectedItem.description}</p>
            </div>
          </div>

          {/* Traveller Information */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
            <h4 className="text-2xl font-grotesk font-extrabold mb-4">Traveller Information</h4>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Name</p>
                  <input
                    type="text"
                    value={travellerInfo.name}
                    onChange={(e) => handleTravellerInfoChange('name', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                    placeholder="Enter traveller name"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Phone Number</p>
                  <input
                    type="tel"
                    value={travellerInfo.mobile}
                    onChange={(e) => handleTravellerInfoChange('mobile', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Email</p>
                  <input
                    type="email"
                    value={travellerInfo.email}
                    onChange={(e) => handleTravellerInfoChange('email', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Pickup Location</p>
                  <p className="font-grotesk text-sm text-gray-600">{travellerInfo.pickupLocation?.name || 'Not specified'}</p>
                </div>
              </div>
              {dropoffLocation.name !== 'Not specified' && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-6 w-6 text-[#5143D9]" />
                  <div>
                    <p className="font-grotesk font-semibold text-md text-black">Drop-off Location</p>
                    <p className="font-grotesk text-sm text-gray-600">{travellerInfo.dropoffLocation.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 col-span-2">
                <MapPinIcon className="h-6 w-6 text-[#5143D9] mt-1 flex-shrink-0" />
                <div className="w-full">
                  <p className="font-grotesk font-semibold text-md text-black">Exact Pickup Location</p>
                  <input
                    type="text"
                    placeholder="Enter exact pickup location (e.g., hotel, address)"
                    value={travellerInfo.exactPickupLocation}
                    onChange={handleExactPickupLocationChange}
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Pickup Date</p>
                  <p className="font-grotesk text-sm text-gray-600">{travellerInfo.pickupDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-6 w-6 text-[#5143D9]" />
                <div>
                  <p className="font-grotesk font-semibold text-md text-black">Pickup Time</p>
                  <p className="font-grotesk text-sm text-gray-600">{travellerInfo.pickupTime}</p>
                </div>
              </div>
              {isActivity && selectedItem.cancellationPolicy && (
                <div className="flex items-center gap-2 col-span-2">
                  <ArrowPathIcon className="h-6 w-6 text-[#5143D9]" />
                  <div>
                    <p className="font-grotesk font-semibold text-md text-black">Cancellation Policy</p>
                    <p className="font-grotesk text-sm text-gray-600">{selectedItem.cancellationPolicy}</p>
                  </div>
                </div>
              )}
              {isBookingForOther && (
                <>
                  <div className="flex items-start gap-2 col-span-2">
                    <UserIcon className="h-6 w-6 text-[#5143D9] mt-1 flex-shrink-0" />
                    <div className="w-full">
                      <p className="font-grotesk font-semibold text-md text-black">Alternate Traveller Name</p>
                      <input
                        type="text"
                        placeholder="Enter alternate traveller name"
                        value={alternateName}
                        onChange={(e) => setAlternateName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <UserIcon className="h-6 w-6 text-[#5143D9] mt-1 flex-shrink-0" />
                    <div className="w-full">
                      <p className="font-grotesk font-semibold text-md text-black">Alternate Phone Number</p>
                      <input
                        type="tel"
                        placeholder="Enter alternate phone number"
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <EnvelopeIcon className="h-6 w-6 text-[#5143D9] mt-1 flex-shrink-0" />
                    <div className="w-full">
                      <p className="font-grotesk font-semibold text-md text-black">Alternate Email</p>
                      <input
                        type="email"
                        placeholder="Enter alternate email address"
                        value={alternateEmail}
                        onChange={(e) => setAlternateEmail(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md p-2 text-md font-grotesk mt-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isBookingForOther}
                  onChange={() => setIsBookingForOther(!isBookingForOther)}
                  className="accent-orange-500 h-4 w-4"
                />
                <span className="font-grotesk text-md text-gray-600">Book for someone else</span>
              </label>
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
            <h4 className="text-2xl font-grotesk font-extrabold mb-4">Inclusions</h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedItem.inclusions.map((inclusion, index) => {
                const IconComponent = iconMap[inclusion.icon];
                return (
                  <div key={index} className="flex items-center gap-2">
                    {IconComponent ? (
                      <IconComponent className="h-6 w-6 text-[#5143D9] flex-shrink-0" />
                    ) : (
                      <span className="h-6 w-6 text-[#5143D9]">[Icon]</span>
                    )}
                    <p className="font-grotesk text-sm text-black font-semibold break-words">
                      {inclusion.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Payment Sidebar */}
        <aside className="w-1/3">
          <div className="sticky top-0">
            <div className="bg-[#F5F5F6] rounded-2xl p-5 border border-gray-200">
              <h6 className="text-orange-500 font-grotesk font-normal text-lg mb-4">Hurry! Limited {isActivity ? 'spots' : 'cars'} left</h6>
              <ul className="mb-4 space-y-2">
                <li className="flex justify-between font-grotesk font-semibold text-lg text-black">
                  <span>Total</span>
                  <span>₹{selectedItem.actualPrice?.toLocaleString('en-IN') || '0'}</span>
                </li>
              </ul>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    id="halfPayment"
                    value="half"
                    checked={paymentOption === 'half'}
                    onChange={() => setPaymentOption('half')}
                    className="accent-orange-500 mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="halfPayment" className="font-grotesk text-sm text-gray-600 cursor-pointer flex-1">
                    Pay ₹{(selectedItem.actualPrice / 2)?.toLocaleString('en-IN')} now (Half Payment)
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    id="fullPayment"
                    value="full"
                    checked={paymentOption === 'full'}
                    onChange={() => setPaymentOption('full')}
                    className="accent-orange-500 mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="fullPayment" className="font-grotesk text-sm text-gray-600 cursor-pointer flex-1">
                    Pay ₹{selectedItem.actualPrice?.toLocaleString('en-IN')} now (Full Payment)
                  </label>
                </div>
              </div>
              <button
                onClick={handlePayNow}
                className="w-full bg-orange-500 hover:bg-black text-white rounded-4xl cursor-pointer px-8 py-3 text-md font-grotesk font-semibold mt-4 transition-colors"
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
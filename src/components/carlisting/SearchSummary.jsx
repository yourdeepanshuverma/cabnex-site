// components/carlisting/SearchSummary.jsx
import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEdit } from 'react-icons/fa';
import { useSearch } from '../../context/SearchContext';
import { format } from 'date-fns';

const SearchSummary = ({ onModify }) => {
  const { searchFormData } = useSearch();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'dd MMM yyyy, h:mm a');
  };

  const getLocationName = (key) => {
    return searchFormData.selectedPlaces[key]?.name || '-';
  };

  const serviceType = searchFormData.serviceType?.toUpperCase();

  const cityName = searchFormData.selectedCity?.name || '-';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-extrabold font-grotesk text-orange-600">
          Your Trip Details
        </h3>
        <button
          onClick={onModify}
          className="flex items-center gap-2 bg-orange-500 hover:bg-black text-white px-4 py-2 rounded-full text-sm font-grotesk font-medium transition"
        >
          <FaEdit /> Modify
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {/* Service Type */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <FaMapMarkerAlt className="text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-600">Trip Type</p>
            <p className="font-grotesk font-bold">{serviceType.replace(/_/g, ' ')} TRIP</p>
          </div>
        </div>

        {/* Multicity Itinerary */}
        {searchFormData.outstationTripType === 'multicity' ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchFormData.multicityStops.map((stop, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <p className="font-bold text-orange-600 mb-2">Leg {index + 1}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-blue-500 mt-1" />
                    <div>
                      <p className="font-semibold text-xs text-gray-500">From</p>
                      <p className="font-bold text-sm">{stop.selectedPickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-green-500 mt-1" />
                    <div>
                      <p className="font-semibold text-xs text-gray-500">To</p>
                      <p className="font-bold text-sm">{stop.selectedDropoffAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCalendarAlt className="text-purple-500 mt-1" />
                    <div>
                      <p className="font-semibold text-xs text-gray-500">Departure</p>
                      <p className="font-bold text-sm">{formatDate(stop.dateTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* City – Sirf Transfer me dikhao */}
            {serviceType === 'TRANSFER' && (
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <FaMapMarkerAlt className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">City</p>
                  <p className="font-grotesk font-bold line-clamp-1">{cityName}</p>
                </div>
              </div>
            )}

            {/* Pickup */}
            {searchFormData.pickupLocation && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">From</p>
                  <p className="font-grotesk font-bold line-clamp-1">
                    {getLocationName(
                      serviceType === 'RENTAL' ? 'rentalPickup' :
                      serviceType === 'TRANSFER' ? 'transferFrom' :
                      serviceType === 'OUTSTATION' ? 'outstationPickup' :
                      'activityLocation'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Dropoff */}
            {searchFormData.dropoffLocation && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaMapMarkerAlt className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">To</p>
                  <p className="font-grotesk font-bold line-clamp-1">
                    {getLocationName(
                      serviceType === 'TRANSFER' ? 'transferTo' : 'outstationDropoff'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Date & Time */}
            {(searchFormData.pickupDateTime || searchFormData.transferDateTime || searchFormData.outstationPickupDateTime) && (
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaCalendarAlt className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Pickup Date/Time</p>
                  <p className="font-grotesk font-bold">
                    {formatDate(
                      searchFormData.pickupDateTime ||
                      searchFormData.transferDateTime ||
                      searchFormData.outstationPickupDateTime
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Return Date */}
            {searchFormData.outstationReturnDateTime && (
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaClock className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Return Date/Time</p>
                  <p className="font-grotesk font-bold">
                    {formatDate(searchFormData.outstationReturnDateTime)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Package */}
        {searchFormData.rentalPackage && (
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <FaClock className="text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-600">Package</p>
              <p className="font-grotesk font-bold">Selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Direction */}
      {searchFormData.transferDirection && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm font-grotesk font-medium text-gray-600">
            Direction:{' '}
            <span className="text-orange-600 font-bold">
              {searchFormData.transferDirection === 'home-to-station'
                ? 'Home to Station'
                : 'Station to Home'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSummary;
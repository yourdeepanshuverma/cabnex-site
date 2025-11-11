import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { toast } from 'sonner';
import { api } from '../api/api-config';
import { CalendarIcon, MapPinIcon, ClockIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const MyBookingDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item: booking } = location.state || {};

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
            <p>The booking details could not be loaded. Please go back to your bookings and try again.</p>
            <button onClick={() => navigate('/my-bookings')} className="mt-4 bg-orange-500 hover:bg-black text-white font-bold py-2 px-4 rounded-full">
              My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { bookingId, createdAt, pickupDateTime, startLocation, destinations, totalAmount, distance, serviceType, carCategory = 'Car' } = booking;
  const bookingDate = new Date(createdAt);
  const pickupDate = new Date(pickupDateTime);

  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-gray-200 flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-grotesk">Booking Invoice</h2>
              <p className="text-sm text-gray-500 mt-1">Booking ID: {bookingId}</p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Booking Date</p>
                <p className="text-base font-bold text-gray-900">{bookingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ClockIcon className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Booking Time</p>
                <p className="text-base font-bold text-gray-900">{bookingDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="p-6 sm:p-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-grotesk">Itinerary Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPinIcon className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Pickup Address</p>
                  <p className="text-gray-600">{startLocation.address}</p>
                </div>
              </div>
              {destinations && destinations.length > 0 && (
                <div className="flex items-start gap-4">
                  <MapPinIcon className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Dropoff Address</p>
                    <p className="text-gray-600">{destinations[destinations.length - 1].address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <CalendarIcon className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Pickup Date & Time</p>
                  <p className="text-gray-600">{pickupDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {pickupDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <p className="font-semibold text-gray-800">Service Type:</p>
                <p className="text-gray-600">{serviceType.replace(/_/g, ' ').toUpperCase()}</p>
              </div>
              <div className="flex items-start gap-4">
                <p className="font-semibold text-gray-800">Car Category:</p>
                <p className="text-gray-600">{carCategory}</p>
              </div>
              {distance > 0 && (
                <div className="flex items-start gap-4">
                  <p className="font-semibold text-gray-800">Expected Distance:</p>
                  <p className="text-gray-600">{distance} Km</p>
                </div>
              )}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="p-6 sm:p-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3 font-grotesk">Inclusions</h4>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Driver & Fuel Charges</li>
                <li>Toll, Tax, Parking & State Tax</li>
                <li>GST</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-3 font-grotesk">Exclusions</h4>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Any extra kilometers driven</li>
                <li>Extra hours</li>
                <li>Waiting charges</li>
              </ul>
            </div>
          </div>

          {/* Note Section */}
          <div className="p-6 sm:p-8 border-t border-gray-200 bg-yellow-50 rounded-b-2xl">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <h4 className="text-lg font-bold text-yellow-800 mb-2 font-grotesk">Important Notes</h4>
                <ul className="space-y-2 text-sm text-yellow-700 list-disc list-inside">
                  <li>One Day Means One Calendar day from Midnight (12:00:00 Midnight to 23:50:00 Midnight)</li>
                  <li>Kilometers (Km) and Hours will be Calculated from Garage to Garage or Specified</li>
                  <li>Air Con will be switched off in Hill Areas</li>
                  <li>If Driver Drives Vehicle between 00:00:00 to 00:00:00, Driver Allowance/Night Charges 20 will be Applicable</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MyBookingDetailPage;

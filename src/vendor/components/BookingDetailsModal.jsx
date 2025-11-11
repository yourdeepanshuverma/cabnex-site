import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCar, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-md font-semibold text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Booking Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID: {booking.bookingId}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">User Information</h4>
            <DetailItem icon={<FaUser className="text-blue-500" />} label="Name" value={booking.userId?.fullName || 'N/A'} />
            <DetailItem icon={<FaEnvelope className="text-blue-500" />} label="Email" value={booking.userId?.email || 'N/A'} />
            <DetailItem icon={<FaPhone className="text-blue-500" />} label="Mobile" value={booking.userId?.mobile || 'N/A'} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Trip Details</h4>
            <DetailItem icon={<FaCar className="text-green-500" />} label="Car Category" value={booking.carCategory} />
            <DetailItem icon={<FaInfoCircle className="text-green-500" />} label="Service Type" value={booking.serviceType} />
            <DetailItem icon={<FaCalendarAlt className="text-green-500" />} label="Pickup Date & Time" value={new Date(booking.pickupDateTime).toLocaleString()} />
            <DetailItem icon={<FaMapMarkerAlt className="text-green-500" />} label="Pickup Location" value={booking.startLocation.address} />
            {booking.destinations.length > 0 && (
              <div>
                <h5 className="text-md font-semibold mb-2">Destinations:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {booking.destinations.map((dest, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{dest.address}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">Payment & Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailItem icon={<FaRupeeSign className="text-purple-500" />} label="Total Amount" value={`₹${booking.totalAmount}`} />
                <DetailItem icon={<FaRupeeSign className="text-purple-500" />} label="Received Amount" value={`₹${booking.recievedAmount}`} />
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0"><FaInfoCircle className="text-purple-500" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsModal;

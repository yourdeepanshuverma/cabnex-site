import React, { useState, useEffect } from 'react';
import { api, endpoints } from '../../api/api-config';
import { toast } from 'sonner';
import BookingDetailsModal from '../components/BookingDetailsModal';

import { useLocation } from 'react-router-dom';

const AllBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/api/v1/vendor/bookings');
        if (response.data.success) {
          setBookings(response.data.data);
          const bookingId = location.state?.bookingId;
          if (bookingId) {
            const bookingToView = response.data.data.find((b) => b.bookingId === bookingId);
            if (bookingToView) {
              handleViewBooking(bookingToView);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [location.state?.bookingId]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await api.put(`/api/v1/vendor/bookings/${bookingId}`);
      if (response.data.success) {
        setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'completed' } : b));
        toast.success('Booking marked as completed.');
      } else {
        toast.error(response.data.message || 'Failed to complete booking.');
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('An error occurred while completing the booking.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-grotesk font-semibold text-gray-800 dark:text-gray-200">All Bookings</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Car Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{booking.bookingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{booking.carCategory}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{new Date(booking.pickupDateTime).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleViewBooking(booking)} className="text-indigo-600 hover:text-indigo-900">View</button>
                    <button 
                      onClick={() => handleCompleteBooking(booking.bookingId)} 
                      className="ml-4 text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={booking.status === 'completed'}
                    >
                      Complete Booking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <BookingDetailsModal booking={selectedBooking} onClose={handleCloseModal} />}
    </div>
  );
};

export default AllBookingsPage;

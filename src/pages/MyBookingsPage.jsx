import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import Header from '../components/header';
import { toast } from 'sonner';
import { api } from '../api/api-config';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'; 

const MyBookingsPage = () => {
  const { user, isLoggedIn } = useSearch();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Assumed endpoint for fetching user-specific bookings
        const response = await api.get(`/api/v1/auth/booking/user/${user._id}`);
        if (response.data.success) {
          // Sort bookings by date, newest first
          const sortedBookings = response.data.data.sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime));
          setBookings(sortedBookings);
        } else {
          setError(response.data.message || 'Failed to fetch bookings.');
          toast.error(response.data.message || 'Failed to fetch bookings.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching bookings.');
        toast.error(err.response?.data?.message || 'An error occurred while fetching bookings.');
        console.error("Fetch bookings error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchBookings();
    }
  }, [user, isLoggedIn]);

  const BookingCard = ({ booking }) => {
    const { carCategory, pickupDateTime, startLocation, destinations, totalAmount, status, serviceType } = booking;
    const pickupDate = new Date(pickupDateTime);

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0 font-grotesk">{carCategory.charAt(0).toUpperCase() + carCategory.slice(1)}</h3>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${status === 'confirmed' ? 'bg-green-100 text-green-800' : status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="space-y-4 text-gray-600 font-grotesk">
            <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-orange-500" />
                <span>{pickupDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-orange-500" />
                <span>{pickupDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
            <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                    <p className='font-semibold'>Pickup:</p>
                    <p>{startLocation.address}</p>
                </div>
            </div>
            {destinations && destinations.length > 0 && (
                 <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                        <p className='font-semibold'>Dropoff:</p>
                        <p>{destinations[0].address}</p>
                    </div>
                </div>
            )}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500 font-grotesk">Service: <span className="font-semibold">{serviceType.replace(/_/g, ' ').toUpperCase()}</span></p>
            <p className="text-lg font-bold text-gray-900 font-grotesk">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>Please log in to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Bookings</h1>
        
        {isLoading ? (
          <div className="text-center">
            <p>Loading your bookings...</p>
            {/* You can add a spinner here */}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet. Let's find you a ride!</p>
            <Link to="/" className="bg-orange-500 hover:bg-black text-white font-bold py-3 px-6 rounded-full transition duration-300">
              Book a Cab
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookingsPage;

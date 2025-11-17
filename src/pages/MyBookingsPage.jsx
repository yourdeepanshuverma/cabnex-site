import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import Header from "../components/header";
import { toast } from "sonner";
import { api } from "../api/api-config";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const MyBookingsPage = () => {
  const { user, isLoggedIn } = useSearch();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  const handleView = (booking) => {
    navigate(`/my-booking-detail/${booking.bookingId}`, {
      state: { item: booking },
    });
  };

  // Tabs definition
  const serviceTypeTabs = [
    { id: "all", label: "All" },
    { id: "rental", label: "Rental" },
    { id: "outstation", label: "Outstation" },
    { id: "transfer", label: "Transfer" },
    { id: "activity", label: "Activity" },
  ];

  const statusTabs = [
    { id: "all", label: "All Statuses" },
    { id: "pending", label: "Pending" },
    { id: "inprogress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`api/v1/auth/bookings`);
        if (response.data.success) {
          const sortedBookings = response.data.data.sort(
            (a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime)
          );
          setBookings(sortedBookings);
          if (location.state?.status) {
            setStatusFilter(location.state.status);
          }
        } else {
          setError(response.data.message || "Failed to fetch bookings.");
          toast.error(response.data.message || "Failed to fetch bookings.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching bookings."
        );
        toast.error(
          err.response?.data?.message ||
            "An error occurred while fetching bookings."
        );
        console.error("Fetch bookings error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchBookings();
    }
  }, [user, isLoggedIn, location.state]);

  // Filter bookings when tab changes
  useEffect(() => {
    let filtered = bookings;

    // Filter by service type (activeTab)
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (booking) => booking.serviceType?.toLowerCase() === activeTab
      );
    }

    // Filter by status (statusFilter)
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status?.toLowerCase() === statusFilter
      );
    }

    setFilteredBookings(filtered);
  }, [activeTab, statusFilter, bookings]);

  const handleCancel = async (booking) => {
    const { bookingId, _id, status } = booking;

    if (status !== "pending") {
      toast.error("Only pending bookings can be cancelled.");
      return;
    }

    const confirmed = window.confirm(`Cancel booking ${bookingId}?`);
    if (!confirmed) return;

    const loadingToast = toast.loading("Cancelling booking...");

    try {
      const response = await api.delete(`/api/v1/auth/bookings/${bookingId}`);

      if (response.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== _id));
        toast.dismiss(loadingToast);
        toast.success(`Booking ${bookingId} cancelled!`);
      }
    } catch (err) {
      console.error("Cancel error:", err.response?.data);
      const msg = err.response?.data?.message || "Failed to cancel";
      toast.dismiss(loadingToast);
      toast.error(msg);

      if (err.response?.status === 404) {
        setBookings((prev) => prev.filter((b) => b._id !== _id));
        toast.info("Booking no longer exists.");
      }
    }
  };

  const BookingCard = ({ booking }) => {
    const {
      carCategory = "Car",
      pickupDateTime,
      startLocation,
      destinations,
      totalAmount,
      status,
      serviceType,
      bookingId,
    } = booking;
    const pickupDate = new Date(pickupDateTime);

    return (
      <div className="bg-white rounded-2xl shadow-md border h-full flex-col flex border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0 font-grotesk">
            {carCategory.charAt(0).toUpperCase() + carCategory.slice(1)} |{" "}
            {bookingId}
          </h3>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              status === "confirmed"
                ? "bg-green-100 text-green-800"
                : status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="space-y-4 text-gray-600 font-grotesk">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            <span>
              {pickupDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <span>
              {pickupDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-orange-500 mt-1" />
            <div>
              <p className="font-semibold">Pickup:</p>
              <p>{startLocation.address}</p>
            </div>
          </div>
          {destinations && destinations.length > 0 && (
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-orange-500 mt-1" />
              <div>
                <p className="font-semibold">Dropoff:</p>
                <p>{destinations[0].address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-auto pt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => handleView(booking)}
              className="text-sm text-white font-grotesk bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-md"
            >
              View
            </button>
            {status === "pending" && (
              <button
                onClick={() => handleCancel(booking)}
                className="text-sm text-white font-grotesk bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 font-grotesk">
            ₹{totalAmount.toLocaleString("en-IN")}
          </p>
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          My Bookings
        </h1>

        {/* Service Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
          {serviceTypeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 font-grotesk text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full font-grotesk text-sm font-medium transition-colors ${
                statusFilter === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty / Bookings */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>{error}</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
              No {activeTab === "all" ? "" : activeTab} Bookings
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : `No ${activeTab} bookings found.`}
            </p>
            <Link
              to="/"
              className="bg-orange-500 hover:bg-black text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Book a Cab
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookingsPage;

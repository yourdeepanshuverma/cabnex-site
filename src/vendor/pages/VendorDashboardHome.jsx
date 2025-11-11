import React, { useState, useEffect } from 'react';
import { FaCar, FaCheckCircle, FaClock, FaCalendarCheck, FaCalendar, FaTasks, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useVendorAuth } from '../context/VendorAuthContext';
import { api, endpoints } from '../../api/api-config';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BookingDetailsModal from '../components/BookingDetailsModal';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const VendorDashboardHome = () => {
  const { vendorUser, setVendorStats } = useVendorAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!vendorUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`${endpoints.Dashboardstats}`);
        const data = response.data.data;
        setDashboardData(data);
        setVendorStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [vendorUser?._id, setVendorStats]);

  // Chart Data
  const carStatusData = [
    { name: 'Approved', value: dashboardData?.approvedCars || 0, color: '#10b981' },
    { name: 'Pending', value: dashboardData?.pendingCars || 0, color: '#f59e0b' },
    { name: 'Others', value: Math.max(0, (dashboardData?.totalCars || 0) - (dashboardData?.approvedCars || 0) - (dashboardData?.pendingCars || 0)), color: '#6b7280' },
  ].filter(item => item.value > 0);

  const bookingTrendData = dashboardData?.monthlyBookings || [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 19 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 25 },
    { month: 'May', bookings: 22 },
    { month: 'Jun', bookings: 30 },
  ];

  const recentBookings = dashboardData?.recentBookings?.slice(0, 15) || [];

  if (loading) {
    return (
      <div className="space-y-8 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="lg:col-span-7"><SkeletonCard /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-grotesk font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Welcome, {vendorUser?.businessName || 'Vendor'}!
        </h2>
        <Link
          to="/vendor/add-car"
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-[#FF6900] to-[#ff8c42] text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Add New Car
        </Link>
      </div>

      {/* === 6 CARDS (3 per row) - FULL WIDTH === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cars</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{dashboardData?.totalCars ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaCar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Cars</p>
              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">{dashboardData?.approvedCars ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaCheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">{dashboardData?.pendingCars ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaClock className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Bookings</p>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{dashboardData?.completedBookings ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaCalendarCheck className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Bookings</p>
              <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{dashboardData?.upcomingBookings ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaCalendar className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card 6 */}
        <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Bookings</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{dashboardData?.assignedBookings ?? 0}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl group-hover:scale-110 transition-transform">
              <FaTasks className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* === LOWER SECTION: Charts (40%) + Table (60%) === */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Charts (40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Car Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={carStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {carStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Booking Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#FF6900" strokeWidth={3} dot={{ fill: '#FF6900' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Bookings</h3>
            <Link to="/vendor/bookings" className="text-sm text-orange-500 hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pickup</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookings
                  .sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime))
                  .map((booking) => (
                    <tr key={booking.bookingId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">#{booking.bookingId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{booking.carCategory}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                        {new Date(booking.pickupDateTime).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'inProgress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {recentBookings.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent bookings</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <BookingDetailsModal booking={selectedBooking} onClose={handleCloseModal} />}
    </div>
  );
};

export default VendorDashboardHome;
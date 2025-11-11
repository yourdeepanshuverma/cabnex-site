import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch,FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { api } from '../../api/api-config';

import CarDetailsModal from '../components/CarDetailsModal';

const VendorCarList = () => {
  // State for categories fetched from API
  const [categories, setCategories] = useState([]);

  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFuelType, setFilterFuelType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or category name
  const carsPerPage = 10;

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewCar = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/api/v1/vendor/cars');
        if (response.data.success && response.data.data) {
          setCars(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);

  // Fetch categories using Axios
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/v1/admin/car-categories');
        if (response.data.success && response.data.data?.categories) {
          setCategories(response.data.data.categories.map((cat) => cat.category));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // car delete api call
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this car?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/api/v1/vendor/cars/${id}`);
      if (response.data.success) {
        alert("Car deleted successfully!");
        setCars((prev) => prev.filter((car) => car._id !== id));
      } else {
        alert("Failed to delete car.");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Something went wrong while deleting the car!");
    }
  };

  // Filter and search cars
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : car.category === activeTab;
    const matchesCategory = filterCategory ? car.category === filterCategory : true;
    const matchesStatus = filterStatus ? car.status === filterStatus : true;
    const matchesFuelType = filterFuelType ? car.fuelType === filterFuelType : true;
    return matchesSearch && matchesTab && matchesCategory && matchesStatus && matchesFuelType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-x-hidden">
      <style>
        {`
          .table-container {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .dark .table-container {
            background: #1f2937;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .input-field {
            border-radius: 2rem;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .dark .input-field {
            border-color: #4b5563;
            background-color: #374151;
            color: #ffffff;
          }
          .input-field:focus {
            border-color: #FF6900;
            box-shadow: 0 0 0 3px rgba(255, 105, 0, 0.2);
          }
          .btn-secondary {
            background-color: #6b7280;
            border-radius: 0.75rem;
            padding: 0.5rem 1.5rem;
            color: white;
            transition: background-color 0.2s ease;
          }
          .btn-secondary:hover {
            background-color: #4b5563;
          }
          .tab {
            padding: 0.5rem 2rem;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            border-radius: 30px;
          }
          .tab.active {
            border-bottom-color: #FF6900;
            color: #FFF;
            background-color: #FF6900;
            font-weight: 600;
          }
          .tab:hover {
            background-color: #f3f4f6;
            color: #FF6900;
          }
          .dark .tab:hover {
            background-color: #374151;
          }

          /* New: Responsive table adjustments */
          .table-wrapper {
            overflow-x-auto;
            -webkit-overflow-scrolling: touch; /* Smooth scroll on mobile */
            border-radius: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background: white;
          }
          .dark .table-wrapper {
            background: #1f2937;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          table {
            min-width: 800px; /* Force min-width for scroll on small screens */
          }
          th, td {
            padding: 0.5rem; /* Reduced padding for mobile */
          }

          /* Media queries for better responsiveness */
          @media (max-width: 768px) {
            .filter-bar {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .search-input {
              width: 100%;
            }
            /* Hide less important columns on mobile */
            .hide-mobile {
              display: none;
            }
            /* Stack actions vertically */
            .actions-mobile {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
            th, td {
              font-size: 0.875rem;
              padding: 0.75rem 0.5rem;
            }
            .status-badge {
              font-size: 0.75rem;
            }
          }

          @media (max-width: 640px) {
            /* Further optimizations */
            .tab {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
          }

          /* Ensure no overflow on body */
          body {
            overflow-x: hidden;
          }
        `}
      </style>

      <h2 className="text-2xl md:text-3xl font-grotesk font-semibold text-gray-800 dark:text-gray-200">
        Your Cars
      </h2>

      {/* Tabs - made scrollable on small screens */}
      <div className="overflow-x-auto whitespace-nowrap pb-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex space-x-4">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${activeTab === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(cat);
                setCurrentPage(1);
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters - responsive flex */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0 filter-bar">
        <div className="relative w-full md:max-w-md search-input">
          <input
            type="text"
            placeholder="Search by Make, Model, or Registration"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-full py-3 w-full !pl-10 pr-4 input-field"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            value={filterFuelType}
            onChange={(e) => setFilterFuelType(e.target.value)}
            className="input-field px-3 py-2"
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Table Container - Responsive Wrapper */}
      <div className="table-wrapper p-6">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="hide-mobile px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Make</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                <th className="hide-mobile px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registration</th>
                <th className="hide-mobile px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Colour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentCars.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No cars found matching your filters.
                  </td>
                </tr>
              ) : (
                currentCars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="hide-mobile px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {car._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.make}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.model}</td>
                    <td className="hide-mobile px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.registrationNumber}</td>
                    <td className="hide-mobile px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{car.colour}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full status-badge ${
                          car.status === 'available'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : car.status === 'rented'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium actions-mobile md:flex md:space-x-4">
                      <Link to={`/vendor/edit-car/${car._id}`} className="text-blue-600 hover:text-blue-900 block md:inline">
                        <FaEdit className="inline w-4 h-4" /> Edit
                      </Link>
                      <button onClick={() => handleDelete(car._id)} className="text-red-600 hover:text-red-900 block md:inline">
                        <FaTrash className="inline w-4 h-4" /> Delete
                      </button>
                      <button onClick={() => handleViewCar(car)} className="text-green-600 hover:text-green-900 block md:inline">
                        <FaEye className="inline w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <CarDetailsModal car={selectedCar} onClose={handleCloseModal} />}

      {/* Pagination - responsive */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {indexOfFirstCar + 1} to {Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length} cars
          </div>
          <div className="flex flex-wrap justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary px-3 py-1"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md ${
                  currentPage === page
                    ? 'bg-[#FF6900] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary px-3 py-1"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCarList;
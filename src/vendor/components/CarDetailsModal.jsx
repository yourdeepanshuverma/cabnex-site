import React from 'react';
import {
  FaInfoCircle, FaCar, FaCalendarAlt, FaTag, FaPalette, FaIdCard,
  FaCheckCircle, FaGasPump, FaChair, FaSnowflake, FaShieldAlt,
  FaImage, FaTimes, FaCogs, FaTachometerAlt
} from 'react-icons/fa';

const CarDetailsModal = ({ car, onClose }) => {
  if (!car) return null;

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0 text-orange-500 dark:text-orange-400 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">
          {value || '—'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        
        {/* Modal Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-1">
                {car.category} • ID: {car._id.slice(-6)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <FaTimes className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left: Image */}
              <div className="order-2 lg:order-1">
                {car.images && car.images.length > 0 ? (
                  <div className="relative group">
                    <img
                      src={car.images[0]?.url}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="w-16 h-16 mb-3" />
                    <p className="text-sm font-medium">No Image Available</p>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="order-1 lg:order-2 space-y-6">
                
                {/* General Info */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <FaInfoCircle className="mr-2 text-orange-500" />
                    General Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailItem icon={<FaTag className="w-5 h-5" />} label="Make" value={car.make} />
                    <DetailItem icon={<FaCar className="w-5 h-5" />} label="Model" value={car.model} />
                    <DetailItem icon={<FaCalendarAlt className="w-5 h-5" />} label="Year" value={car.year} />
                    <DetailItem icon={<FaIdCard className="w-5 h-5" />} label="Registration" value={car.registrationNumber} />
                    <DetailItem icon={<FaPalette className="w-5 h-5" />} label="Color" value={car.colour} />
                    <DetailItem
                      icon={<FaCheckCircle className="w-5 h-5" />}
                      label="Verified"
                      value={car.isVerified ? 'Yes' : 'No'}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-start">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                      car.status === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : car.status === 'rented'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {car.status}
                  </span>
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <FaCogs className="mr-2 text-orange-500" />
                    Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailItem icon={<FaChair className="w-5 h-5" />} label="Seats" value={car.seatingCapacity} />
                    <DetailItem icon={<FaGasPump className="w-5 h-5" />} label="Fuel" value={car.fuelType} />
                    <DetailItem icon={<FaSnowflake className="w-5 h-5" />} label="AC" value={car.airConditioning ? 'Yes' : 'No'} />
                    <DetailItem icon={<FaTachometerAlt className="w-5 h-5" />} label="Transmission" value={car.transmission || 'N/A'} />
                  </div>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                      <FaTag className="mr-2 text-orange-500" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insurance */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                    <FaShieldAlt className="mr-2 text-orange-500" />
                    Insurance
                  </h4>
                  <DetailItem
                    icon={<FaCalendarAlt className="w-5 h-5" />}
                    label="Expires On"
                    value={new Date(car.insuranceExpiry).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Thin Scrollbar */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #FF6900 #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF6900;
          border-radius: 10px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e55a00;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </>
  );
};

export default CarDetailsModal;
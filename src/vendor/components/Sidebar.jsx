import React from 'react';
import { FaHome, FaCar, FaUserCircle, FaPlus, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { useVendorAuth } from '../context/VendorAuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { vendorUser } = useVendorAuth();
  console.log('Sidebar vendorUser:', vendorUser);
  const menuItems = [
    { path: '/vendor', label: 'Dashboard', icon: FaHome },
    { path: '/vendor/car-list', label: 'Manage car ', icon: FaCar },
    { path: '/vendor/add-car', label: 'Add Car', icon: FaPlus },
    { path: '/vendor/profile', label: 'Profile', icon: FaUser },
  ];

  return (
    <div className="mt-20">
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="py-2 px-4 h-[103px] border-b border-[#bebebe] flex flex-col items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="w-12 h-12 mb-1 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <FaUserCircle className=" text-gray-500 " />
          </div>
          <span className="font-bold text-[#3A4A5B] text-center font-grotesk text-lg">Hey, {vendorUser?.contactPerson || 'Vendor'}</span>
        </div>
        <nav className="flex-1 mt-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end  // YE SIRF YE ADD KIYA ACTIVE FIX KE LIYE
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors duration-200 ${
                  isActive ? 'bg-[#FF6900] text-white font-semibold' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-3 w-5 h-5" />
              <span className="font-grotesk">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed sm:hidden inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
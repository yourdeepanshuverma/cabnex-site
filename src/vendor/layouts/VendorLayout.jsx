import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

const VendorLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className={`flex-1 p-6 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 ${isOpen ? 'md:ml-64' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default VendorLayout;
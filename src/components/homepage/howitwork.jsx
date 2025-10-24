import React from 'react';
import { motion } from 'framer-motion';

// Icons with orange gradient fill
const RegisterIcon = () => (
  <svg className="w-14 h-14" fill="url(#orange-gradient)" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M12 22a10 10 0 110-20 10 10 0 010 20z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-14 h-14" fill="url(#orange-gradient)" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-14 h-14" fill="url(#orange-gradient)" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13h18l-2-5H5l-2 5zm3 5a2 2 0 11.001-4.001A2 2 0 016 18zm12 0a2 2 0 11.001-4.001A2 2 0 0118 18z" />
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-14 h-14" fill="url(#orange-gradient)" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <RegisterIcon />,
      title: 'Register Your Business',
      description: 'Click Register, complete your basic KYC details, and set up your business account effortlessly.',
    },
    {
      icon: <SearchIcon />,
      title: 'Search for Cars',
      description: 'Choose the service type — Rental, Transfer, or Outstation — then enter pickup location and dates to view available vehicles.',
    },
    {
      icon: <CarIcon />,
      title: 'Choose Your Car',
      description: 'Explore listings, compare options, and select the vehicle that best fits your client’s travel needs.',
    },
    {
      icon: <PaymentIcon />,
      title: 'Book & Pay',
      description: 'Add trip details, choose any add-ons, and complete secure payment to confirm your booking.',
    },
  ];

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Gradient for Icons */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F54A00', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F54A00', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="linrr"></div>
        <span className="text-sm uppercase text-center font-grotesk text-orange-500 tracking-widest">Steps</span>
        <h2 className="text-3xl text-center md:text-5xl font-grotesk text-white font-extrabold leading-14 mt-2 mb-12">
          How It <span className="text-orange-500">Works</span>
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-between space-y-12 md:space-y-0 md:space-x-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className="flex-1 relative overflow-hidden flex flex-col items-start px-4 min-h-[300px] pt-6 pb-16  bg-[#222222] rounded-3xl transition-transform duration-300 z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="mb-3 text-white">{step.icon}</div>
                <h3 className="text-2xl font-grotesk text-start font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-200 font-grotesk text-start pb-3 text-sm">{step.description}</p>
                <div className="absolute bottom-[-9px] left-[-9px] bg-black cartypee w-18 h-18 flex items-center justify-center rounded-tr-[20px] cursor-pointer transition">
                  <div className="text-white hover:text-white bg-[#222222] text-xl border border-orange-600 flex justify-center items-center font-bold w-12 h-12 rounded-full transition-transform duration-500 hover:rotate-[-45deg]">
                    {index + 1}
                  </div>
                  <div className="br-left-top">
                    <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 fill-[#000]">
                      <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
                    </svg>
                  </div>
                  <div className="br-right-bottom">
                    <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 fill-[#000]">
                      <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* Note at the Bottom */}
        <p className="mt-12 text-lg font-grotesk text-orange-500 text-center">
          Need Assistance? <br />
          If you need any help with the above steps, please feel free to contact our support team — we’re always happy to assist you.
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;

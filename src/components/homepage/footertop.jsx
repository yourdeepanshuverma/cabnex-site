import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import footerBg from '../../assets/connect/image5.png';

export default function CallToActionSection() {
  return (
    <section
      className="bg-cover relative bg-center py-10 px-6 min-h-[500px]  flex items-center rounded-lg max-w-7xl mx-auto"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white z-10 max-w-3xl">
        {/* Heading */}
        <p className="text-sm font-grotesk uppercase mb-2">
          Ready to Move Your Business Forward?
        </p>
        <h2 className="text-[25px] lg:text-5xl font-grotesk font-bold mb-4 md:leading-14">
          Connect with Cabnex for Seamless B2B Mobility Solutions
        </h2>

        {/* Bullet Points */}
        <ul className="text-gray-200 text-sm mb-6 space-y-2">
          <li>Dedicated support for corporate bookings, vendor tie-ups, and travel partners.</li>
          <li>Trusted by businesses for reliable, professional transport — every trip, every time.</li>
          <li>Experience 24/7 coordination, customized solutions, and transparent pricing.</li>
        </ul>

        {/* Contact Info */}
        <div className="flex items-center space-x-3 mt-4">
          <div className="bg-[#ffffffa4] flex justify-center items-center w-18 h-18 rounded-full">
            <div className="bg-white p-3 w-14 h-14 rounded-full text-lg flex items-center justify-center">
              <FaPhoneAlt className="text-orange-500 text-2xl" />
            </div>
          </div>
          <div>
            <h5 className="text-xl text-white font-extrabold font-grotesk">
              Let’s Get Started Today!
            </h5>
            <p className="text-gray-300 text-md">
              +91 96672 84400 <br /> sales@cabnex.in
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

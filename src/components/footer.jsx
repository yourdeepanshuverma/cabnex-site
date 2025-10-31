import React from "react";
import logo from '../assets/logo/logo-cab.png';
import { Link } from 'react-router-dom';

import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className=" bg-[#000000] mt-18  text-white pt-20 pb-8 relative  overflow-hidden"  style={{
          backgroundImage: "url('src/assets/footer/footer-bg.svg')", // Replace with actual image path
        }}>
     

      <div className=" px-4 relative max-w-7xl mx-auto z-10">
        {/* Contact Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8 bg-[#1b1b1bee] items-center py-5 mb-20 px-6 md:px-8 border border-[#202020] rounded-2xl">
          <div className="text-center md:text-left flex  items-center ">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
                <p className="text-2xl font-bold font-grotesk ">Call us</p>
            <p className="text-xs font-grotesk  text-gray-400">+91 96672 84400</p>
            </div>
          </div>
             <div className="text-start flex  items-center ">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
                <p className="text-2xl font-bold font-grotesk ">Write to us</p>
                <p className="text-xs font-grotesk  text-gray-400">info@cabnex.in</p>
            </div>
          </div>
             <div className="text-start flex  items-center ">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
                <p className="text-2xl font-bold font-grotesk ">Address</p>
            <p className="text-xs font-grotesk  text-gray-400">Cochin : Panampilly Nagar, Ernakulam, 682036</p>
            <p className="text-xs font-grotesk  text-gray-400">Bangalore : Mahadevapura, Bangalore, 560048</p>
            <p className="text-xs font-grotesk  text-gray-400">Noida : MIQB, C 25, Sector 58, Noida 201301</p>
            </div>
          </div>
        
        
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mt-8">
          {/* NOVARIDE Section */}
          <div>
            <img src={logo}  className="w-52 rounded-2xl bg-white p-3 mb-3" alt="footer logo" />
            <p className="text-sm font-grotesk ">
              Enjoy seamless and reliable travel experiences with Cabnex.
            </p>
          </div>

          {/* Legal Policy Section */}
          <div>
            <h4 className="text-2xl font-bold font-grotesk  mb-5">Legal Policy</h4>
            <ul className="space-y-2 font-grotesk  text-sm">
              <li><Link to="/terms-and-conditions">Term & Condition</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/legal-notice">Legal Notice</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/payment-policy">Payment Policy</Link></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-2xl font-bold font-grotesk  mb-5">Quick Links</h4>
            <ul className="space-y-2 font-grotesk  text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Service</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div>
            <h4 className="text-2xl font-bold font-grotesk  mb-5">Subscribe To The Newsletter</h4>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Email..."
                className="w-full py-3 px-3 rounded-full bg-white text-black  focus:outline-none"
              />
              <button className="bg-orange-500 text-white py-3 px-3 cursor-pointer rounded-full hover:bg-orange-600 transition">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section with Social Icons */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4">
          <p className="text-lg font-grotesk ">© 2024 Nexfleet Tech Solutions Pvt Ltd. All rights reserved.</p>
         
<div className="flex space-x-4 mt-4 md:mt-0">
  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
    <FaYoutube />
  </a>
  <a href="https://www.facebook.com/cabnex.in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
    <FaFacebookF />
  </a>
  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
    <FaTwitter />
  </a>
  <a href="https://www.instagram.com/cabnex.in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
    <FaInstagram />
  </a>
  <a href="https://www.linkedin.com/company/cabnex" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
    <FaLinkedinIn />
  </a>
</div>
        </div>
      </div>
    </footer>
  );
}
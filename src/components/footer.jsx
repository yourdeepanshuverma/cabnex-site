// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Heroicons import (ये आपके पूरे प्रोजेक्ट में पहले से use हो रहे हैं)
import {
  GlobeAltIcon,
  BriefcaseIcon,
  UsersIcon,
  CameraIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const services = [
  {
    name: "Leisure & Holiday Travel",
    description: "Explore South India in comfort and style.",
    href: "/mobility-solutions",
    icon: GlobeAltIcon,
  },
  {
    name: "Corporate Travel",
    description: "Dependable mobility solutions for your business.",
    href: "/mobility-solutions",
    icon: BriefcaseIcon,
  },
  {
    name: "Events & Delegations",
    description: "Seamless multi-vehicle coordination for groups.",
    href: "/mobility-solutions",
    icon: UsersIcon,
  },
  {
    name: "City & Sightseeing Tours",
    description: "Discover the best of every destination.",
    href: "/mobility-solutions",
    icon: CameraIcon,
  },
  {
    name: "MICE Transport",
    description: "Tailored ground transport for large events.",
    href: "/mobility-solutions",
    icon: CalendarIcon,
  },
];

export default function Footer() {
  const { settings } = useWebsiteSettings();

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about-us" },
    { name: "Contact Us", to: "/contact-us" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", to: "/terms-and-conditions" },
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Legal Notice", to: "/legal-notice" },
    { name: "Accessibility", to: "/accessibility" },
    { name: "Payment Policy", to: "/payment-policy" },
  ];

  return (
    <footer className="bg-black text-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#111111ee] p-8 rounded-2xl border border-gray-800 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-2xl font-bold font-grotesk">Call us</p>
              <p className="text-gray-400">{settings?.contactPhone || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-2xl" />
            </div>
            <div>
              <p className="text-2xl font-bold font-grotesk">Write to us</p>
              <p className="text-gray-400">{settings?.contactEmail || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-2xl font-bold font-grotesk">Address</p>
              {settings?.addresses?.map((addr, i) => (
                <p key={i} className="text-gray-400 text-sm">{addr}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* Logo */}
<div className="md:col-span-3">
  <img 
    src={settings?.logo?.url || ""} 
    alt="Logo" 
    className="h-16 mb-6 bg-white p-2 rounded-2xl" 
  />
  
  <p className="text-gray-400 text-sm leading-relaxed">
    {settings?.siteName} is India’s trusted mobility partner offering
    seamless, safe, and reliable travel solutions across all major cities.
    From airport transfers to corporate travel, events, leisure trips, and
    outstation journeys — we provide a premium fleet with verified chauffeurs
    and 24/7 customer support to ensure a smooth travel experience.
  </p>
</div>


          <div className="md:col-span-3">
            <h3 className="text-xl font-bold font-grotesk mb-8 ">
              Mobility Solutions
            </h3>
            <div  >
              {services.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                    >
                 
                  <div className="mb-4">
                    <p className="font-semibold text-white group-hover:text-orange-400 transition">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links + Legal */}
          <div className="md:col-span-6">
            <div className="grid grid-cols-12">
              <div className="col-span-6">
                <h3 className="text-xl font-bold font-grotesk mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="hover:text-orange-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul></div>
              <div className="col-span-6">
                 <h3 className="text-xl font-bold font-grotesk  mb-6">Legal</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="hover:text-orange-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
              </div>
            </div>
 {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-xl font-bold font-grotesk mb-6">Subscribe Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-5 py-3 rounded-l-full bg-gray-900 text-white outline-none border border-gray-800"
              />
              <button className="bg-orange-500 px-6 py-3 rounded-r-full hover:bg-orange-600 transition font-bold">
                →
              </button>
            </div>
          </div>
           
          </div>

         
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} {settings?.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-2xl">
            {settings?.socials?.map((s) => {
              const Icon = {
                facebook: FaFacebookF,
                twitter: FaTwitter,
                instagram: FaInstagram,
                linkedin: FaLinkedinIn,
                youtube: FaYoutube,
              }[s.platform];
              return Icon ? (
                <a key={s._id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition">
                  <Icon />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
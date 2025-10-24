import React from "react";
import bgimg from '../../assets/connect/cta-box-bg.svg'; 
import carimg from '../../assets/connect/car.png'; 
export default function HeroSection() {
  return (
     <section
      className="relative py-16 bg-cover bg-center mx-20 rounded-3xl bg-no-repeat"
      style={{
        backgroundColor: '#000000',
        backgroundImage:
          `url(${bgimg})`,
      }}
    >
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl lg:text-5xl font-grotesk font-bold leading-tight">
              Book Your Perfect Ride Anytime, Anywhere with{" "}
              <span className="text-orange-400">Cabnex</span>
            </h1>
            <p className="text-lg font-grotesk text-gray-200 max-w-lg">
              Choose from a wide fleet of verified vehicles across India — from
              sedans to luxury coaches. Whether it’s city transfers, airport
              pickups, or long-distance trips, Cabnex ensures comfort, safety,
              and reliability at every mile.
            </p>
            <p className="text-md italic text-gray-300">
              “Trusted by travel partners and corporates across India for seamless car rental experiences.”
            </p>
           
          </div>

          {/* Right Image (optional future use) */}
          <div className="flex justify-center">
            <img
              src={carimg}
              alt="Car Rental"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

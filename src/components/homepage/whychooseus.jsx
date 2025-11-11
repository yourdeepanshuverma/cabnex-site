import React from 'react';
import mainimg from '../../assets/whychoose/why-choose-car-img.png';
import mainimgsec from '../../assets/whychoose/why-choose-img.jpg';
import { FaCar, FaHeadset, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaCar className="text-2xl" aria-hidden="true" />,
      title: "Extensive Fleet, Every Category Covered",
      description:
        "From hatchbacks to luxury sedans, MUVs, Urbania coaches, and tempo travellers — we offer the right vehicle for every itinerary. Whether it’s business travel, airport transfers, or leisure trips, Cabnex ensures comfort and reliability throughout.",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" aria-hidden="true" />,
      title: "Pickup & Drop at Your Convenience",
      description:
        "Available Pan India across major cities and airports. Choose flexible pickup and drop points for your guests, employees, or customers. Seamless access — just book and go.",
    },
    {
      icon: <FaHeadset className="text-2xl" aria-hidden="true" />,
      title: "24/7 Dedicated Support",
      description:
        "Our round-the-clock team is always available on call, WhatsApp, or chat to assist you with bookings, changes, and support. Ensuring smooth coordination for every ride, every time.",
    },
    {
      icon: <FaShieldAlt className="text-2xl" aria-hidden="true" />,
      title: "Safety, Reliability & Transparency",
      description:
        "Each vehicle is thoroughly inspected and insured. Transparent pricing, verified chauffeurs, and live tracking make every ride safe, predictable, and worry-free.",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 text-center">
        {/* Heading Section */}
        <div className="mb-8">
          <div className="linrr"></div>
          <span className="text-sm uppercase text-center font-grotesk text-orange-500 tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-3xl text-center md:text-5xl font-grotesk text-black font-extrabold sm:leading-14 mt-2 mb-12">
            Unmatched Quality <span className="text-orange-500">and Service</span> for Your Every Journey
          </h2>
        </div>

        {/* Content Section */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between">
          {/* Left Features */}
          <div className="flex flex-col space-y-6 w-full lg:w-1/3 lg:pr-4">
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 border-b border-gray-200"
              >
                <div className="flex-shrink-0 mt-2 feature-cion">{feature.icon}</div>
                <div className="text-left">
                  <h3 className="text-md md:text-xl font-grotesk mb-3 font-semibold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-[12px] md:text-md sm:leading-6 font-grotesk text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="relative w-full lg:w-1/3 px-8 mt-8 lg:mt-0 flex justify-center items-center">
            <img
              src={mainimgsec}
              alt="Car"
              className="relative z-10 h-[550px] w-full rounded-[200px] mx-auto shadow-lg"
            />
            <img
              src={mainimg}
              alt="Decorative Shape"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] z-99"
            />
          </div>

          {/* Right Features */}
          <div className="flex flex-col space-y-6 w-full lg:w-1/3 lg:pl-4 mt-8 lg:mt-0">
            {features.slice(2, 4).map((feature, index) => (
              <div
                key={index + 2}
                className="flex items-start space-x-4 p-4 border-b border-gray-200"
              >
                <div className="flex-shrink-0 mt-2 feature-cion">{feature.icon}</div>
                <div className="text-left">
                  <h3 className="text-md md:text-xl font-grotesk mb-3 font-semibold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-[12px] md:text-md sm:leading-6 font-grotesk text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;

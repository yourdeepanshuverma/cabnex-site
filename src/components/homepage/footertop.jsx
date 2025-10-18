import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import footerBg from "../../assets/footer/bg.webp";
import centralimg from '../../assets/footer/car.webp'

export default function CallToActionSection() {
  return (
    <section
      className="bg-cover relative bg-center py-6 px-6 rounded-lg flex items-center justify-between max-w-7xl mx-auto h-48"
       style={{
    backgroundImage: `url(${footerBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
    >
      {/* Left Text */}
      <div className="text-white z-10">
        <p className="text-sm font-grotesk  uppercase">If you need any car in rental</p>
        <h2 className="text-4xl mt-2 font-grotesk  font-bold">Give a Call to Autodune</h2>
      </div>
 {/* Absolutely Positioned Car Image in the Middle */}
      <div className="absolute bottom-[-109%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] z-9">
        <img
          src={centralimg}
          alt="Luxury Car"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Right Contact Info */}
      <div className="flex items-center space-x-2  z-10">
      
      <div className="bg-[#ffffffa4] flex justify-center items-center w-18 h-18 rounded-full">
        <div className="bg-white p-3 w-14 h-14  rounded-full  text-lg flex items-center justify-center">
             <FaPhoneAlt className="text-orange-500 text-2xl " />
       
        </div>
        </div>
        <div>
         <h5 className="text-xl text-white font-extrabold font-grotesk ">We are Available 24x7</h5>
        <p className="text-gray-300 text-md">+455 787 911 55</p>
       </div>
      </div>
    </section>
  );
}
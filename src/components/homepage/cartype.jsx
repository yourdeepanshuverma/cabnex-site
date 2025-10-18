import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCar,FaCarSide,FaArrowRight } from "react-icons/fa";

const carTypes = [
  { type: "Sedan", img: "public/cartype/sedan.webp" },
  { type: "Hatchback", img: "public/cartype/hatchback.jpg" },
  { type: "SUV", img: "public/cartype/suv.jpg" },
  { type: "Convertible", img: "public/cartype/convertible.jpg" },
  { type: "Coupe", img: "public/cartype/coupe.jpeg" },
  { type: "Electric", img: "public/cartype/electric.jpg" },
];

export default function CarTypesSection() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className=" bg-white  p-16">
      
      <div className="max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <span className="text-sm uppercase font-grotesk text-orange-500 tracking-widest">Categories</span>
 
        <h2 className="text-3xl md:text-5xl font-grotesk text-black font-extrabold leading-14 mt-2 mb-4">
          Explore <span className="text-orange-600">Our Car</span> Collection
        </h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Choose the perfect ride for your journey. From compact hatchbacks to luxurious SUVs, find a car that suits your style and comfort.
        </p>
      </div>

      {/* Slider */}
      <Slider {...settings}>
        {carTypes.map((car, i) => (
          <div key={i} className="p-4">
              <div className="flex justify-center md:justify-end overflow-hidden relative rounded-4xl ">
                     <img  src={car.img}
                alt={car.type}
                       className="w-full h-[280px] object-cover transition-all transform hover:scale-110  rounded-4xl"
                     />
                      <h3 className="absolute font-grotesk top-2 left-4 text-white text-md text-center font-semibold bg-black  px-4 right-4 py-1 rounded-4xl">
          {car.type}
        </h3>
                     {/* Optional Play Button overlay */}
                 
            <div className="absolute bottom-[-9px] bg-white left-[-9px] cartype w-22 h-22 flex items-center justify-center rounded-tr-[38px] cursor-pointer transition">
          <FaArrowRight className="text-[#303030] hover:text-white hover:bg-orange-500 text-3xl border border-orange-500 p-5 w-16 h-16 rounded-full transition-transform duration-500 hover:rotate-[-45deg]" />

             <div className="br-left-top">
               <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 fill-[#fff]">
                 <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
               </svg>
             </div>
           
             <div className="br-right-bottom">
               <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 fill-[#fff]">
                 <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
               </svg>
             </div>
           </div>
                     </div>
          </div>
        ))}
      </Slider>
      </div>
    </section>
  );
}
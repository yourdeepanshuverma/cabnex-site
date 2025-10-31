import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaCarSide } from 'react-icons/fa';
import Searchsection from '../homepage/SearchSection'
import bannerone from "../../assets/banner/banner1.png";
import bannerTwo from "../../assets/banner/banner2.png";
import bannerthree from "../../assets/banner/banner3.png";
const BannerSlider = () => {
  // State to control animation trigger
  const [activeSlide, setActiveSlide] = useState(0);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    appendDots: (dots) => (
      <div className="pb-4">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white rounded-full opacity-50 hover:opacity-100 transition-opacity"></div>
    ),
    beforeChange: () => {
      setActiveSlide(-1); // Reset active slide to hide animations before transition
    },
    afterChange: (current) => {
      setActiveSlide(current); // Set active slide to trigger animations
    },
  };

  // Enhanced slide content
  const slides = [
    {
      image: bannerone,
      title: 'Explore South India with Cabnex',
      description: 'From Kerala’s tranquil backwaters and Tamil Nadu’s ancient temples to Karnataka’s coffee hills and Andhra’s iconic Ramoji Film City — discover every destination with comfort and care.',
    },
    {
      image: bannerTwo,
      title: 'Travel in Comfort, Arrive in Style',
      description: 'Whether it’s a corporate trip, airport transfer, or holiday getaway, our modern fleet and professional chauffeurs ensure every journey is seamless.',
    },
    {
      image: bannerthree,
      title: 'Discover. Experience. Connect.',
      description: 'From business to leisure, Cabnex offers curated rides, excursions, and activity experiences designed to make every trip memorable.',
    },
  ];

  const lines = [
    "Affordable car rental — available day & night",
    "Daily & long-term rental plans",
    "Hatchback · Sedan · SUV available",
    "Pickup & drop-off services",
    "24/7 roadside assistance",
    "Clean cars with professional drivers",
  ];

  return (
    <div className="banner-slider w-full max-w-[1920px] mx-auto relative">
      <div className="marquee-wrapper overflow-hidden">
        <div className="marquee-horizontal">
          <div className="marquee-track">
            {lines.map((text, idx) => (
              <div className="marquee-item" key={`a-${idx}`}>
                <FaCarSide className="marquee-icon" />
                <span>{text}</span>
              </div>
            ))}
            {lines.map((text, idx) => (
              <div className="marquee-item" key={`b-${idx}`}>
                <FaCarSide className="marquee-icon" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="outline-none">
              <div
                className="h-[60vh] lg:h-dvh pb-22 w-full bg-cover bg-center relative flex items-center justify-start"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-[#00000063]"></div>
                <div className="relative z-10 w-full max-w-7xl px-4 md:px-28">
                  <h1
                    className={`text-3xl md:text-5xl font-[800] font-grotesk text-white mb-4 text-shadow-md ${
                      activeSlide === index ? 'animate-heading' : 'reset-animation'
                    }`}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={`text-lg md:text-xl text-white max-w-xl ${
                      activeSlide === index ? 'animate-description' : 'reset-animation-description'
                    }`}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
       <div className="lg:absolute lg:top-[52%] lg:left-[-20px] w-full ">
         <Searchsection/>
       </div>
      </div>
    </div>
  );
};

export default BannerSlider;
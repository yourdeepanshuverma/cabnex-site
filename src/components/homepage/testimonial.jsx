import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar ,FaQuoteLeft } from "react-icons/fa";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

export default function TestimonialSection() {
  const { settings } = useWebsiteSettings();

  const staticTestimonials = [
    {
      name: "Rohit Sharma",
      review: "Amazing experience! The sedan was spotless and drove smoothly throughout my journey. The booking process was quick and hassle-free, and the support team ensured I had everything I needed. Highly satisfied with the service!",
      img: "src/assets/testimonials/rohit.jpg",
      custumer: "Customer",
      rating: 5,
    },
    {
      name: "Priya Verma",
      review: "Loved the SUV I rented. It was spacious, extremely comfortable, and perfect for our long family vacation. The kids enjoyed the ride, and the car’s reliability gave us peace of mind during the entire trip. Would definitely rent again!",
      img: "src/assets/testimonials/priya.jpeg",
      custumer: "Customer",
      rating: 5,
    },
    {
      name: "Arjun Mehta",
      review: "The convertible made my weekend getaway truly unforgettable. Driving with the top down was an amazing experience, and the car’s performance was excellent. The service was prompt, and I felt like everything was handled professionally.",
      img: "src/assets/testimonials/arjun.jpg",
      custumer: "Customer",
      rating: 5,
    },
    {
      name: "Sneha Kapoor",
      review: "The electric car was a game-changer for me. The ride was incredibly smooth, silent, and eco-friendly. I loved the modern features and fast charging support. It’s refreshing to see such sustainable options in car rentals.",
      img: "src/assets/testimonials/dneha.jpg",
      custumer: "Customer",
      rating: 5,
    },
  ];

  const testimonials = settings?.reviews && settings.reviews.length > 0 
    ? settings.reviews.map(review => ({
        name: review.name,
        review: review.comment,
        img: review.profile.url,
        custumer: review.role,
        rating: review.rating,
      }))
    : staticTestimonials;

  const sliderSettings = {
    dots: false,
    infinite: true,
    nav: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-white testi sm:p-16 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div class="linrr"></div>
          <span className="text-sm uppercase font-grotesk text-orange-500 tracking-widest">
            Testimonials
          </span>
          <h2 className="text-[30px] md:text-5xl font-grotesk text-black font-extrabold md:leading-14 mt-2 mb-4">
            What Our <span className="text-orange-600">Customers</span> Say
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Hear from our happy customers about their experiences with our cars and services.
          </p>
        </div>

        {/* Slider */}
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-4">
              <div className="bg-gray-100 rounded-4xl  p-6 relative shadow-sm min-h-64">
                {/* Testimonial Content */}
                <div className="text-start  mb-12">
                 
                  <FaQuoteLeft className="text-orange-500 text-4xl MB-2 mr-2" />
                  <p className="text-slate-600 mt-2 text-sm ">
                    "{testimonial.review}"
                  </p>
                   <div className="absolute bottom-2 left-[30%] md:left-[28%] ">
                    <h3 className="font-grotesk text-lg font-semibold text-black">
                    {testimonial.name}
                  </h3>
                  <p className="font-grotesk">{testimonial.custumer}</p>
                   </div>
                </div>
                {/* Image in place of arrow icon */}
                <div className="absolute bottom-[-9px] bg-white left-[-9px] cartest w-22 h-22 flex items-center justify-center rounded-tr-[38px] cursor-pointer transition">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border border-orange-500"
                  />
                  <div className="br-left-top">
                    <svg
                      viewBox="0 0 11 11"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-11 h-11 fill-[#fff]"
                    >
                      <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
                    </svg>
                  </div>
                  <div className="br-right-bottom">
                    <svg
                      viewBox="0 0 11 11"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-11 h-11 fill-[#fff]"
                    >
                      <path d="M11 0L0 0L0 11C0 5 5 0 11 0Z" />
                    </svg>
                  </div>
                </div>
                 {/* Image in place of arrow icon */}
                <div className="absolute top-[0px] bg-white right-[0px] car-star w-32 h-10 flex items-center justify-center rounded-bl-[25px] cursor-pointer transition">
               <div className="flex space-x-1">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
               <div class="shap-left-top">
                                    <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                        <path d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z" fill="#fff"></path>
                                    </svg>
                                </div>
                                <div class="shap-right-bottom">
                                    <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                        <path d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z" fill="#FFF"></path>
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
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaClock, FaHotel, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { api } from "../../api/api-config";
import BookingModal from "../BookingModal";

export default function HolidayDealsSlick() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/api/v1/package/travel");
        const fetchedSlides = response.data.data.map((pkg) => ({
          title: pkg.name || "Unnamed Package",
          days: `${pkg.days} Days / ${pkg.nights} Nights`,
          stay: `Stay in ${pkg.place || "Destination"}`,
          price: `₹${pkg.price || "0"}`,
          img: pkg.image?.url || "https://via.placeholder.com/1400",
        }));
        setSlides(fetchedSlides);
        setLoading(false);
      } catch (err) {
        setError("Failed to load packages. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPackages();
  }, []);

  const openModal = (title) => {
    setSelectedPackage(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPackage(null);
  };

  // ✅ Responsive slider settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablet and below
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
          arrows: false, // hide arrows on mobile
        },
      },
    ],
  };

  if (loading)
    return (
      <section className="max-w-7xl mx-auto py-16">
        <div className="text-center">Loading packages...</div>
      </section>
    );

  if (error)
    return (
      <section className="max-w-7xl mx-auto py-16">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );

  return (
    <>
      <section className="max-w-7xl mx-auto py-10 md:py-16">
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Text Section */}
            <div className="md:w-1/3 p-4 flex flex-col justify-center">
              <span className="text-sm uppercase font-grotesk text-orange-500 tracking-widest">
                Adventure Awaits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Escape, Explore &{" "}
                <span className="text-orange-500">Experience More</span>
              </h2>
              <p className="mt-3 text-gray-600 text-base">
                Discover handpicked holiday packages — from serene beach escapes
                to thrilling mountain treks and vibrant city getaways. Customize
                your trip and save with early-bird offers.
              </p>
              <div className="mt-6">
                <Link
                  to="/explore-packages"
                  className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Explore Packages <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Right Slider Section */}
            <div className="md:w-2/3 p-2 md:p-4">
              <Slider {...settings}>
                {slides.map((s, i) => (
                  <div key={i} className="relative group px-2">
                    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden">
                      <img
                        src={s.img}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 right-0 bg-black/50 p-4">
                        <h3 className="text-white font-grotesk font-semibold text-md flex items-center gap-2">
                          <FaStar className="text-orange-500 bg-white p-3 w-10 h-10 rounded-4xl" />{" "}
                          {s.title}
                        </h3>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out p-6 rounded-b-3xl">
                        <p className="text-white flex items-center gap-2 text-sm">
                          <FaClock /> {s.days}
                        </p>
                        <p className="text-white flex items-center gap-2 mt-2 text-sm">
                          <FaHotel /> {s.stay}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-orange-500 bg-white rounded-4xl px-4 py-2 font-grotesk font-semibold text-sm flex items-center gap-1">
                            {s.price}
                          </span>
                          <button
                            onClick={() => openModal(s.title)}
                            className="px-4 py-2 cursor-pointer bg-orange-500 text-white text-sm rounded-full font-semibold hover:bg-orange-600 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        packageTitle={selectedPackage}
      />
    </>
  );
}

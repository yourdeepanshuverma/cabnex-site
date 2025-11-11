// pages/CarListing.jsx
import Header from "../components/header";
import Footer from "../components/footer";
import bg from "../assets/carlisting/page-header-bg.jpg";
import SearchSection from "../components/homepage/SearchSection";
import CarListingPage from "../components/carlisting/carfilter";
import SearchSummary from "../components/carlisting/SearchSummary";
import { useState } from "react";

const CarListing = () => {
  const [showSearch, setShowSearch] = useState(false);

  const handleUpdateSearch = () => {
    setShowSearch(false);
  };

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <div
        className="flex flex-col sm:h-[450px] relative rounded-b-4xl items-center justify-center"
        style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60 rounded-b-4xl"></div>
        <div className="relative text-center z-10 pt-28 sm:pt-0 px-6 md:px-12">
          <h1 className="text-[30px] text-white md:text-5xl font-bold mb-4">
            Find Your Perfect Ride
          </h1>
          <p className="text-sm md:text-md text-gray-100 mb-8 max-w-2xl mx-auto">
            Explore a wide range of cars available for rent and purchase — from luxury sedans to budget-friendly options.
            Compare prices, check features, and drive your dream car today!
          </p>
        </div>
      </div>

      {/* Pre-filled Summary + Modify Button */}
      <div className="max-w-7xl mx-auto px-4 -mt-34 relative z-20">
        <SearchSummary onModify={() => setShowSearch(true)} />
      </div>

      {/* Modify Search Form */}
      {showSearch && (
        <div className="max-w-7xl mx-auto px-4 mb-8 -mt-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold font-grotesk text-orange-600">
                Modify Your Search
              </h3>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                x
              </button>
            </div>
            <SearchSection isUpdate={true} onUpdateComplete={handleUpdateSearch} />
          </div>
        </div>
      )}

      {/* Car Listing */}
      <CarListingPage />

      <Footer />
    </>
  );
};

export default CarListing;
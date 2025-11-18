import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

const iconMap = {
  CheckCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  BriefcaseIcon,
  CalendarIcon,
};

const ListingPage = () => {
  const { searchResult, setSearchResult, setSearchFormData, searchFormData } =
    useSearch();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    distance: "-",
    time: "-",
    serviceType: "Rental Trip",
    city: "",
    showTime: true,
    showAdults: true,
  });
  const [isActivity, setIsActivity] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    let result = searchResult;
    if (!result || !result.success) {
      const stored = sessionStorage.getItem("lastSearch");
      if (stored) {
        result = JSON.parse(stored);
        setSearchResult(result);
      }
    }

    if (result && result.success && result.data) {
      const currentServiceType = searchFormData.serviceType || "rental";

      if (currentServiceType === "activity" || result.data.activities) {
        setIsActivity(true);
        const activities = result.data.activities || [];
        setSummary({
          total: activities.length,
          distance: "-",
          time: "-",
          serviceType: "ACTIVITY TRIP",
          city: result.data.city
            ? result.data.city.charAt(0).toUpperCase() +
              result.data.city.slice(1)
            : "",
          showTime: false,
          showAdults: false,
        });

        const mappedActivities = activities.map((act, idx) => {
          const activityData = act._doc || act;
          return {
            id: activityData._id || idx,
            type: "activity",
            image:
              activityData.images && activityData.images.length > 0
                ? activityData.images[0].url
                : "https://via.placeholder.com/300x200?text=Activity+Image",
            name: activityData.title || "Unnamed Activity",
            description: activityData.description || "No description available",
            actualPrice:
              activityData.pricingOptions &&
              activityData.pricingOptions.length > 0
                ? activityData.pricingOptions[0].price
                : activityData.price || 0,
            inclusions:
              activityData.includes && activityData.includes.length > 0
                ? activityData.includes
                : [
                    { text: "Guided Tour", icon: "CheckCircleIcon" },
                    { text: "Entry Fees Included", icon: "MapPinIcon" },
                  ],
            cancellationPolicy:
              activityData.cancellationPolicy || "Non-refundable",
          };
        });

        setItems(mappedActivities);
        setFilteredItems(mappedActivities);
      } else {
        setIsActivity(false);
        const { data } = result;

        // TRANSFER ME SAB HATADO
        const isTransfer = currentServiceType === "transfer";
        setSummary({
          total: data.categories ? data.categories.length : 0,
          distance: data.distance || "-",
          time: isTransfer
            ? "-"
            : data.time
            ? `${Math.floor(data.time / 60)} hrs`
            : "-",
          serviceType:
            currentServiceType.toUpperCase().replace(/_/g, " ") + " TRIP",
          city: "",
          showTime: !isTransfer,
          showAdults: !isTransfer,
        });

        const mappedCars = (data.categories || [])
          .map((cat, idx) => {
            if (!cat || !cat.type || !cat.type.category) return null;

            const categoryName = cat.type.category
              .replace(/-/g, " ")
              .toUpperCase();
            const marketFare = cat.marketFare || 0;
            const baseFare = cat.baseFare || 0;
            const totalAmount = cat.totalAmount || 0;
            const perKmCharge = cat.perKmCharge || 0; // Add this line

            let seats = "5 Seats";
            if (categoryName.includes("HATCH")) seats = "4 Seats";
            if (categoryName.includes("SEDAN")) seats = "5 Seats";
            if (
              categoryName.includes("SUV") ||
              categoryName.includes("MINIVAN")
            )
              seats = "7 Seats";

            return {
              id: cat._id || idx,
              type: "car",
              image:
                cat.type.image?.url ||
                "https://via.placeholder.com/300x200?text=Car+Image",
              name: categoryName,
              features: ["AC", "Automatic", "Petrol", seats],
              marketFare,
              baseFare,
              perKmCharge,
              actualPrice: Math.round(totalAmount),
              seats,
              description: `Market Rate: ₹${marketFare}/km | Total: ₹${Math.round(
                totalAmount
              )}`,
              inclusions: [
                { text: "24/7 Roadside Assistance", icon: "CheckCircleIcon" },
                { text: "Free Cancellation", icon: "ArrowPathIcon" },
                ...(cat.freeKmPerDay
                  ? [
                      {
                        text: `Free ${cat.freeKmPerDay} Km included. After that ₹${cat.extraKmCharge}/Km`,
                        icon: "MapPinIcon",
                      },
                    ]
                  : []),
                ...(cat.perHourCharge
                  ? [
                      {
                        text: `Extra Hour: ₹${cat.perHourCharge}/Hr`,
                        icon: "ClockIcon",
                      },
                    ]
                  : []),
                ...(cat.driverAllowance
                  ? [
                      {
                        text: `Driver Allowance: ₹${cat.driverAllowance}`,
                        icon: "BriefcaseIcon",
                      },
                    ]
                  : []),
                ...(cat.nightCharge
                  ? [
                      {
                        text: `Night Charge: ₹${cat.nightCharge}`,
                        icon: "CalendarIcon",
                      },
                    ]
                  : []),
              ],
            };
          })
          .filter(Boolean);

        setItems(mappedCars);
        setFilteredItems(mappedCars);
      }
    } else {
      setItems([]);
      setFilteredItems([]);
    }
  }, [searchResult, setSearchResult]);

  useEffect(() => {
    if (items.length === 0 || items[0].type === "activity") {
      setFilteredItems(items);
      return;
    }

    let tempItems = [...items];
    tempItems = tempItems.filter(
      (item) =>
        item.actualPrice >= priceRange[0] && item.actualPrice <= priceRange[1]
    );
    if (selectedSeats.length > 0) {
      tempItems = tempItems.filter((item) =>
        selectedSeats.includes(item.seats)
      );
    }
    if (selectedCategories.length > 0) {
      tempItems = tempItems.filter((item) =>
        selectedCategories.includes(item.name)
      );
    }
    setFilteredItems(tempItems);
    setCurrentPage(1);
  }, [priceRange, selectedSeats, selectedCategories, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filteredItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="listing-head mb-6 mt-8 sm:mt-0">
        <h3 className="text-2xl sm:text-4xl font-extrabold font-grotesk">
          {summary.total} {isActivity ? "Activities" : "Cars"} Available
        </h3>
        <ul className="flex flex-wrap mt-2 gap-3 text-sm sm:text-lg text-gray-700">
          <li className="font-grotesk font-semibold">{summary.serviceType}</li>
          {isActivity ? (
            <li className="font-grotesk font-semibold">City: {summary.city}</li>
          ) : (
            <>
              <li className="font-grotesk font-semibold">
                Total Distance: {summary.distance} km
              </li>

              {/* Estimated Time – Sirf non-transfer me */}
              {summary.showTime && (
                <li className="font-grotesk font-semibold">
                  Estimated Time: {summary.time}
                </li>
              )}

              {/* 2 Adults – Sirf non-transfer me */}
              {summary.showAdults && (
                <li className="font-grotesk font-semibold">2 Adults</li>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="flex gap-6 relative">
        {/* Desktop Filters */}
        {!isActivity && (
          <aside className="hidden lg:block w-1/4">
            <div className="sticky top-0">
              <div className="bg-[#F5F5F6] rounded-2xl p-5 border border-gray-200">
                {/* <div className="bg-white p-4 rounded-2xl mb-4">
                  <div className="flex items-center border-b border-gray-300 pb-3">
                    <div className="bg-blue-100 rounded-full p-2 mr-2">
                      <FunnelIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Filters</h2>
                  </div>
                  <div className="mt-3 relative">
                    <input
                      type="text"
                      placeholder="Search ......"
                      className="w-full bg-[#F5F5F6] border-none rounded-full py-2 px-4 text-md pl-10"
                      style={{ borderRadius: "30px" }}
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div> */}
                <div className="space-y-3">
                  <div className="bg-white px-4 pt-4 pb-1 rounded-2xl mb-4">
                    <FilterSection
                      title="Price Range"
                      defaultOpen={true}
                      icon={CurrencyDollarIcon}
                    >
                      <div className="py-3">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </FilterSection>
                  </div>

                  <div className="bg-white px-4 pt-4 pb-1 rounded-2xl mb-4">
                    <FilterSection
                      title="Seats"
                      defaultOpen={true}
                      icon={FunnelIcon}
                    >
                      {["4 Seats", "5 Seats", "7 Seats"].map((seat) => (
                        <label key={seat} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSeats.includes(seat)}
                            onChange={(e) =>
                              e.target.checked
                                ? setSelectedSeats([...selectedSeats, seat])
                                : setSelectedSeats(
                                    selectedSeats.filter((s) => s !== seat)
                                  )
                            }
                            className="accent-blue-600"
                          />
                          <span>{seat}</span>
                        </label>
                      ))}
                    </FilterSection>
                  </div>

                  <div className="bg-white px-4 pt-4 pb-1 rounded-2xl mb-4">
                    <FilterSection
                      title="Car Category"
                      defaultOpen={false}
                      icon={FunnelIcon}
                    >
                      {[
                        "HATCH BACK",
                        "PREMIUM SEDAN",
                        "SUV",
                        "SEDAN",
                        "MINIVAN",
                      ].map((cat) => (
                        <label key={cat} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) =>
                              e.target.checked
                                ? setSelectedCategories([
                                    ...selectedCategories,
                                    cat,
                                  ])
                                : setSelectedCategories(
                                    selectedCategories.filter((c) => c !== cat)
                                  )
                            }
                            className="accent-blue-600"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </FilterSection>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={isActivity ? "w-full" : "w-full lg:w-3/4 space-y-6"}>
          {filteredItems.length === 0 ? (
            <div className="text-center mt-24 text-xl sm:text-2xl font-grotesk text-gray-600">
              {isActivity
                ? "No activities available for this location. Try another city!"
                : "No cars match your filters. Try adjusting them!"}
            </div>
          ) : (
            <>
              {currentFilteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  serviceType={searchFormData.serviceType || "rental"}
                />
              ))}
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md font-grotesk text-sm ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500"
                      : "bg-orange-500 text-white hover:bg-black"
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md font-grotesk text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500"
                      : "bg-orange-500 text-white hover:bg-black"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>

        {/* Mobile Filter Button */}
        {!isActivity && (
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg z-40 hover:bg-black transition"
          >
            <FunnelIcon className="h-6 w-6" />
          </button>
        )}

        {/* Mobile Filter Drawer */}
        {!isActivity && (
          <div
            className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FunnelIcon className="h-6 w-6 text-orange-500" />
                Filters
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-5 space-y-6 overflow-y-auto h-full pb-20">
              <div className="relative">
                {/* <input
                  type="text"
                  placeholder="Search cars..."
                  className="w-full bg-gray-100 rounded-full py-3 px-4 pl-12 text-sm"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
               */}
              </div>

              <FilterSection
                title="Price Range"
                defaultOpen={true}
                icon={CurrencyDollarIcon}
              >
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </FilterSection>

              <FilterSection
                title="Seats"
                defaultOpen={false}
                icon={FunnelIcon}
              >
                {["4 Seats", "5 Seats", "7 Seats"].map((seat) => (
                  <label key={seat} className="flex items-center gap-3 py-1">
                    <input
                      type="checkbox"
                      checked={selectedSeats.includes(seat)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedSeats([...selectedSeats, seat])
                          : setSelectedSeats(
                              selectedSeats.filter((s) => s !== seat)
                            )
                      }
                      className="accent-orange-500"
                    />
                    <span className="text-sm">{seat}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection
                title="Car Category"
                defaultOpen={false}
                icon={FunnelIcon}
              >
                {["HATCH BACK", "SEDAN", "PREMIUM SEDAN", "SUV", "MINIVAN"].map(
                  (cat) => (
                    <label key={cat} className="flex items-center gap-3 py-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedCategories([
                                ...selectedCategories,
                                cat,
                              ])
                            : setSelectedCategories(
                                selectedCategories.filter((c) => c !== cat)
                              )
                        }
                        className="accent-orange-500"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  )
                )}
              </FilterSection>
            </div>
          </div>
        )}

        {isFilterOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

const FilterSection = ({ title, defaultOpen, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full font-semibold"
      >
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-2">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <span>{title}</span>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="space-y-2 mt-2">{children}</div>}
    </div>
  );
};

const ItemCard = ({ item, serviceType }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { searchResult, setSearchFormData } = useSearch();

  const handleBookNow = () => {
    if (item.type === "activity") {
      const originalActivity = searchResult?.data?.activities?.find(
        (act) => (act._doc?._id || act._id) === item.id
      );

      const bookingItem = {
        ...item,
        // Ensure the full activity data is passed, handling the _doc structure
        data: originalActivity?._doc || originalActivity,
      };

      navigate("/booking-details", { state: { item: bookingItem } });
    } else {
      // Existing logic for car bookings
      setSearchFormData((prev) => ({
        ...prev,
        distance: searchResult.data?.distance || 0,
      }));

      const originalCategory = searchResult?.data?.categories?.find(
        (cat) => cat._id === item.id
      );

      const bookingItem = {
        ...item,
        data: {
          categories: [originalCategory],
        },
      };

      navigate("/booking-details", { state: { item: bookingItem } });
    }
  };

  if (item.type === "activity") {
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition ">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="h-48 bg-[#F5F5F6] rounded-t-2xl flex items-center justify-center p-4">
            <img
              src={item.image}
              alt={item.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Activity+Image";
              }}
            />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="text-xl font-extrabold font-grotesk">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
            <p className="text-xs text-gray-500">
              Cancellation: {item.cancellationPolicy}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-extrabold font-grotesk">
                ₹{item.actualPrice.toLocaleString("en-IN")}
              </p>
              <button
                onClick={handleBookNow}
                className="bg-orange-500 hover:bg-black text-white px-6 py-2 rounded-full text-sm font-grotesk font-bold"
              >
                Book Now
              </button>
            </div>
            {item.inclusions.length > 0 && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3 text-sm font-medium"
                >
                  <span>View Inclusions</span>
                  <ChevronRightIcon
                    className={`h-5 w-5 transition-transform ${
                      showDetails ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {showDetails && (
                  <div className="border-t pt-3 space-y-2">
                    <h4 className="font-bold text-orange-500">Inclusions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {item.inclusions.map((inc, i) => {
                        const IconComponent = iconMap[inc.icon];
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            {IconComponent ? (
                              <IconComponent className="h-6 w-6 text-[#5143D9]" />
                            ) : (
                              <div className="h-6 w-6 bg-gray-300 rounded-full" />
                            )}
                            <span className="font-grotesk font-medium">
                              {inc.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 mb-4 p-3">
          <div className="w-1/4 bg-[#F5F5F6] rounded-2xl px-5 py-7 h-40 flex justify-center items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto max-h-full object-contain"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Activity+Image";
              }}
            />
          </div>
          <div className="w-3/4 pt-1">
            <h3 className="text-3xl font-grotesk font-extrabold mb-2">
              {item.name}
            </h3>
            <p className="mt-2 text-gray-600">{item.description}</p>
            <p className="mt-2 text-gray-600 font-semibold">
              Cancellation Policy: {item.cancellationPolicy}
            </p>
            <p className="mt-2 text-2xl font-grotesk font-bold text-black">
              ₹{item.actualPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex justify-end">
          <button
            onClick={handleBookNow}
            className="hover:bg-black w-[30%] bg-orange-500 text-white rounded-4xl px-8 py-3 text-md font-grotesk font-semibold mt-2"
          >
            Book Now
          </button>
        </div>
        {item.inclusions.length > 0 && (
          <>
            <div className="hidden lg:flex bg-[#F5F5F6] items-center rounded-md px-2 py-2">
              <div className="w-3/4 text-gray-600">More details</div>
              <div className="w-1/4 text-right">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="bg-black text-white p-1 rounded-md"
                >
                  <ChevronDownIcon
                    className={`h-6 w-6 transition-transform ${
                      showDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            {showDetails && (
              <div className="hidden lg:block mt-4 border-t pt-2">
                <h4 className="font-semibold text-2xl text-orange-500 mb-2">
                  Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.inclusions.map((inc, i) => {
                    const IconComponent = iconMap[inc.icon];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        {IconComponent ? (
                          <IconComponent className="h-8 w-8 text-[#5143D9]" />
                        ) : (
                          <span className="h-8 w-8 text-[#5143D9]">[Icon]</span>
                        )}
                        <span className="font-grotesk text-black text-md font-semibold">
                          {inc.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition l">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="h-48 bg-[#F5F5F6] rounded-t-2xl flex items-center justify-center p-4">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=Car+Image";
            }}
          />
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-xl font-extrabold font-grotesk">{item.name}</h3>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-700">
            {item.features.map((f, i) => (
              <span key={i}>
                {f}
                {i < item.features.length - 1 && " • "}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            Market: ₹{item.marketFare}/km • Base: ₹{item.baseFare}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-extrabold font-grotesk">
              ₹{item.actualPrice.toLocaleString("en-IN")}
            </p>
            <button
              onClick={handleBookNow}
              className="bg-orange-500 hover:bg-black text-white px-6 py-2 rounded-full text-sm font-grotesk font-bold"
            >
              Book Now
            </button>
          </div>
          {item.inclusions.length > 0 && (
            <>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3 text-sm font-medium"
              >
                <span>View Inclusions</span>
                <ChevronRightIcon
                  className={`h-5 w-5 transition-transform ${
                    showDetails ? "rotate-90" : ""
                  }`}
                />
              </button>
              {showDetails && (
                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-bold text-orange-500">Inclusions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {item.inclusions.map((inc, i) => {
                      const IconComponent = iconMap[inc.icon];
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          {IconComponent ? (
                            <IconComponent className="h-6 w-6 text-[#5143D9]" />
                          ) : (
                            <div className="h-6 w-6 bg-gray-300 rounded-full" />
                          )}
                          <span className="font-grotesk font-medium">
                            {inc.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6 mb-4">
        <div className="w-1/4 bg-[#F5F5F6] rounded-2xl px-5 py-7 h-40 flex justify-center items-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-auto max-h-full object-contain"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=Car+Image";
            }}
          />
        </div>
        <div className="w-1/2 pt-1">
          <h3 className="text-3xl font-grotesk font-extrabold mb-2">
            {item.name}
          </h3>
          <ul className="flex flex-wrap gap-4 text-gray-600 text-sm">
            {item.features.map((f, i) => (
              <li
                key={i}
                className="flex text-lg font-bold font-grotesk items-center"
              >
                {f}
                {i < item.features.length - 1 && (
                  <span className="mx-2">•</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-gray-600">{item.description}</p>
        </div>
        <div className="w-1/4 flex flex-col justify-center items-end text-right border-l border-[#d4d4d4]">
          {serviceType !== "transfer" && (
            <div className="flex gap-2">
              <p className="text-gray-600 font-grotesk line-through">
                ₹{item.marketFare}/km
              </p>
              <p className="text-red-600">Per Km: ₹{item.perKmCharge}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-3xl font-grotesk font-extrabold text-black">
              ₹{item.actualPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={handleBookNow}
            className="hover:bg-black w-[80%] bg-orange-500 text-white rounded-4xl px-8 py-3 text-md font-grotesk font-semibold mt-2"
          >
            Book Now
          </button>
        </div>
      </div>
      <div className="hidden lg:flex bg-[#F5F5F6] items-center rounded-md px-2 py-2">
        <div className="w-3/4 text-gray-600">More details</div>
        <div className="w-1/4 text-right">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-black text-white p-1 rounded-md"
          >
            <ChevronDownIcon
              className={`h-6 w-6 transition-transform ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="hidden lg:block mt-4 border-t pt-2">
          <h4 className="font-semibold text-2xl text-orange-500 mb-2">
            Inclusions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {item.inclusions.map((inc, i) => {
              const IconComponent = iconMap[inc.icon];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  {IconComponent ? (
                    <IconComponent className="h-8 w-8 text-[#5143D9]" />
                  ) : (
                    <span className="h-8 w-8 text-[#5143D9]">[Icon]</span>
                  )}
                  <span className="font-grotesk text-black text-md font-semibold">
                    {inc.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;

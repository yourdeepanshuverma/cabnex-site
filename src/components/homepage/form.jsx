import React, { useState } from "react";
import { FaExchangeAlt, FaPlus } from "react-icons/fa";

export default function FlightForm() {
  const [tripType, setTripType] = useState("One Way");
  const [additionalTos, setAdditionalTos] = useState([]);
  const [selectedFare, setSelectedFare] = useState("Regular");

  const handleAddCity = () => {
    setAdditionalTos([...additionalTos, ""]);
  };

  const handleToChange = (index, value) => {
    const newTos = [...additionalTos];
    newTos[index] = value;
    setAdditionalTos(newTos);
  };

  const fareTooltips = {
    Regular: "Benefit: Standard pricing with no additional discounts.",
    Student: "Benefit: Extra discounts up to 10% + additional baggage allowance.",
    "Senior Citizen": "Benefit: Up to ₹600 off + priority boarding for seniors.",
    "Armed Forces": "Benefit: Up to ₹600 off + exclusive military support services.",
    "Doctor & Nurses": "Benefit: Up to ₹600 off + complimentary health kit on board.",
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6">
      {/* Trip Type */}
      <div className="flex bg-white justify-between shadow-2xl sm:shadow-none p-1 sm:bg-transparent  sm:flex-row gap-4 sm:gap-6 mb-4 text-sm text-gray-700">
        <label
          className={`flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-sm sm:rounded-4xl text-sm sm:text-md font-bold text-black transition-colors ${
            tripType === "One Way" ? "bg-blue-100" : ""
          }`}
        >
          <input
            type="radio"
            name="trip"
            checked={tripType === "One Way"}
            onChange={() => setTripType("One Way")}
          />{" "}
          One Way
        </label>
        <label
          className={`flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-sm sm:rounded-4xl text-sm sm:text-md font-bold text-black transition-colors  ${
            tripType === "Round Trip" ? "bg-blue-100" : ""
          }`}
        >
          <input
            type="radio"
            name="trip"
            checked={tripType === "Round Trip"}
            onChange={() => setTripType("Round Trip")}
          />{" "}
          Round Trip
        </label>
        <label
          className={`flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-sm sm:rounded-4xl text-sm sm:text-md font-bold text-black transition-colors  ${
            tripType === "Multi City" ? "bg-blue-100" : ""
          }`}
        >
          <input
            type="radio"
            name="trip"
            checked={tripType === "Multi City"}
            onChange={() => setTripType("Multi City")}
          />{" "}
          Multi City
        </label>
        <span className="hidden sm:block sm:ml-auto text-sm text-gray-500 text-center sm:text-right">
          Book International and Domestic Flights
        </span>
      </div>

      {/* Main Row */}
      <div className="space-y-4">
        {/* Initial Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:border sm:border-gray-200 sm:rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row w-full sm:w-1/2 relative">
            {/* From */}
            <div className="py-3 px-4 border-b sm:border-b-0 sm:border-r border-gray-200 w-full sm:w-1/2">
              <p className="text-md text-gray-500 mb-2">From</p>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full font-semibold text-2xl sm:text-4xl pb-2 text-gray-800 outline-none"
              />
            </div>

            {/* Swap Icon */}
            <div className=" absolute border-gray-200 justify-center items-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-full p-1 cursor-pointer sm:block hidden">
              <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <FaExchangeAlt className="text-blue-600" />
              </button>
            </div>

            {/* To with Add City */}
            <div className="py-3 px-4 sm:pl-7 border-t sm:border-t-0 sm:border-r border-gray-200 w-full sm:w-1/2">
              <p className="text-md text-gray-500 mb-2">To</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter City"
                  className="w-full font-semibold text-2xl sm:text-4xl pb-2 text-gray-800 outline-none"
                />
                {tripType === "Multi City" && (
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                    onClick={handleAddCity}
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
              {tripType === "Multi City" &&
                additionalTos.map((to, index) => (
                  <div key={index} className="mt-2">
                    <input
                      type="text"
                      placeholder="Add another city"
                      value={to}
                      onChange={(e) => handleToChange(index, e.target.value)}
                      className="w-full font-semibold text-2xl sm:text-4xl pb-2 text-gray-800 outline-none"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between w-full sm:w-1/2">
            <div className="flex flex-col sm:flex-row justify-between w-full sm:w-1/3">
              {/* Departure */}
              <div className="py-3 px-4 sm:pl-7 border-t sm:border-t-0 sm:border-r border-gray-200 w-full sm:w-full">
                <p className="text-md text-gray-500 mb-2">Departure</p>
                <input
                  type="date"
                  className="w-full font-semibold text-base pb-1 text-gray-600 outline-none"
                />
              </div>

              {/* Return */}
              <div className="py-3 px-4 sm:pl-7 border-t sm:border-t-0 sm:border-r border-gray-200 w-full sm:w-full">
                <p className="text-md text-gray-500 mb-2">Return</p>
                <input
                  type="date"
                  className="w-full font-semibold text-base pb-1 text-gray-600 outline-none"
                  disabled={tripType === "One Way"}
                />
              </div>
            </div>

            {/* Travellers */}
            <div className="p-4 w-full sm:w-auto">
              <p className="text-xs text-gray-500">Travellers & Class</p>
              <select className="w-full font-semibold text-lg sm:text-xl text-gray-800 outline-none py-2">
                <option>1 Traveller, Economy</option>
                <option>2 Travellers, Economy</option>
                <option>Business Class</option>
                <option>Premium Economy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Special Fare Row */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <span className="text-green-600 font-semibold w-full sm:w-auto">EXTRA SAVINGS</span>

        <label
          className={`flex items-start gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer
            ${
              selectedFare === "Regular"
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-gray-300"
            }`}
        >
          <input
            type="radio"
            className="mt-1 text-xl"
            name="fare"
            checked={selectedFare === "Regular"}
            onChange={() => setSelectedFare("Regular")}
          />
          <div>
            <p
              className={`text-md transition-colors ${
                selectedFare === "Regular" ? "text-blue-600 font-semibold" : "text-gray-700 font-bold"
              }`}
            >
              Regular
            </p>
            <p className="text-sm text-gray-500">Regular fares</p>
          </div>
        </label>

        <label
          className={`flex items-start gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer
            ${
              selectedFare === "Student"
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-gray-300"
            }`}
        >
          <input
            type="radio"
            className="mt-1 text-xl"
            name="fare"
            checked={selectedFare === "Student"}
            onChange={() => setSelectedFare("Student")}
          />
          <div>
            <p
              className={`text-md transition-colors ${
                selectedFare === "Student" ? "text-blue-600 font-semibold" : "text-gray-700 font-bold"
              }`}
            >
              Student
            </p>
            <p className="text-sm text-gray-500">Extra discounts/baggage</p>
          </div>
        </label>

        <label
          className={`flex items-start gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer
            ${
              selectedFare === "Senior Citizen"
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-gray-300"
            }`}
        >
          <input
            type="radio"
            className="mt-1 text-xl"
            name="fare"
            checked={selectedFare === "Senior Citizen"}
            onChange={() => setSelectedFare("Senior Citizen")}
          />
          <div>
            <p
              className={`text-md transition-colors ${
                selectedFare === "Senior Citizen" ? "text-blue-600 font-semibold" : "text-gray-700 font-bold"
              }`}
            >
              Senior Citizen
            </p>
            <p className="text-sm text-gray-500">Up to ₹600 off</p>
          </div>
        </label>

        <label
          className={`flex items-start gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer
            ${
              selectedFare === "Armed Forces"
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-gray-300"
            }`}
        >
          <input
            type="radio"
            className="mt-1 text-xl"
            name="fare"
            checked={selectedFare === "Armed Forces"}
            onChange={() => setSelectedFare("Armed Forces")}
          />
          <div>
            <p
              className={`text-md transition-colors ${
                selectedFare === "Armed Forces" ? "text-blue-600 font-semibold" : "text-gray-700 font-bold"
              }`}
            >
              Armed Forces
            </p>
            <p className="text-sm text-gray-500">Up to ₹600 off</p>
          </div>
        </label>

        <label
          className={`flex items-start gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer
            ${
              selectedFare === "Doctor & Nurses"
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-gray-300"
            }`}
        >
          <input
            type="radio"
            className="mt-1 text-xl"
            name="fare"
            checked={selectedFare === "Doctor & Nurses"}
            onChange={() => setSelectedFare("Doctor & Nurses")}
          />
          <div>
            <p
              className={`text-md transition-colors ${
                selectedFare === "Doctor & Nurses" ? "text-blue-600 font-semibold" : "text-gray-700 font-bold"
              }`}
            >
              Doctor & Nurses
            </p>
            <p className="text-sm text-gray-500">Up to ₹600 off</p>
          </div>
        </label>

        <div className="ml-auto border px-4 py-2 rounded-lg text-sm sm:block hidden">
          <span className="font-semibold">Flight Tracker</span>{" "}
          <span className="text-pink-500">new</span>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-end">
        <button
          className="w-full sm:w-1/4 py-3 text-white font-semibold rounded-lg transition duration-300"
          style={{ background: "linear-gradient(93deg, #53b2fe, #065af3)" }}
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}
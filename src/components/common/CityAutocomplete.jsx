import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { api, endpoints } from "../../api/api-config";

// Global cache for cities so we only fetch once across component re-renders
let cachedCities = null;
let citiesPromise = null;

export const fetchMasterCities = async () => {
  if (cachedCities) return cachedCities;
  if (citiesPromise) return citiesPromise;

  citiesPromise = api
    .get(endpoints.masterCities)
    .then((res) => {
      const cities = res.data?.data?.cities || [];
      cachedCities = cities;
      return cities;
    })
    .catch((err) => {
      console.error("Failed to fetch master cities:", err);
      return [];
    })
    .finally(() => {
      citiesPromise = null;
    });

  return citiesPromise;
};

// Helper to format city / state name for display (e.g. "bangalore" -> "Bangalore", "tamil-nadu" -> "Tamil Nadu")
export const formatCityDisplay = (cityObj) => {
  if (!cityObj) return "";
  if (typeof cityObj === "string") {
    return cityObj
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  const cityName = (cityObj.city || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const stateName = (cityObj.state || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return stateName ? `${cityName}, ${stateName}` : cityName;
};

const CityAutocomplete = ({
  value = "",
  onSelect,
  placeholder = "Search or select city...",
  className = "",
  inputClassName = "",
  required = false,
  disabled = false,
  excludeCityIds = [],
}) => {
  const [cities, setCities] = useState(cachedCities || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchMasterCities().then((list) => {
      if (list && list.length > 0) {
        setCities(list);
      }
    });
  }, []);

  // Synchronize display value when `value` prop changes
  useEffect(() => {
    if (typeof value === "string") {
      setSearchTerm(value);
    } else if (value && (value.city || value.name)) {
      setSearchTerm(formatCityDisplay(value));
    } else {
      setSearchTerm("");
    }
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on search term & excluded IDs
  const filteredCities = cities.filter((c) => {
    if (excludeCityIds && excludeCityIds.includes(c._id)) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const cityMatch = c.city?.toLowerCase().includes(term);
    const stateMatch = c.state?.toLowerCase().includes(term);
    const formatted = formatCityDisplay(c).toLowerCase();
    return cityMatch || stateMatch || formatted.includes(term);
  });

  const handleSelect = (cityObj) => {
    setSearchTerm(formatCityDisplay(cityObj));
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(cityObj);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm("");
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(null);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        return;
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === "Enter") {
      if (isOpen && highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        e.preventDefault();
        handleSelect(filteredCities[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
          disabled={disabled}
          autoComplete="off"
          className={
            inputClassName ||
            "p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full text-gray-800"
          }
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            <FaTimes className="text-sm" />
          </button>
        ) : (
          <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-1 text-sm">
          {filteredCities.length === 0 ? (
            <li className="p-3 text-gray-500 text-center">
              No matching cities found
            </li>
          ) : (
            filteredCities.map((cityObj, index) => {
              const isSelected = highlightedIndex === index;
              return (
                <li
                  key={cityObj._id}
                  onClick={() => handleSelect(cityObj)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt
                      className={`text-xs ${
                        isSelected ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                    <span className="capitalize">
                      {cityObj.city?.replace(/-/g, " ")}
                    </span>
                  </div>
                  {cityObj.state && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {cityObj.state.replace(/-/g, " ")}
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;

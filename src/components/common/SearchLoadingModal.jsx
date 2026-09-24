import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar } from "react-icons/fa";

const SearchLoadingModal = ({ isOpen, searchMeta = {}, onClose }) => {
  const {
    origin = "",
    destination = "",
    tripType = "Outstation",
  } = searchMeta;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Soft blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Clean, Simple White Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 z-10 text-center"
          >
            {/* Car driving on route line */}
            <div className="relative w-full max-w-[240px] mx-auto h-12 flex items-center justify-between px-2 mb-3">
              {/* Pickup dot */}
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              </div>

              {/* Dashed route line */}
              <div className="flex-1 mx-3 h-0.5 border-t-2 border-dashed border-gray-200 relative flex items-center">
                <motion.div
                  animate={{ left: ["0%", "88%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 text-orange-500"
                >
                  <FaCar className="text-xl drop-shadow-sm" />
                </motion.div>
              </div>

              {/* Dropoff dot */}
              <div className="flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold font-grotesk text-gray-900 mb-1">
              Searching Cabs...
            </h3>

            {/* Route summary if available */}
            {origin || destination ? (
              <p className="text-xs font-medium text-gray-600 truncate max-w-[280px] mx-auto mb-4">
                <span className="text-gray-900 font-semibold">{origin || "Pickup"}</span>
                <span className="mx-1.5 text-orange-500 font-bold">→</span>
                <span className="text-gray-900 font-semibold">{destination || "Dropoff"}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mb-4">
                Finding the best available rides for your trip
              </p>
            )}

            {/* Minimal animated loading bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden relative">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="w-1/2 h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              />
            </div>

            <p className="text-[11px] text-gray-400 mt-2.5">
              Please wait a moment...
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchLoadingModal;

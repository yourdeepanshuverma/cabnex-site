import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cabnex.in",
  // baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const endpoints = {
  signup: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  profile: "/api/v1/auth/me",
  logout: "/api/v1/auth/logout",
  vendorlogin: "/api/v1/vendor/login",
  vendorregistration: "/api/v1/vendor/register",
  vendorMe: "/api/v1/vendor/me",
  vendorCars: "/api/v1/vendor/cars",
  carcategory: "/api/v1/admin/car-categories",
  travelpackage: "/api/v1/package/activity",
  search: "/api/v1/auth/search",
  travelpackagebooking: "/api/v1/auth/travel-query",
  Dashboardstats: "/api/v1/vendor/dashboard",
  WebsiteContent: "/api/v1/admin/website-setting",
  Sendotp: "/api/v1/otp/send",
  Verifyotp: "/api/v1/otp/verify",
  ContactUs: "/api/v1/admin/contact-us",
  offlineBooking: "/api/v1/auth/bookings/without-payment",
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
if (!GOOGLE_MAPS_API_KEY) {
  console.warn(
    "Google Maps API Key is missing! Add VITE_GOOGLE_MAPS_API_KEY in .env file.",
  );
}
const googleConfig = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places"],
};

export { api, endpoints, googleConfig };

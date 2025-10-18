import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cabnex.in",
  headers: {
    "Content-Type": "application/json", 
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vendorToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("vendorName");
      window.location.href = '/vendor-login';
    }
    return Promise.reject(error);
  }
);

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
  search:"/api/v1/auth/search",
  travelpackage: "/api/v1/package/activity",
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
if (!GOOGLE_MAPS_API_KEY) {
  console.warn('Google Maps API Key is missing! Add VITE_GOOGLE_MAPS_API_KEY in .env file.');
}
const googleConfig = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
};

export { api, endpoints, googleConfig };

import React, { useState } from "react";
import { FaUser, FaBuilding, FaEnvelope, FaPhone, FaLock, FaKey, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/logo/logo-cab.png';
import registrationImg from '../../assets/vendor/riseter.png';
import { api } from '../../api/api-config';

import { useVendorAuth } from '../context/VendorAuthContext';

export default function VendorRegistration() {
  const { setVendorUser, setIsVendorLoggedIn } = useVendorAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactPerson: "",
    company: "",
    email: "",
    contactPhone: "",
    password: "",
    confirmPassword: "",
    gst: "",
    pan: "",
    otp: "",
    verifiedOtp: "",
    phoneVerified: false,
    showOtp: false,
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Name is required";
    if (!formData.company.trim()) newErrors.company = "Company Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Phone number must be exactly 10 digits";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.pan.trim()) newErrors.pan = "PAN Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOtpVerification = () => {
    if (!formData.contactPhone.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactPhone: "Phone number is required to send OTP",
      }));
      return;
    }
    if (!/^\d{10}$/.test(formData.contactPhone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactPhone: "Phone number must be exactly 10 digits",
      }));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      showOtp: true,
    }));
    alert(`OTP sent to ${formData.contactPhone}. Use 1234 for testing.`);
  };

  const handleSubmitOtp = () => {
    if (formData.otp === "1234") {
      setFormData((prevData) => ({
        ...prevData,
        phoneVerified: true,
        showOtp: false,
        otp: "",
        verifiedOtp: prevData.otp,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactPhone: "",
        otp: "",
      }));
      alert("Phone number verified successfully!");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otp: "Invalid OTP. Please try again.",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!formData.phoneVerified) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contactPhone: "Please verify your phone number",
      }));
      return;
    }
    const formDataToSend = {
      contactPerson: formData.contactPerson,
      company: formData.company,
      email: formData.email,
      contactPhone: formData.contactPhone,
      password: formData.password,
      pan: formData.pan,
      gst: formData.gst,
    };
    try {
      setIsLoading(true);
      console.log("Submitting vendor registration:", JSON.stringify(formDataToSend, null, 2));
      const response = await api.post('/api/v1/vendor/register', formDataToSend);
      console.log("Register response:", JSON.stringify(response.data, null, 2));
      if (response.data.statusCode === 201 && response.data.success) {
        console.log('Registration successful, redirecting...');
        alert(response.data.message || "Vendor registered successfully!");
        setVendorUser(response.data.data);
        setIsVendorLoggedIn(true);
        setFormData({
          contactPerson: "",
          company: "",
          email: "",
          contactPhone: "",
          password: "",
          confirmPassword: "",
          gst: "",
          pan: "",
          otp: "",
          verifiedOtp: "",
          phoneVerified: false,
          showOtp: false,
          showPassword: false,
          showConfirmPassword: false,
        });
        setErrors({});
        console.log('Navigating to /vendor');
        navigate('/vendor', { replace: true }); // Force redirect
      } else {
        console.log('Unexpected response:', response.data);
        alert('Registration succeeded but unexpected response format');
      }
    } catch (error) {
      console.error('API error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        request: error.request,
      });
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center">
            <a href="/">
              <img src={logo} alt="Logo" className="h-20 w-auto" />
            </a>
          </div>
          <h1 className="text-3xl md:text-4xl font-grotesk text-black font-extrabold leading-tight mt-2 mb-0">
            Vendor <span className="text-[#3A4A5B]">Registration</span>
          </h1>
        </div>
        <div className="flex max-w-6xl w-full">
          <div className="w-1/3 hidden md:block">
            <img
              src={registrationImg}
              alt="Vendor Registration Background"
              className="w-full object-cover rounded-l-4xl"
            />
          </div>
          <div className="w-full md:w-2/3 p-6 flex flex-col justify-start relative overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="contactPerson" className="block font-grotesk text-sm font-medium text-black">
                    Name *
                  </label>
                  <div className="mt-1 relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="contactPerson"
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.contactPerson ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="company" className="block font-grotesk text-sm font-medium text-black">
                    Company Name *
                  </label>
                  <div className="mt-1 relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.company ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your company name"
                    />
                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block font-grotesk text-sm font-medium text-black">
                    Email Address *
                  </label>
                  <div className="mt-1 relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="contactPhone" className="block font-grotesk text-sm font-medium text-black">
                    Phone Number *
                  </label>
                  <div className="mt-1 relative flex items-center">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="contactPhone"
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.contactPhone ? 'border-red-500' : ''
                      }`}
                      placeholder="9876543210"
                      disabled={formData.phoneVerified}
                    />
                    {!formData.phoneVerified && !formData.showOtp && (
                      <button
                        type="button"
                        onClick={handleOtpVerification}
                        className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold"
                      >
                        Verify
                      </button>
                    )}
                    {formData.phoneVerified && <FaCheckCircle className="ml-4 h-4 w-4 text-green-500" aria-hidden="true" />}
                  </div>
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                  {formData.showOtp && (
                    <div className="mt-2 flex items-center">
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-32 py-2 px-5 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                        placeholder="4-digit OTP"
                      />
                      <button
                        type="button"
                        onClick={handleSubmitOtp}
                        className="ml-2 bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold"
                      >
                        Submit
                      </button>
                      {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block font-grotesk text-sm font-medium text-black">
                    Password *
                  </label>
                  <div className="mt-1 relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="password"
                      type={formData.showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('showPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-400 cursor-pointer"
                    >
                      {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block font-grotesk text-sm font-medium text-black">
                    Confirm Password *
                  </label>
                  <div className="mt-1 relative">
                    <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="confirmPassword"
                      type={formData.showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('showConfirmPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-400 cursor-pointer"
                    >
                      {formData.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="gst" className="block font-grotesk text-sm font-medium text-black">
                    GST Number (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <FaCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="gst"
                      type="text"
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                      className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                      placeholder="Enter GST number (if applicable)"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="pan" className="block font-grotesk text-sm font-medium text-black">
                    PAN Number *
                  </label>
                  <div className="mt-1 relative">
                    <FaCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" aria-hidden="true" />
                    <input
                      id="pan"
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.pan ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter PAN number"
                    />
                    {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#384A5A] text-white py-3 cursor-pointer rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Register as Vendor'}
                </button>
              </div>
            </form>
            <div className="text-center mt-8">
              <p className="text-slate-600 text-sm">
                Already registered?{' '}
                <a href="/vendor-login" className="text-orange-500 font-medium hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
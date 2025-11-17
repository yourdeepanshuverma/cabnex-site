import React, { useState } from "react";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaKey,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../assets/logo/logo-cab.png";
import registrationImg from "../../assets/vendor/riseter.png";
import { api } from "../../api/api-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useVendorAuth } from "../context/VendorAuthContext";

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
    otp: ["", "", "", ""], // Changed to array for 4-digit input
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setFormData((prev) => {
      const newOtp = [...prev.otp];
      newOtp[index] = element.value;
      return { ...prev, otp: newOtp };
    });

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.contactPerson.trim())
      newErrors.contactPerson = "Name is required";
    if (!formData.company.trim())
      newErrors.company = "Company Name is required";

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.pan.trim()) {
      newErrors.pan = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = "Invalid PAN number format.";
    }

    if (
      formData.gst.trim() &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gst
      )
    ) {
      newErrors.gst = "Invalid GST number format.";
    }

    setErrors(newErrors);
    Object.values(newErrors).forEach((error) => toast.error(error));
    return Object.keys(newErrors).length === 0;
  };

  const handleOtpVerification = async () => {
    if (!formData.contactPhone.trim()) {
      toast.error("Phone number is required to send OTP");
      setErrors((prev) => ({
        ...prev,
        contactPhone: "Phone number is required",
      }));
      return;
    }
    if (!/^\d{10}$/.test(formData.contactPhone)) {
      toast.error("Phone number must be exactly 10 digits");
      setErrors((prev) => ({ ...prev, contactPhone: "Invalid phone number" }));
      return;
    }

    try {
      setIsLoading(true);
      const payload = { phone: formData.contactPhone };
      console.log("Sending OTP:", payload);
      const response = await api.post("/api/v1/otp/send", payload);
      console.log("OTP Sent:", response.data);

      if (response.data.success) {
        setFormData((prev) => ({ ...prev, showOtp: true }));
        toast.info(
          `OTP sent to ${formData.contactPhone}. Use 1234 for testing.`
        );
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error("Failed to send OTP: " + msg);
      console.error("Send OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (!formData.otp.join("").trim()) {
      toast.error("OTP is required");
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    if (!/^\d{4}$/.test(formData.otp.join(""))) {
      toast.error("OTP must be 4 digits");
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP" }));
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        phone: formData.contactPhone,
        otp: formData.otp.join(""),
      };
      console.log("Verifying OTP:", payload);
      const response = await api.post("/api/v1/otp/verify", payload);
      console.log("OTP Verified:", response.data);

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          phoneVerified: true,
          showOtp: false,
          otp: ["", "", "", ""],
          verifiedOtp: prev.otp.join(""),
        }));
        setErrors((prev) => ({ ...prev, contactPhone: "", otp: "" }));
        toast.success("Phone number verified successfully!");
      } else {
        toast.error(response.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error("Failed to verify OTP: " + msg);
      console.error("Verify OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!formData.phoneVerified) {
      toast.error("Please verify your phone number first!");
      return;
    }

    const formDataToSend = {
      contactPerson: formData.contactPerson,
      company: formData.company,
      email: formData.email,
      contactPhone: formData.contactPhone,
      password: formData.password,
      pan: formData.pan,
      gst: formData.gst || undefined,
      otp: formData.verifiedOtp, // CRITICAL: OTP must be sent
    };

    try {
      setIsLoading(true);
      console.log("Submitting Vendor Registration:", formDataToSend);
      const response = await api.post(
        "/api/v1/vendor/register",
        formDataToSend
      );
      console.log("Registration Response:", response.data);

      if (response.data.statusCode === 201 && response.data.success) {
        toast.success(
          response.data.message || "Vendor registered successfully!"
        );
        setVendorUser(response.data.data);
        setIsVendorLoggedIn(true);

        // Reset form
        setFormData({
          contactPerson: "",
          company: "",
          email: "",
          contactPhone: "",
          password: "",
          confirmPassword: "",
          gst: "",
          pan: "",
          otp: ["", "", "", ""],
          verifiedOtp: "",
          phoneVerified: false,
          showOtp: false,
          showPassword: false,
          showConfirmPassword: false,
        });
        setErrors({});

        navigate("/vendor", { replace: true });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error("Registration failed: " + msg);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
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
                  {/* Contact Person */}
                  <div className="relative">
                    <label
                      htmlFor="contactPerson"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Name *
                    </label>
                    <div className="mt-1 relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="contactPerson"
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.contactPerson ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your name"
                      />
                    </div>
                    {errors.contactPerson && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="relative">
                    <label
                      htmlFor="company"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Company Name *
                    </label>
                    <div className="mt-1 relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.company ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your company name"
                      />
                    </div>
                    {errors.company && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Email Address *
                    </label>
                    <div className="mt-1 relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone + OTP */}
                  <div className="relative">
                    <label
                      htmlFor="contactPhone"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Phone Number *
                    </label>
                    <div className="mt-1 relative flex items-center">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="contactPhone"
                        type="tel"
                        name="contactPhone"
                        minLength={10}
                        maxLength={10}
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.contactPhone ? "border-red-500" : ""
                        }`}
                        placeholder="9876543210"
                        disabled={formData.phoneVerified}
                      />
                      {!formData.phoneVerified && !formData.showOtp && (
                        <button
                          type="button"
                          onClick={handleOtpVerification}
                          disabled={isLoading}
                          className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Verify"}
                        </button>
                      )}
                      {formData.phoneVerified && (
                        <FaCheckCircle className="ml-4 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {errors.contactPhone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contactPhone}
                      </p>
                    )}

                    {/* OTP Input */}
                    {formData.showOtp && !formData.phoneVerified && (
                      <div className="mt-3 flex items-center justify-between space-x-2">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={formData.otp[index]}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            className={`block w-12 h-12 text-center text-xl rounded-md border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                              errors.otp ? "border-red-500" : ""
                            }`}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={handleSubmitOtp}
                          disabled={
                            isLoading || formData.otp.join("").length !== 4
                          }
                          className="ml-2 bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? "Verifying..." : "Submit"}
                        </button>
                      </div>
                    )}
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Password *
                    </label>
                    <div className="mt-1 relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="password"
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("showPassword")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-400"
                      >
                        {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Confirm Password *
                    </label>
                    <div className="mt-1 relative">
                      <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="confirmPassword"
                        type={
                          formData.showConfirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("showConfirmPassword")
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-400"
                      >
                        {formData.showConfirmPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* GST */}
                  <div className="relative">
                    <label
                      htmlFor="gst"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      GST Number (Optional)
                    </label>
                    <div className="mt-1 relative">
                      <FaCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="gst"
                        type="text"
                        name="gst"
                        minLength={15}
                        maxLength={15}
                        value={formData.gst}
                        onChange={handleChange}
                        className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                        placeholder="Enter GST number (if applicable)"
                      />
                    </div>
                    {errors.gst && (
                      <p className="text-red-500 text-xs mt-1">{errors.gst}</p>
                    )}
                  </div>

                  {/* PAN */}
                  <div className="relative">
                    <label
                      htmlFor="pan"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      PAN Number *
                    </label>
                    <div className="mt-1 relative">
                      <FaCheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9e9e9e]" />
                      <input
                        id="pan"
                        type="text"
                        name="pan"
                        minLength={10}
                        maxLength={10}
                        value={formData.pan}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.pan ? "border-red-500" : ""
                        }`}
                        placeholder="Enter PAN number"
                      />
                    </div>
                    {errors.pan && (
                      <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#384A5A] text-white py-3 cursor-pointer rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50 transition"
                  >
                    {isLoading ? "Registering..." : "Register as Vendor"}
                  </button>
                </div>
              </form>

              <div className="text-center mt-8">
                <p className="text-slate-600 text-sm">
                  Already registered?{" "}
                  <a
                    href="/vendor-login"
                    className="text-orange-500 font-medium hover:underline"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

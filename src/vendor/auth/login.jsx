import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../assets/logo/logo-cab.png";
import loginImg from "../../assets/vendor/riseter.png";
import { api } from "../../api/api-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useVendorAuth } from "../context/VendorAuthContext";

export default function VendorLogin() {
  const { setVendorUser, setIsVendorLoggedIn } = useVendorAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    identifier: "",
    otp: ["", "", "", ""],
    newPassword: "",
    showForgotOTP: false,
    forgotVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [forgotErrors, setForgotErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...forgotData.otp];
    newOtp[index] = element.value;

    setForgotData((prev) => ({ ...prev, otp: newOtp }));
    setForgotErrors((prev) => ({ ...prev, otp: "" }));

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({ ...prev, [name]: value }));
    setForgotErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or Phone is required";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.identifier) &&
      !/^\d{10}$/.test(formData.identifier)
    ) {
      newErrors.identifier = "Enter a valid email or 10-digit phone number";
    }
    if (!formData.password.trim()) {
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
    setErrors(newErrors);
    Object.values(newErrors).forEach((error) => toast.error(error));
    return Object.keys(newErrors).length === 0;
  };

  const validateForgot = () => {
    const newErrors = {};
    if (!forgotData.identifier.trim()) {
      newErrors.identifier = "Email or Phone is required";
    } else if (
      !/\S+@\S+\.\S+/.test(forgotData.identifier) &&
      !/^\d{10}$/.test(forgotData.identifier)
    ) {
      newErrors.identifier = "Enter a valid email or 10-digit phone number";
    }

    const otpString = forgotData.otp.join("");
    if (forgotData.showForgotOTP && !otpString.trim()) {
      newErrors.otp = "OTP is required";
    } else if (forgotData.showForgotOTP && !/^\d{4}$/.test(otpString)) {
      newErrors.otp = "OTP must be 4 digits";
    }

    if (forgotData.forgotVerified && !forgotData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (forgotData.forgotVerified && forgotData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      forgotData.forgotVerified &&
      !/(?=.*[a-z])/.test(forgotData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain at least one lowercase letter.";
    } else if (
      forgotData.forgotVerified &&
      !/(?=.*[A-Z])/.test(forgotData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter.";
    } else if (
      forgotData.forgotVerified &&
      !/(?=.*\d)/.test(forgotData.newPassword)
    ) {
      newErrors.newPassword = "Password must contain at least one number.";
    } else if (
      forgotData.forgotVerified &&
      !/(?=.*[@$!%*?&])/.test(forgotData.newPassword)
    ) {
      newErrors.newPassword =
        "Password must contain at least one special character.";
    }

    setForgotErrors(newErrors);
    Object.values(newErrors).forEach((error) => toast.error(error));
    return Object.keys(newErrors).length === 0;
  };

  const handleSendForgotOTP = async (e) => {
    e.preventDefault();
    if (!forgotData.identifier.trim()) {
      toast.error("Email or Phone is required");
      setForgotErrors({ identifier: "Email or Phone is required" });
      return;
    }
    if (
      !/\S+@\S+\.\S+/.test(forgotData.identifier) &&
      !/^\d{10}$/.test(forgotData.identifier)
    ) {
      toast.error("Enter a valid email or 10-digit phone number");
      setForgotErrors({ identifier: "Invalid email or phone" });
      return;
    }

    try {
      setIsLoading(true);
      const isEmail = /\S+@\S+\.\S+/.test(forgotData.identifier);
      const payload = isEmail
        ? { email: forgotData.identifier }
        : { phone: forgotData.identifier };

      const response = await api.post(
        "/api/v1/vendor/send-forget-otp",
        payload
      );
      if (response.data.success) {
        setForgotData((prev) => ({ ...prev, showForgotOTP: true }));
        toast.info(
          `OTP sent to ${forgotData.identifier}. Use 1234 for testing.`
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

  const handleVerifyForgotOTP = async (e) => {
    e.preventDefault();
    const otpString = forgotData.otp.join("");

    if (!otpString.trim()) {
      toast.error("OTP is required");
      setForgotErrors({ otp: "OTP is required" });
      return;
    }
    if (!/^\d{4}$/.test(otpString)) {
      toast.error("OTP must be 4 digits");
      setForgotErrors({ otp: "Invalid OTP" });
      return;
    }

    try {
      setIsLoading(true);
      const isEmail = /\S+@\S+\.\S+/.test(forgotData.identifier);
      const payload = isEmail
        ? { email: forgotData.identifier, otp: otpString }
        : { phone: forgotData.identifier, otp: otpString };

      const response = await api.post(
        "/api/v1/vendor/verify-forget-otp",
        payload
      );
      if (response.data.success) {
        setForgotData((prev) => ({
          ...prev,
          showForgotOTP: false,
          forgotVerified: true,
        }));
        toast.success("OTP verified successfully!");
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForgot()) return;

    try {
      setIsLoading(true);
      const isEmail = /\S+@\S+\.\S+/.test(forgotData.identifier);
      const payload = isEmail
        ? { email: forgotData.identifier, newPassword: forgotData.newPassword }
        : { phone: forgotData.identifier, newPassword: forgotData.newPassword };

      const response = await api.post("/api/v1/vendor/reset-password", payload);
      console.log(response.data);
      if (response.data.success) {
        toast.success("Password reset successfully!");
        setForgotData({
          identifier: "",
          otp: ["", "", "", ""],
          newPassword: "",
          showForgotOTP: false,
          forgotVerified: false,
        });
        setForgotErrors({});
        setForgotPasswordOpen(false);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error("Failed to reset password: " + msg);
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
      const payload = isEmail
        ? { email: formData.identifier, password: formData.password }
        : { contactPhone: formData.identifier, password: formData.password };

      const response = await api.post("/api/v1/vendor/login", payload);
      if (response.data.statusCode === 200 && response.data.success) {
        setVendorUser(response.data.data);
        setIsVendorLoggedIn(true);
        toast.success("Login successful!");
        setFormData({ identifier: "", password: "" });
        setErrors({});
        navigate("/vendor", { replace: true });
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error("Login failed: " + msg);
      console.error("Login error:", error);
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
            <h1 className="text-3xl md:text-4xl font-grotesk text-black font-extrabold leading-tight mt-2">
              Vendor <span className="text-[#3A4A5B]">Login</span>
            </h1>
          </div>

          <div className="flex max-w-6xl w-full">
            <div className="w-1/3 hidden md:block">
              <img
                src={loginImg}
                alt="Vendor Login Background"
                className="w-full object-cover rounded-l-4xl"
              />
            </div>

            <div className="w-full md:w-2/3 p-6 flex flex-col justify-start relative overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  {/* Identifier */}
                  <div className="relative">
                    <label
                      htmlFor="login-identifier"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Email or Phone *
                    </label>
                    <div className="mt-1 relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="login-identifier"
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.identifier ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email or phone"
                      />
                    </div>
                    {errors.identifier && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.identifier}
                      </p>
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
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-sm cursor-pointer font-grotesk text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#384A5A] text-white py-3 rounded-xl hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50 transition"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>

                  <div className="text-center">
                    <span className="text-sm font-grotesk text-gray-600">
                      Don’t have an account?{" "}
                      <a
                        href="/vendor-registration"
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-semibold"
                      >
                        Register
                      </a>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {forgotPasswordOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setForgotData({
                    identifier: "",
                    otp: ["", "", "", ""],
                    newPassword: "",
                    showForgotOTP: false,
                    forgotVerified: false,
                  });
                  setForgotErrors({});
                }}
                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-grotesk font-extrabold text-gray-900 mb-6">
                {forgotData.forgotVerified
                  ? "Reset Password"
                  : forgotData.showForgotOTP
                  ? "Verify OTP"
                  : "Forgot Password"}
              </h2>

              <form className="space-y-4">
                {!forgotData.forgotVerified && (
                  <div className="relative">
                    <label
                      htmlFor="forgot-identifier"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Phone Number
                    </label>
                    <div className="mt-1 relative flex items-center">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="forgot-identifier"
                        type="text"
                        name="identifier"
                        value={forgotData.identifier}
                        onChange={handleForgotChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          forgotErrors.identifier ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your phone number"
                        disabled={forgotData.showForgotOTP}
                      />
                      {!forgotData.showForgotOTP && (
                        <button
                          type="button"
                          onClick={handleSendForgotOTP}
                          disabled={isLoading}
                          className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                    </div>
                    {forgotErrors.identifier && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotErrors.identifier}
                      </p>
                    )}
                  </div>
                )}

                {forgotData.showForgotOTP && !forgotData.forgotVerified && (
                  <div className="relative">
                    <label className="block font-grotesk text-sm font-medium text-black">
                      Enter 4-digit OTP *
                    </label>
                    <div className="mt-2 flex justify-center gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={forgotData.otp[index]}
                          onChange={(e) => handleOtpChange(e.target, index)}
                          onFocus={(e) => e.target.select()}
                          className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border ${
                            forgotErrors.otp
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:border-[#FF6900] focus:outline-none focus:ring-2 focus:ring-[#FF6900]`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        onClick={handleVerifyForgotOTP}
                        disabled={
                          isLoading || forgotData.otp.join("").length !== 4
                        }
                        className="bg-[#FF6900] text-white py-2 px-6 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                      >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                    {forgotErrors.otp && (
                      <p className="text-red-500 text-xs mt-2 text-center">
                        {forgotErrors.otp}
                      </p>
                    )}
                  </div>
                )}

                {forgotData.forgotVerified && (
                  <div className="relative">
                    <label
                      htmlFor="new-password"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      New Password *
                    </label>
                    <div className="mt-1 relative">
                      <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          forgotErrors.newPassword ? "border-red-500" : ""
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {forgotErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotErrors.newPassword}
                      </p>
                    )}
                  </div>
                )}

                {forgotData.forgotVerified && (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full bg-[#384A5A] text-white py-3 rounded-xl hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50 transition"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                )}

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setForgotData({
                        identifier: "",
                        otp: ["", "", "", ""],
                        newPassword: "",
                        showForgotOTP: false,
                        forgotVerified: false,
                      });
                      setForgotErrors({});
                    }}
                    className="text-sm font-grotesk text-indigo-600 hover:text-indigo-800"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

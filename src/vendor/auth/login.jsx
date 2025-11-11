import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/logo/logo-cab.png';
import loginImg from '../../assets/vendor/riseter.png';
import { api } from '../../api/api-config';

import { useVendorAuth } from "../context/VendorAuthContext";

export default function VendorLogin() {
  const { setVendorUser, setIsVendorLoggedIn } = useVendorAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [forgotData, setForgotData] = useState({
    identifier: '',
    otp: '',
    newPassword: '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({ ...prev, [name]: value }));
    setForgotErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Phone is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.identifier) && !/^\d{10}$/.test(formData.identifier)) {
      newErrors.identifier = 'Enter a valid email or 10-digit phone number';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgot = () => {
    const newErrors = {};
    if (!forgotData.identifier.trim()) {
      newErrors.identifier = 'Email or Phone is required';
    } else if (!/\S+@\S+\.\S+/.test(forgotData.identifier) && !/^\d{10}$/.test(forgotData.identifier)) {
      newErrors.identifier = 'Enter a valid email or 10-digit phone number';
    }
    if (forgotData.showForgotOTP && !forgotData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (forgotData.showForgotOTP && !/^\d{6}$/.test(forgotData.otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    if (forgotData.forgotVerified && !forgotData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (forgotData.forgotVerified && forgotData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    setForgotErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendForgotOTP = async (e) => {
    e.preventDefault();
    if (!forgotData.identifier.trim()) {
      setForgotErrors({ identifier: 'Email or Phone is required' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotData.identifier) && !/^\d{10}$/.test(forgotData.identifier)) {
      setForgotErrors({ identifier: 'Enter a valid email or 10-digit phone number' });
      return;
    }
    try {
      setIsLoading(true);
      const isEmail = /\S+@\S+\.\S+/.test(forgotData.identifier);
      const payload = isEmail ? { email: forgotData.identifier } : { mobile: forgotData.identifier };
      console.log('Sending forgot OTP with data:', payload);
      const response = await api.put('/api/v1/vendor/forget-password', payload);
      console.log('Send forgot OTP response:', response.data);
      if (response.data.success) {
        alert(`OTP sent to ${forgotData.identifier}. Use 123456 for testing.`);
        setForgotData(prev => ({ ...prev, showForgotOTP: true }));
      } else {
        setForgotErrors({ identifier: response.data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      console.error('Forgot OTP error:', error.response?.data, error.message);
      setForgotErrors({ identifier: 'Failed to send OTP: ' + (error.response?.data?.message || error.message) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyForgotOTP = async (e) => {
    e.preventDefault();
    if (!forgotData.otp.trim()) {
      setForgotErrors({ otp: 'OTP is required' });
      return;
    }
    if (!/^\d{6}$/.test(forgotData.otp)) {
      setForgotErrors({ otp: 'OTP must be 6 digits' });
      return;
    }
    if (forgotData.otp !== '123456') {
      setForgotErrors({ otp: 'Invalid OTP. Use 123456 for testing.' });
      return;
    }
    try {
      setIsLoading(true);
      console.log('Verifying forgot OTP:', forgotData.otp);
      setForgotData(prev => ({ ...prev, showForgotOTP: false, forgotVerified: true }));
      alert('OTP verified successfully!');
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data, error.message);
      setForgotErrors({ otp: 'Failed to verify OTP: ' + (error.response?.data?.message || error.message) });
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
        ? { email: forgotData.identifier, otp: forgotData.otp, password: forgotData.newPassword }
        : { mobile: forgotData.identifier, otp: forgotData.otp, password: forgotData.newPassword };
      console.log('Resetting password with data:', payload);
      const response = await api.put('/api/v1/vendor/forget-password', payload);
      console.log('Reset password response:', response.data);
      if (response.data.success) {
        alert('Password reset successfully!');
        setForgotData({
          identifier: '',
          otp: '',
          newPassword: '',
          showForgotOTP: false,
          forgotVerified: false,
        });
        setForgotErrors({});
        setForgotPasswordOpen(false);
      } else {
        setForgotErrors({ newPassword: response.data.message || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Reset password error:', error.response?.data, error.message);
      setForgotErrors({ newPassword: 'Failed to reset password: ' + (error.response?.data?.message || error.message) });
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

      console.log('Submitting login payload:', JSON.stringify(payload, null, 2));
      const response = await api.post('/api/v1/vendor/login', payload);
      console.log('Login response:', JSON.stringify(response.data, null, 2));
      if (response.data.statusCode === 200 && response.data.success) {
        console.log('Login successful, redirecting...');
        setVendorUser(response.data.data);
        setIsVendorLoggedIn(true);
        alert(`Vendor login successful at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}!`);
        setFormData({
          identifier: '',
          password: '',
        });
        setErrors({});
        navigate('/vendor', { replace: true });
      } else {
        console.log('Unexpected response:', response.data);
        alert('Login succeeded but unexpected response format');
      }
    } catch (error) {
      console.error('Login error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        request: error.request,
      });
      alert('Login failed: ' + (error.response?.data?.message || error.message));
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
                <div className="relative">
                  <label htmlFor="login-identifier" className="block font-grotesk text-sm font-medium text-black">
                    Email or Phone
                  </label>
                  <div className="mt-1 relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="login-identifier"
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.identifier ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your email or phone"
                    />
                    {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block font-grotesk text-sm font-medium text-black">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        errors.password ? 'border-red-500' : ''
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
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
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
                  className="w-full bg-[#384A5A] text-white py-3 rounded-md hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text-center">
                  <span className="text-sm font-grotesk text-gray-600">
                    Don’t have an account?{' '}
                    <a href="/vendor-registration" className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-semibold">
                      Register
                    </a>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              type="button"
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotData({
                  identifier: '',
                  otp: '',
                  newPassword: '',
                  showForgotOTP: false,
                  forgotVerified: false,
                });
                setForgotErrors({});
              }}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-grotesk font-extrabold text-gray-900 mb-6">
              {forgotData.forgotVerified ? 'Reset Password' : forgotData.showForgotOTP ? 'Verify OTP' : 'Forgot Password'}
            </h2>
            <form className="space-y-4">
              {!forgotData.forgotVerified && (
                <div className="relative">
                  <label htmlFor="forgot-identifier" className="block font-grotesk text-sm font-medium text-black">
                    Email or Phone
                  </label>
                  <div className="mt-1 relative flex items-center">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="forgot-identifier"
                      type="text"
                      name="identifier"
                      value={forgotData.identifier}
                      onChange={handleForgotChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        forgotErrors.identifier ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your email or phone"
                      disabled={forgotData.showForgotOTP}
                    />
                    {!forgotData.showForgotOTP && (
                      <button
                        type="button"
                        onClick={handleSendForgotOTP}
                        disabled={isLoading}
                        className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                  {forgotErrors.identifier && <p className="text-red-500 text-sm mt-1">{forgotErrors.identifier}</p>}
                </div>
              )}
              {forgotData.showForgotOTP && !forgotData.forgotVerified && (
                <div className="relative">
                  <label htmlFor="forgot-otp" className="block font-grotesk text-sm font-medium text-black">
                    OTP (Use 123456 for testing)
                  </label>
                  <div className="mt-1 relative flex items-center">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="forgot-otp"
                      type="text"
                      name="otp"
                      value={forgotData.otp}
                      onChange={handleForgotChange}
                      maxLength={6}
                      className={`block w-32 py-2 px-5 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        forgotErrors.otp ? 'border-red-500' : ''
                      }`}
                      placeholder="6-digit OTP"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyForgotOTP}
                      disabled={isLoading || forgotData.otp.length !== 6}
                      className="ml-2 bg-[#FF6900] text-white py-2 px-4 rounded-full hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Submit'}
                    </button>
                  </div>
                  {forgotErrors.otp && <p className="text-red-500 text-sm mt-1">{forgotErrors.otp}</p>}
                </div>
              )}
              {forgotData.forgotVerified && (
                <div className="relative">
                  <label htmlFor="new-password" className="block font-grotesk text-sm font-medium text-black">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={forgotData.newPassword}
                      onChange={handleForgotChange}
                      className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                        forgotErrors.newPassword ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {forgotErrors.newPassword && <p className="text-red-500 text-sm mt-1">{forgotErrors.newPassword}</p>}
                </div>
              )}
              {forgotData.forgotVerified && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full bg-[#384A5A] text-white py-3 rounded-md hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              )}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotData({
                      identifier: '',
                      otp: '',
                      newPassword: '',
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
  );
}
import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import Header from "../components/header";
import { toast } from "sonner";
import {
  UserIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { api } from "../api/api-config";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const { user, setUser, isLoggedIn } = useSearch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }

    const fetchUserStats = async () => {
      try {
        const response = await api.get("/api/v1/auth/stats");
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserStats();
    }
  }, [user, isLoggedIn]);

  const handleStatClick = (status) => {
    navigate("/my-bookings", { state: { status } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) {
      toast.error("Full name and mobile number are required.");
      return;
    }
    setIsUpdating(true);
    try {
      // Assuming you have an endpoint to update user profile
      const response = await api.put(`/api/v1/user/update-profile`, formData);
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser); // Update context
        localStorage.setItem("userData", JSON.stringify(updatedUser)); // Update local storage
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating profile."
      );
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    setIsPasswordUpdating(true);
    try {
      // Assuming you have an endpoint to change password
      const response = await api.patch(`/api/v1/auth/me`, {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating password."
      );
      console.error("Password update error:", error);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          My Profile
        </h1>

        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg hover:border-orange-500 transition"
              onClick={() => handleStatClick("all")}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {userStats.totalBookings}
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg hover:border-orange-500 transition"
              onClick={() => handleStatClick("confirmed")}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Completed Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {userStats.completedBookings}
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg hover:border-orange-500 transition"
              onClick={() => handleStatClick("pending")}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Bookings
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {userStats.pendingBookings}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Display */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Personal Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative flex items-center">
                  <UserIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                  <p className="block w-full py-3 px-5 pl-10 rounded-full text-gray-900 bg-gray-100 cursor-not-allowed">
                    {formData.fullName}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative flex items-center">
                  <EnvelopeIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                  <p className="block w-full py-3 px-5 pl-10 rounded-full text-gray-900 bg-gray-100 cursor-not-allowed">
                    {formData.email}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 relative flex items-center">
                  <DevicePhoneMobileIcon className="absolute left-3 h-5 w-5 text-gray-400" />
                  <p className="block w-full py-3 px-5 pl-10 rounded-full text-gray-900 bg-gray-100 cursor-not-allowed">
                    {formData.mobile}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="mt-1 relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full py-3 px-5 pl-10 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1 relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full py-3 px-5 pl-10 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full py-3 px-5 pl-10 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isPasswordUpdating}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full transition duration-300 disabled:opacity-50"
                >
                  {isPasswordUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfilePage;

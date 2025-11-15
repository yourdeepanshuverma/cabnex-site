import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaImage,
  FaIdCard,
  FaFileAlt,
} from "react-icons/fa";
import { api } from "../../api/api-config";

const VendorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    profileImage: null,
    pan: "",
    gst: "",
    // Add other fields as needed (e.g., address, city, state, etc.)
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/v1/vendor/me");
        console.log("GET Response:", response.data);
        if (response.data.success) {
          const vendorData = response.data.data.vendor;
          setProfile({
            name: vendorData.contactPerson || "",
            email: vendorData.email || "",
            phone: vendorData.contactPhone || "",
            businessName: vendorData.company || "",
            profileImage: null,
            pan: vendorData.pan || "",
            gst: vendorData.gst || "",
            // Add other fields from vendorData as needed
          });
          setProfileImagePreview(vendorData.profile?.url || null);
        } else {
          alert("Failed to fetch profile: No data returned");
        }
      } catch (err) {
        console.error("Error fetching profile:", {
          message: err.message,
          status: err.response?.status,
          response: err.response?.data,
          headers: err.response?.headers,
        });
        alert(
          `Failed to fetch profile: ${
            err.response?.data?.message || err.message || "Server error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profileImage: file }));
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!profile.email || !/^\S+@\S+\.\S+$/.test(profile.email)) {
        alert("Please enter a valid email");
        setIsLoading(false);
        return;
      }
      if (!profile.phone || !/^\d{10}$/.test(profile.phone)) {
        alert("Please enter a valid 10-digit phone number");
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("contactPerson", profile.name);
      formDataToSend.append("email", profile.email);
      formDataToSend.append("contactPhone", profile.phone);
      formDataToSend.append("company", profile.businessName);
      if (profile.profileImage instanceof File) {
        formDataToSend.append("profile", profile.profileImage);
      }

      // Debug: Log FormData contents
      console.log("FormData being sent:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      const response = await api.put("/api/v1/vendor/me", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("PUT Response:", response.data);

      if (response.data.success) {
        // Check for Cloudinary-specific error
        if (
          response.data.message &&
          response.data.message.includes(
            "Failed to delete files from Cloudinary"
          )
        ) {
          alert(
            "Profile update partially failed: Unable to delete previous profile image from Cloudinary. Other fields may have updated."
          );
        }
        const updatedVendor = response?.data;
        setProfile({
          name: updatedVendor?.contactPerson || "",
          email: updatedVendor?.email || "",
          phone: updatedVendor?.contactPhone || "",
          businessName: updatedVendor?.company || "",
          profileImage: null,
          pan: updatedVendor?.pan || "",
          gst: updatedVendor?.gst || "",
          // Update other fields as needed
        });
        setProfileImagePreview(updatedVendor.profile?.url || null);
        setIsEditing(false);
        if (
          !response.data.message ||
          !response.data.message.includes(
            "Failed to delete files from Cloudinary"
          )
        ) {
          alert("Profile updated successfully!");
        }
      } else {
        alert("Failed to update profile: No success response");
      }
    } catch (err) {
      console.error("Error updating profile:", {
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
        headers: err.response?.headers,
      });
      alert(
        `Failed to update profile: ${
          err.response?.data?.message || err.message || "Server error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    setIsLoading(true);
    try {
      const response = await api.get("/api/v1/vendor/me");
      console.log("Cancel GET Response:", response.data);
      if (response.data.success) {
        const vendorData = response.data.data.vendor;
        setProfile({
          name: vendorData?.contactPerson || "",
          email: vendorData?.email || "",
          phone: vendorData?.contactPhone || "",
          businessName: vendorData?.company || "",
          profileImage: null,
          pan: vendorData?.pan || "",
          gst: vendorData?.gst || "",
          // Update other fields as needed
        });
        setProfileImagePreview(vendorData?.profile?.url || null);
      }
    } catch (err) {
      console.error("Error refetching profile:", {
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
        headers: err.response?.headers,
      });
      alert(
        `Failed to refetch profile: ${
          err.response?.data?.message || err.message || "Server error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <style>
        {`
          .profile-container {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            border-radius: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          .dark .profile-container {
            background: linear-gradient(135deg, #1f2937, #374151);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          .input-field {
            border-radius: 1rem;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid #d1d5db;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .dark .input-field {
            border-color: #4b5563;
            background-color: #374151;
            color: #ffffff;
          }
          .input-field:focus {
            border-color: #FF6900;
            box-shadow: 0 0 0 3px rgba(255, 105, 0, 0.2);
          }
          .input-container {
            position: relative;
          }
          .input-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
          }
          .dark .input-icon {
            color: #9ca3af;
          }
          .btn-primary {
            background-color: #FF6900;
            border-radius: 0.75rem;
            padding: 0.5rem 1.5rem;
            color: white;
            transition: background-color 0.2s ease, transform 0.2s ease;
          }
          .btn-primary:hover {
            background-color: #e55e00;
            transform: translateY(-1px);
          }
          .btn-secondary {
            background-color: #6b7280;
            border-radius: 0.75rem;
            padding: 0.5rem 1.5rem;
            color: white;
            transition: background-color 0.2s ease, transform 0.2s ease;
          }
          .btn-secondary:hover {
            background-color: #4b5563;
            transform: translateY(-1px);
          }
          .view-mode p {
            background-color: #f8f9fa;
            padding: 0.75rem;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
          }
          .dark .view-mode p {
            background-color: #374151;
            border-color: #4b5563;
            color: #ffffff;
          }
        `}
      </style>

      <div className="profile-container p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-grotesk font-bold text-gray-800 dark:text-gray-200">
            Vendor Profile
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary inline-flex items-center"
              disabled={isLoading}
            >
              <FaEdit className="mr-2 w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center"
                disabled={isLoading}
              >
                <FaSave className="mr-2 w-4 h-4" />{" "}
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary inline-flex items-center"
                disabled={isLoading}
              >
                <FaTimes className="mr-2 w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <div className="relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-500" />
              )}
              {isEditing && (
                <div className="input-container mt-2">
                  <FaImage className="input-icon" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="input-field block w-full pl-8"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Person */}
          <div className="input-container">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Person
            </label>
            {isEditing ? (
              <div className="relative">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="input-field block w-full"
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <p className="view-mode">{profile.name || "N/A"}</p>
            )}
          </div>

          {/* Email */}
          <div className="input-container">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <div className="relative">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="input-field block w-full"
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <p className="view-mode">{profile.email || "N/A"}</p>
            )}
          </div>

          {/* Phone */}
          <div className="input-container">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            {isEditing ? (
              <div className="relative">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="input-field block w-full"
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <p className="view-mode">{profile.phone || "N/A"}</p>
            )}
          </div>

          {/* Business Name */}
          <div className="input-container">
            <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name
            </label>
            {isEditing ? (
              <div className="relative">
                <FaBuilding className="input-icon" />
                <input
                  type="text"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleChange}
                  className="input-field block w-full"
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <p className="view-mode">{profile.businessName || "N/A"}</p>
            )}
          </div>

          {/* PAN (View Mode Only) */}
          {!isEditing && (
            <div className="input-container">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                PAN
              </label>
              <p className="view-mode">{profile.pan || "N/A"}</p>
            </div>
          )}

          {/* GST (View Mode Only) */}
          {!isEditing && (
            <div className="input-container">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                GST
              </label>
              <p className="view-mode">{profile.gst || "N/A"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;

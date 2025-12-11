import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useWebsiteSettings } from "../context/WebsiteSettingsContext";
import loginImg from "../assets/login/login.jpg";
import signupImg from "../assets/login/register.jpg";
import { api, endpoints } from "../api/api-config";
import { useSearch } from "../context/SearchContext";
import "react-toastify/dist/ReactToastify.css";

import {
  GlobeAltIcon,
  BriefcaseIcon,
  UsersIcon,
  CameraIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";



const dropdownItems = [
  { name: "My Profile", href: "/profile" },
  { name: "My Bookings", href: "/my-bookings" },
  { name: "Logout", href: "#", action: "logout" },
];

const tourItineraries = [];
const blogLinks = [];

export default function Header() {
  const { settings } = useWebsiteSettings();
  const { isLoggedIn, setIsLoggedIn, user, setUser, handleSearch } =
    useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showForgotOTP, setShowForgotOTP] = useState(false);
  const [forgotVerified, setForgotVerified] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", ""]); // Changed to array for 4-digit input
  const [verifiedRegisterOtp, setVerifiedRegisterOtp] = useState("");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", ""]); // Changed to array for 4-digit input
  const [newPassword, setNewPassword] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setPhoneOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
    setRegisterErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleForgotOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setForgotOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
    setForgotPasswordErrors((prev) => ({ ...prev, forgotOtp: "" }));
  };

  // Debugging context
  useEffect(() => {
    console.log("SearchContext values:", { isLoggedIn, user });
  }, [isLoggedIn, user]);

  // Check for existing user session from cookies or localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData"); // Renamed to avoid confusion with parameter
    const userNameCookie = Cookies.get("userName"); // Renamed
    setIsLoadingUser(true);

    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        // Validate required fields (already there)
        if (
          parsedUserData &&
          parsedUserData.fullName &&
          parsedUserData.email &&
          parsedUserData.mobile
        ) {
          setUser(parsedUserData);
          setIsLoggedIn(true);
          console.log("User restored from localStorage with full data:", parsedUserData);
          // Sync cookie with fullName - keep this as it updates the cookie if necessary
          if (userNameCookie !== parsedUserData.fullName) {
            Cookies.set("userName", parsedUserData.fullName, { expires: 7 });
          }
        } else {
          console.warn("Invalid user data in localStorage, clearing:", parsedUserData);
          localStorage.removeItem("userData");
          setIsLoggedIn(false);
          setUser(null);
          // If invalid, try fallback to cookie if it exists (though it will be incomplete)
          if (userNameCookie) {
             setUser({ fullName: userNameCookie });
             setIsLoggedIn(true);
             console.log("User partially restored from cookies after invalid localStorage data:", userNameCookie);
          }
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage, clearing:", error);
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setUser(null);
         // If error, try fallback to cookie if it exists
        if (userNameCookie) {
           setUser({ fullName: userNameCookie });
           setIsLoggedIn(true);
           console.log("User partially restored from cookies after error in localStorage parsing:", userNameCookie);
        }
      }
    } else if (userNameCookie) { // Only fallback to userName cookie if NO userData in localStorage
      setUser({ fullName: userNameCookie });
      setIsLoggedIn(true);
      console.log("User restored from cookies (no localStorage userData):", userNameCookie);
    } else { // No user data anywhere
      setIsLoggedIn(false);
      setUser(null);
      console.log("No user found in cookies or localStorage.");
    }
    setIsLoadingUser(false);
  }, [setIsLoggedIn, setUser]);

  // Open login dialog if redirected with openLogin: true
  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErrors({}); // Clear previous errors

    if (!validateLogin()) {
      Object.values(loginErrors).forEach((error) => toast.error(error));
      return;
    }

    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identifier);
    const loginData = isValidEmail
      ? { email: identifier, password }
      : { mobile: identifier, password };

    try {
      setIsLoading(true);
      console.log("Logging in with data:", loginData);
      const response = await api.post("/api/v1/auth/login", loginData);
      console.log("Login response:", response.data);

      if (response.data.success) {
        const userData = response.data.data;
        if (!userData.fullName || !userData.email || !userData.mobile) {
          throw new Error("Incomplete user data received from server");
        }

        localStorage.setItem("userData", JSON.stringify(userData));
        Cookies.set("userName", userData.fullName, { expires: 7 });
        setUser(userData);
        setIsLoggedIn(true);
        toast.success(response.data.message || "Login successful!");

        setIdentifier("");
        setPassword("");
        setLoginOpen(false);

        const { from, car } = location.state || {};
        if (from === "/" && car) {
          navigate("/car-listing", { state: { car } });
        } else {
          navigate(from || "/");
        }
      } else {
        setLoginErrors({ general: response.data.message || "Login failed" });
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setLoginErrors({ general: "Login failed: " + errorMessage });
      toast.error("Login failed: " + errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Function
  const handleLogout = () => {
    console.log("Initiating user logout...");
    Cookies.remove("userName");
    localStorage.removeItem("userData");
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorName");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Email or Phone is required";
    } else if (
      !/\S+@\S+\.\S+/.test(identifier) &&
      !/^\d{10}$/.test(identifier)
    ) {
      newErrors.identifier = "Enter a valid email or 10-digit phone number";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPassword = (stage) => {
    const newErrors = {};
    if (stage === "sendOtp") {
      if (!forgotIdentifier.trim()) {
        newErrors.forgotIdentifier = "Email or Mobile Number is required";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          forgotIdentifier
        ) &&
        !/^\d{10}$/.test(forgotIdentifier)
      ) {
        newErrors.forgotIdentifier =
          "Enter a valid email or 10-digit mobile number";
      }
    } else if (stage === "verifyOtp") {
      if (!forgotOtp.join("").trim()) {
        newErrors.forgotOtp = "OTP is required";
      } else if (forgotOtp.join("").length !== 4) {
        newErrors.forgotOtp = "OTP must be 4 digits";
      }
    } else if (stage === "resetPassword") {
      if (!newPassword.trim()) {
        newErrors.newPassword = "New password is required";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters long.";
      } else if (!/(?=.*[a-z])/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one lowercase letter.";
      } else if (!/(?=.*[A-Z])/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one uppercase letter.";
      } else if (!/(?=.*\d)/.test(newPassword)) {
        newErrors.newPassword = "Password must contain at least one number.";
      } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain at least one special character.";
      }
    }
    setForgotPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!registerPassword) {
      newErrors.registerPassword = "Password is required";
    } else if (registerPassword.length < 8) {
      newErrors.registerPassword =
        "Password must be at least 8 characters long.";
    } else if (!/(?=.*[a-z])/.test(registerPassword)) {
      newErrors.registerPassword =
        "Password must contain at least one lowercase letter.";
    } else if (!/(?=.*[A-Z])/.test(registerPassword)) {
      newErrors.registerPassword =
        "Password must contain at least one uppercase letter.";
    } else if (!/(?=.*\d)/.test(registerPassword)) {
      newErrors.registerPassword = "Password must contain at least one number.";
    } else if (!/(?=.*[@$!%*?&])/.test(registerPassword)) {
      newErrors.registerPassword =
        "Password must contain at least one special character.";
    }
    if (!pan.trim()) {
      newErrors.pan = "PAN Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      newErrors.pan = "Invalid PAN number format.";
    }
    if (
      gst.trim() &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
    ) {
      newErrors.gst = "Invalid GST number format.";
    }
    if (!acceptedTerms) {
      newErrors.acceptedTerms = "You must accept the terms and conditions.";
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Register Function
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) {
      Object.values(registerErrors).forEach((error) => toast.error(error));
      return;
    }
    if (!showPhoneOTP && !phoneVerified) {
      if (!mobile) {
        toast.error("Please enter a mobile number.");
        return;
      }
      setShowPhoneOTP(true);
      toast.info(`Enter any 4-digit OTP for ${mobile}.s`);
      return;
    }
    if (showPhoneOTP && !phoneVerified) {
      if (phoneOtp.join("").length === 4) {
        setPhoneVerified(true);
        setVerifiedRegisterOtp(phoneOtp.join(""));
        setShowPhoneOTP(false);
        toast.success("Phone number verified!");
      } else {
        toast.error("Please enter a 4-digit OTP.");
        return;
      }
    }
    const formData = {
      fullName,
      email,
      mobile,
      password: registerPassword,
      pan,
      gst,
      city: "Mumbai",
      acceptedTerms,
      otp: verifiedRegisterOtp,
    };
    try {
      setIsLoading(true);
      console.log("Registering user with data:", formData);
      const response = await api.post(endpoints.signup, formData);
      console.log("Register response:", response.data);
      if (response.data.statusCode === 201 && response.data.success) {
        const userData = response.data.data; // Expecting { _id, fullName, email, mobile }
        // Validate required fields
        if (!userData.fullName || !userData.email || !userData.mobile) {
          throw new Error("Incomplete user data received from server");
        }
        localStorage.setItem("userData", JSON.stringify(userData));
        Cookies.set("userName", userData.fullName, { expires: 7 });
        setUser(userData);
        setIsLoggedIn(true);
        toast.success(response.data.message || "Registration successful!");
        setFullName("");
        setEmail("");
        setMobile("");
        setRegisterPassword("");
        setPan("");
        setGst("");
        setAcceptedTerms(false);
        setPhoneVerified(false);
        setPhoneOtp(["", "", "", ""]);
        setVerifiedRegisterOtp("");
        setRegisterOpen(false);

        const { from, car, pendingSearch } = location.state || {};
        if (pendingSearch) {
          handleSearch(pendingSearch.data, pendingSearch.tab);
        } else if (from === "/car-listing" && car) {
          navigate("/car-details", { state: { car } });
        } else {
          navigate(from || "/");
        }
      }
    } catch (error) {
      toast.error(
        "Registration failed: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Vendor Registration Navigation
  const handleVendorRegister = () => {
    navigate("/vendor-login");
  };

  // Forgot Password: Step 1 - Send OTP
  const handleSendForgotOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordErrors({}); // Clear previous errors
    if (!validateForgotPassword("sendOtp")) {
      Object.values(forgotPasswordErrors).forEach((error) =>
        toast.error(error)
      );
      return;
    }
    const payload = { phone: forgotIdentifier }; // Assuming backend takes 'identifier'
    try {
      setIsLoading(true);
      console.log("Sending OTP with data:", payload);
      const response = await api.post("/api/v1/auth/send-forget-otp", payload, {
        withCredentials: false,
      });
      console.log("Send OTP response:", response.data);
      if (response.data.success) {
        toast.info(`Enter any 4-digit OTP for ${forgotIdentifier}.`);
        setShowForgotOTP(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
      console.error("Send OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 2 - Verify OTP
  const handleVerifyForgotOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordErrors({}); // Clear previous errors
    if (!validateForgotPassword("verifyOtp")) {
      Object.values(forgotPasswordErrors).forEach((error) =>
        toast.error(error)
      );
      return;
    }
    const payload = { phone: forgotIdentifier, otp: forgotOtp.join("") };
    try {
      setIsLoading(true);
      console.log("Verifying OTP:", forgotOtp);
      const response = await api.post(
        "/api/v1/auth/verify-forget-otp", // Assuming a dedicated verify-forgot-otp endpoint
        payload
      );
      console.log("Verify OTP response:", response.data);
      if (response.data.success) {
        setForgotVerified(true);
        setShowForgotOTP(false);
        toast.success("OTP verified successfully!");
      } else {
        toast.error(response.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
      console.error("Verify OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordErrors({}); // Clear previous errors
    if (!validateForgotPassword("resetPassword")) {
      Object.values(forgotPasswordErrors).forEach((error) =>
        toast.error(error)
      );
      return;
    }
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(forgotIdentifier);
    const resetData = isValidEmail
      ? { email: forgotIdentifier, newPassword }
      : { phone: forgotIdentifier, newPassword };
    try {
      setIsLoading(true);
      console.log("Resetting password with data:", resetData);
      const response = await api.post("/api/v1/auth/reset-password", resetData);
      console.log("Reset password response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully!");
        setForgotPasswordOpen(false);
        setForgotIdentifier("");
        setForgotOtp("");
        setNewPassword("");
        setForgotVerified(false);
        setLoginOpen(true);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state while user data is being fetched
  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="font-grotesk"
      />
      <header className="bg-white absolute inset-x-0 top-0 z-50 left-0 right-0 backdrop-blur-md border-b border-gray-200">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-0"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 rounded-2xl">
              <img
                alt="logo"
                src={settings?.logo?.url || ""}
                className="h-16 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="h-8 w-8 rounded-md text-orange-600 bg-orange-100 p-1"
              />
            </button>
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            {isLoggedIn && user && (
              <Popover className="relative cursor-pointer">
                <PopoverButton className="cursor-pointer flex items-center gap-x-2 text-md font-grotesk font-semibold text-white">
                  <UserIcon
                    className="h-10 w-10 bg-[#FF6900] p-2 rounded-full text-white"
                    aria-hidden="true"
                  />
                  <span className="text-black">{user?.fullName || "User"}</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-700"
                  />
                </PopoverButton>
                <PopoverPanel
                  transition
                  className="absolute right-0 z-10 mt-3 w-48 rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-150 data-[leave]:ease-in"
                >
                  <div className="p-2">
                    {dropdownItems.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-4 rounded-lg p-2 text-md font-grotesk hover:bg-gray-50"
                      >
                        {item.action === "logout" ? (
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left font-semibold text-gray-900"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className="block w-full font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>
            )}
            {!isLoggedIn && (
              <div className="flex items-center gap-x-2">
                <UserIcon
                  className="h-10 w-10 bg-[#FF6900] p-2 rounded-full text-white"
                  aria-hidden="true"
                />
                <button
                  onClick={() => setLoginOpen(true)}
                  className="text-md cursor-pointer font-grotesk font-semibold text-black"
                >
                  Login
                </button>
                <span className="text-black">/</span>
                <button
                  onClick={() => setRegisterOpen(true)}
                  className="text-md cursor-pointer font-grotesk font-semibold text-black"
                >
                  Register
                </button>
                <button
                  onClick={handleVendorRegister}
                  className="ml-2 cursor-pointer bg-[#384B59] px-3 py-2.5 text-md font-grotesk font-semibold text-white border-none rounded-lg"
                >
                  Login as Vendor
                </button>
              </div>
            )}
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src={settings?.logo?.url || ""}
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
           
          </DialogPanel>
        </Dialog>
        <Dialog open={loginOpen} onClose={setLoginOpen}>
          <div className="fixed inset-0 bg-black/30 z-50" aria-hidden="true" />
          <DialogPanel className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex max-w-4xl w-full bg-white rounded-4xl overflow-hidden shadow-lg">
              <div className="hidden md:block md:w-1/3">
                <img
                  src={loginImg}
                  alt="Login background"
                  className="w-full h-full object-cover rounded-l-4xl"
                />
              </div>
              <div className="w-full md:w-2/3 p-8 flex flex-col justify-start relative">
                <button
                  type="button"
                  onClick={() => {
                    setLoginOpen(false);
                    setLoginErrors({});
                  }}
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2 className="text-4xl font-grotesk font-extrabold text-gray-900 mb-8">
                  Login
                </h2>
                <div className="space-y-6">
                  <div className="relative">
                    <label
                      htmlFor="login-identifier"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Email or Phone
                    </label>
                    <div className="mt-1 relative">
                      <EnvelopeIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        id="login-identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          loginErrors.identifier ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email or phone"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <LockClosedIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          loginErrors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showLoginPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        setForgotPasswordOpen(true);
                      }}
                      className="text-sm cursor-pointer font-grotesk text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-[#384A5A] text-white py-3 rounded-md hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <div className="text-center">
                    <span className="text-sm font-grotesk text-gray-600">
                      Don’t have an account?{" "}
                      <button
                        onClick={() => {
                          setLoginOpen(false);
                          setRegisterOpen(true);
                        }}
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-semibold"
                      >
                        Register
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
        <Dialog open={registerOpen} onClose={setRegisterOpen}>
          <div className="fixed inset-0 bg-black/30 z-50" aria-hidden="true" />
          <DialogPanel className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex max-w-4xl w-full bg-white rounded-4xl overflow-hidden shadow-lg">
              <div className="hidden md:block md:w-1/3">
                <img
                  src={signupImg}
                  alt="Register background"
                  className="h-full w-full object-cover rounded-l-4xl"
                />
              </div>
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-start relative overflow-y-auto h-[600px]">
                <button
                  type="button"
                  onClick={() => setRegisterOpen(false)}
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2 className="text-4xl font-grotesk font-extrabold text-gray-900 mb-3">
                  Register
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-2 justify-between">
                    <div className="relative w-full">
                      <label
                        htmlFor="full-name"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <UserIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                          aria-hidden="true"
                        />
                        <input
                          id="full-name"
                          type="text"
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            registerErrors.fullName ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="relative w-full">
                      <label
                        htmlFor="reg-email"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        Email
                      </label>
                      <div className="mt-1 relative">
                        <EnvelopeIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            registerErrors.email ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="mobile"
                      className="block font-grotesk text-sm font-medium text-black"
                    >
                      Mobile Number
                    </label>
                    <div className="mt-1 relative flex items-center">
                      <DevicePhoneMobileIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                        aria-hidden="true"
                      />
                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => setMobile(e.target.value)}
                        className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                          registerErrors.mobile ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your mobile number"
                      />
                      {!phoneVerified && !showPhoneOTP && (
                        <button
                          onClick={async () => {
                            if (!mobile) {
                              toast.error("Please enter a mobile number.");
                              return;
                            }
                            try {
                              setIsLoading(true);
                              const response = await api.post(
                                "/api/v1/otp/send",
                                { phone: mobile },
                                { withCredentials: false }
                              );
                              if (response.data.success) {
                                setShowPhoneOTP(true);
                                toast.info(`OTP sent to ${mobile}.`);
                              } else {
                                toast.error(
                                  response.data.message || "Failed to send OTP"
                                );
                              }
                            } catch (error) {
                              toast.error(
                                "Error: " +
                                  (error.response?.data?.message ||
                                    error.message)
                              );
                              console.error("Send OTP error:", error);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading}
                          className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Verify"}
                        </button>
                      )}
                      {phoneVerified && (
                        <CheckIcon
                          className="ml-4 h-6 w-6 text-green-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {showPhoneOTP && !phoneVerified && (
                      <div className="mt-2 flex items-center justify-between space-x-2">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            id={`register-otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={phoneOtp[index]}
                            onChange={(e) =>
                              handleRegisterOtpChange(e.target, index)
                            }
                            onFocus={(e) => e.target.select()}
                            className="block w-12 h-12 text-center text-xl rounded-md border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          />
                        ))}
                        <button
                          onClick={async () => {
                            if (phoneOtp.join("").length !== 4) {
                              toast.error("Please enter a 4-digit OTP.");
                              return;
                            }
                            try {
                              setIsLoading(true);
                              const response = await api.post(
                                "/api/v1/otp/verify",
                                { phone: mobile, otp: phoneOtp.join("") }
                              ); // Assuming a verify-otp endpoint
                              if (response.data.success) {
                                setPhoneVerified(true);
                                setVerifiedRegisterOtp(phoneOtp.join(""));
                                setShowPhoneOTP(false);
                                toast.success("Phone number verified!");
                              } else {
                                toast.error(
                                  response.data.message ||
                                    "Failed to verify OTP"
                                );
                              }
                            } catch (error) {
                              toast.error(
                                "Error: " +
                                  (error.response?.data?.message ||
                                    error.message)
                              );
                              console.error("Verify OTP error:", error);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading || phoneOtp.join("").length !== 4}
                          className="ml-2 bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? "Verifying..." : "Submit"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 justify-between">
                    <div className="relative w-full">
                      <label
                        htmlFor="reg-password"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        Password
                      </label>
                      <div className="mt-1 relative">
                        <LockClosedIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-password"
                          type={showRegisterPassword ? "text" : "password"}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            registerErrors.registerPassword
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRegisterPassword(!showRegisterPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showRegisterPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="relative w-full">
                      <label
                        htmlFor="pan"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        PAN Number
                      </label>
                      <div className="mt-1 relative">
                        <DocumentTextIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                          aria-hidden="true"
                        />
                        <input
                          id="pan"
                          type="text"
                          value={pan}
                          minLength={10}
                          maxLength={10}
                          onChange={(e) => setPan(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            registerErrors.pan ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your PAN number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <div className="relative w-full">
                      <label
                        htmlFor="gst"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        GST Number
                      </label>
                      <div className="mt-1 relative">
                        <DocumentTextIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#9e9e9e]"
                          aria-hidden="true"
                        />
                        <input
                          id="gst"
                          type="text"
                          minLength={15}
                          maxLength={15}
                          value={gst}
                          onChange={(e) => setGst(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            registerErrors.gst ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your GST number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="acceptedTerms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="h-4 w-4 text-[#FF6900] border-[#FF6900] rounded"
                    />
                    <label
                      htmlFor="acceptedTerms"
                      className="ml-2 block text-sm font-grotesk text-gray-900"
                    >
                      Agree to terms and conditions
                    </label>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full bg-[#384A5A] text-white py-3 cursor-pointer rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </button>
                  <div className="text-center">
                    <span className="text-sm font-grotesk text-gray-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setRegisterOpen(false);
                          setLoginOpen(true);
                        }}
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-semibold"
                      >
                        Login
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
        <Dialog
          open={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30 z-50" aria-hidden="true" />
          <DialogPanel className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex max-w-md w-full bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-full flex flex-col justify-start relative">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2 className="text-2xl font-grotesk font-extrabold text-gray-900 mb-6">
                  {forgotVerified
                    ? "Reset Password"
                    : showForgotOTP
                    ? "Verify OTP"
                    : "Forgot Password"}
                </h2>
                <div className="space-y-4">
                  {!forgotVerified && (
                    <div className="relative">
                      <label
                        htmlFor="forgot-identifier"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        Mobile Number
                      </label>
                      <div className="mt-1 relative flex items-center">
                        <EnvelopeIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          id="forgot-identifier"
                          type="text"
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            forgotPasswordErrors.forgotIdentifier
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your mobile number"
                          disabled={showForgotOTP}
                        />
                        {!showForgotOTP && (
                          <button
                            onClick={handleSendForgotOTP}
                            disabled={isLoading}
                            className="ml-4 whitespace-nowrap bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                          >
                            {isLoading ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                  />
                                </svg>
                                Sending...
                              </span>
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {showForgotOTP && !forgotVerified && (
                    <div className="relative">
                      <label
                        htmlFor="forgot-otp"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        OTP
                      </label>
                      <div className="mt-1 relative flex items-center justify-between space-x-2">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            id={`forgot-otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={forgotOtp[index]}
                            onChange={(e) =>
                              handleForgotOtpChange(e.target, index)
                            }
                            onFocus={(e) => e.target.select()}
                            className={`block w-12 h-12 text-center text-xl rounded-md border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                              forgotPasswordErrors.forgotOtp
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        ))}
                        <button
                          onClick={handleVerifyForgotOTP}
                          disabled={
                            isLoading || forgotOtp.join("").length !== 4
                          }
                          className="ml-2 bg-[#FF6900] text-white py-2 px-4 rounded-xl hover:bg-[#CC5500] font-grotesk font-semibold disabled:opacity-50"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                              Verifying...
                            </span>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {forgotVerified && (
                    <div className="relative">
                      <label
                        htmlFor="new-password"
                        className="block font-grotesk text-sm font-medium text-black"
                      >
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <LockClosedIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50 ${
                            forgotPasswordErrors.newPassword
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Enter new password (min 8 characters)"
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
                  )}
                  {forgotVerified && (
                    <button
                      onClick={handleResetPassword}
                      disabled={isLoading}
                      className="w-full bg-[#384A5A] text-white py-3 rounded-md hover:bg-[#FF6900] font-grotesk font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Resetting Password...
                        </span>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  )}
                  <div className="text-center">
                    <span className="text-sm font-grotesk text-gray-600">
                      Back to{" "}
                      <button
                        onClick={() => {
                          setForgotPasswordOpen(false);
                          setShowForgotOTP(false);
                          setForgotVerified(false);
                          setForgotIdentifier("");
                          setForgotOtp(["", "", "", ""]);
                          setNewPassword("");
                          setLoginOpen(true);
                        }}
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 font-semibold"
                      >
                        Login
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
}

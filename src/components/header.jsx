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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import logo from "../assets/logo/logo-cab.png";
import loginImg from "../assets/login/login.jpg";
import signupImg from "../assets/login/register.jpg";
import { api, endpoints } from "../api/api-config";
import { useSearch } from "../context/SearchContext";
import "react-toastify/dist/ReactToastify.css";

import { GlobeAltIcon, BriefcaseIcon, UsersIcon, CameraIcon, CalendarIcon } from '@heroicons/react/24/outline';

const services = [
  {
    name: "Leisure & Holiday Travel",
    description: "Explore South India in comfort and style.",
    href: "/services#leisure",
    icon: GlobeAltIcon,
  },
  {
    name: "Corporate Travel",
    description: "Dependable mobility solutions for your business.",
    href: "/services#corporate",
    icon: BriefcaseIcon,
  },
  {
    name: "Events & Delegations",
    description: "Seamless multi-vehicle coordination for groups.",
    href: "/services#events",
    icon: UsersIcon,
  },
  {
    name: "City & Sightseeing Tours",
    description: "Discover the best of every destination.",
    href: "/services#sightseeing",
    icon: CameraIcon,
  },
    {
    name: "MICE Transport",
    description: "Tailored ground transport for large events.",
    href: "/services#mice",
    icon: CalendarIcon,
  },
];

const dropdownItems = [
  { name: "My Profile", href: "/profile" },
  { name: "My Bookings", href: "/my-bookings" },
  { name: "Logout", href: "#", action: "logout" },
];

const tourItineraries = [];
const blogLinks = [];

export default function Header() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showForgotOTP, setShowForgotOTP] = useState(false);
  const [forgotVerified, setForgotVerified] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [verifiedRegisterOtp, setVerifiedRegisterOtp] = useState("");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Debugging context
  useEffect(() => {
    console.log("SearchContext values:", { isLoggedIn, user });
  }, [isLoggedIn, user]);

  // Check for existing user session from cookies or localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const userName = Cookies.get("userName");
    setIsLoadingUser(true);
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        // Validate required fields
        if (
          parsedUserData &&
          parsedUserData.fullName &&
          parsedUserData.email &&
          parsedUserData.mobile
        ) {
          setUser(parsedUserData);
          setIsLoggedIn(true);
          console.log("User restored from localStorage:", parsedUserData);
          // Sync cookie with fullName
          if (userName !== parsedUserData.fullName) {
            console.warn(
              "Cookie userName mismatch:",
              userName,
              "vs",
              parsedUserData.fullName
            );
            Cookies.set("userName", parsedUserData.fullName, { expires: 7 });
          }
        } else {
          console.warn("Invalid user data in localStorage:", parsedUserData);
          localStorage.removeItem("userData"); // Clean up invalid data
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
        localStorage.removeItem("userData"); // Clean up corrupted data
        setIsLoggedIn(false);
        setUser(null);
      }
    } else if (userName) {
      // Fallback for old cookie-based session
      setUser({ fullName: userName });
      setIsLoggedIn(true);
      console.log("User restored from cookies:", userName);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      console.log("No user found in cookies or localStorage");
    }
    setIsLoadingUser(false);
  }, [setIsLoggedIn, setUser]);

  // Open login dialog if redirected with openLogin: true
  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true);
    }
  }, [location.state]);

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Validation
    if (!identifier) {
      setLoginError("Please enter an email or mobile number.");
      toast.error("Please enter an email or mobile number.");
      return;
    }
    if (!password) {
      setLoginError("Please enter a password.");
      toast.error("Please enter a password.");
      return;
    }
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identifier);
    const isValidMobile = /^\d{10}$/.test(identifier);
    if (!isValidEmail && !isValidMobile) {
      setLoginError("Please enter a valid email or 10-digit mobile number.");
      toast.error("Please enter a valid email or 10-digit mobile number.");
      return;
    }

    const loginData = isValidEmail
      ? { email: identifier, password }
      : { mobile: identifier, password };

    try {
      setIsLoading(true);
      console.log("Logging in with data:", loginData);
      const response = await api.post("/api/v1/auth/login", loginData);
      console.log("Login response:", response.data);

      if (response.data.success) {
        const userData = response.data.data; // Expecting { _id, fullName, email, mobile }
        // Validate required fields
        if (!userData.fullName || !userData.email || !userData.mobile) {
          throw new Error("Incomplete user data received from server");
        }
        // Save full user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        // Save userName in cookie for backward compatibility
        Cookies.set("userName", userData.fullName, { expires: 7 });
        setUser(userData);
        setIsLoggedIn(true);
        toast.success(response.data.message || "Login successful!");
        setIdentifier("");
        setPassword("");
        setLoginOpen(false);

        // Handle redirect after login
        const { from, car, pendingSearch } = location.state || {};
        if (pendingSearch) {
          handleSearch(pendingSearch.data, pendingSearch.tab);
        } else if (from === "/car-listing" && car) {
          navigate("/car-details", { state: { car } });
        } else {
          navigate(from || "/");
        }
      } else {
        setLoginError(response.data.message || "Login failed");
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setLoginError("Login failed: " + errorMessage);
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

  // Register Function
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !mobile || !registerPassword || !pan || !gst) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("You must accept the terms and conditions to register.");
      return;
    }
    if (!showPhoneOTP && !phoneVerified) {
      if (!mobile) {
        toast.error("Please enter a mobile number.");
        return;
      }
      setShowPhoneOTP(true);
      toast.info(`Enter any 4-digit OTP for ${mobile} (use 1234 for testing)`);
      return;
    }
    if (showPhoneOTP && !phoneVerified) {
      if (phoneOtp.length === 4) {
        setPhoneVerified(true);
        setVerifiedRegisterOtp(phoneOtp);
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
        setPhoneOtp("");
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
    navigate("/vendor-registration");
  };

  // Forgot Password: Step 1 - Send OTP
  const handleSendForgotOTP = async (e) => {
    e.preventDefault();
    if (!forgotIdentifier) {
      toast.error("Please enter an email or mobile number.");
      return;
    }
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(forgotIdentifier);
    const isValidMobile = /^\d{10}$/.test(forgotIdentifier);
    if (!isValidEmail && !isValidMobile) {
      toast.error("Please enter a valid email or 10-digit mobile number.");
      return;
    }
    const forgotData = isValidEmail
      ? { email: forgotIdentifier }
      : { mobile: forgotIdentifier };
    try {
      setIsLoading(true);
      console.log("Sending OTP with data:", forgotData);
      const response = await api.put(
        "/api/v1/auth/forget-password",
        forgotData
      );
      console.log("Send OTP response:", response.data);
      if (response.data.success) {
        toast.info(
          `Enter any 4-digit OTP for ${forgotIdentifier} (use 1234 for testing)`
        );
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
    if (forgotOtp.length !== 4) {
      toast.error("Please enter a 4-digit OTP.");
      return;
    }
    if (forgotOtp !== "1234") {
      toast.error("Invalid OTP. Please enter 1234.");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Verifying OTP:", forgotOtp);
      setForgotVerified(true);
      setShowForgotOTP(false);
      toast.success("OTP verified successfully!");
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
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(forgotIdentifier);
    const resetData = isValidEmail
      ? { email: forgotIdentifier, otp: forgotOtp, password: newPassword }
      : { mobile: forgotIdentifier, otp: forgotOtp, password: newPassword };
    try {
      setIsLoading(true);
      console.log("Resetting password with data:", resetData);
      const response = await api.put("/api/v1/auth/forget-password", resetData);
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
              <img alt="logo" src={logo} className="h-16 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-md font-grotesk font-semibold text-black">
                Mobility Solutions
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-none text-gray-700"
                />
              </PopoverButton>
              <PopoverPanel
                transition
                className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-150 data-[leave]:ease-in"
              >
                <div className="p-4">
                  {services.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-md font-grotesk hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>
            <Link to="/about" className="text-md font-grotesk font-semibold text-black">
              About Us
            </Link>
          </PopoverGroup>
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
                <img alt="" src={logo} className="h-8 w-auto" />
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
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="px-3">
                    <h2 className="text-md font-grotesk font-semibold text-gray-900">
                      Reliable B2B Transport Solution
                    </h2>
                    <p className="text-sm font-normal text-gray-600">
                      Cabs for Holiday Packages, Transfers, Outstation Rentals,
                      MICE Events
                    </p>
                  </div>
                  <Disclosure as="div" className="-mx-3">
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Services Offered
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-2">
                      {services.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                  <Disclosure as="div" className="-mx-3">
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      Tour Itineraries
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-2">
                      {tourItineraries.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                  <Disclosure as="div" className="-mx-3">
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                      More
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-2">
                      {blogLinks.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </DisclosurePanel>
                  </Disclosure>
                  <a
                    href="#"
                    className="block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Contact
                  </a>
                </div>
                <div className="py-6">
                  {isLoggedIn && user && (
                    <Disclosure as="div" className="-mx-3">
                      <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                        <div className="flex items-center gap-x-2">
                          <UserIcon
                            className="h-5 w-5 text-gray-900"
                            aria-hidden="true"
                          />
                          <span>{user?.fullName || "User"}</span>
                        </div>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 space-y-2">
                        {dropdownItems.map((item) =>
                          item.action === "logout" ? (
                            <DisclosureButton
                              key={item.name}
                              as="button"
                              onClick={handleLogout}
                              className="block w-full text-left rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </DisclosureButton>
                          ) : (
                            <DisclosureButton
                              key={item.name}
                              as={Link}
                              to={item.href}
                              className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </DisclosureButton>
                          )
                        )}
                      </DisclosurePanel>
                    </Disclosure>
                  )}
                  {!isLoggedIn && (
                    <div className="flex items-center gap-x-2 -mx-3 px-3">
                      <UserIcon
                        className="h-5 w-5 text-gray-900"
                        aria-hidden="true"
                      />
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="text-base/7 font-semibold text-gray-900"
                      >
                        Login
                      </button>
                      <span className="text-gray-900">/</span>
                      <button
                        onClick={() => setRegisterOpen(true)}
                        className="text-base/7 font-semibold text-gray-900"
                      >
                        Register
                      </button>
                      <button
                        onClick={handleVendorRegister}
                        className="ml-2 cursor-pointer block rounded-lg bg-[#384B59] px-3 py-2.5 text-base/7 font-semibold text-white border-none"
                      >
                        Login as Vendor
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                    setLoginError("");
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
                        className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                  {loginError && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      {loginError}
                    </p>
                  )}
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
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
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
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
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
                        onChange={(e) => setMobile(e.target.value)}
                        className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                        placeholder="Enter your mobile number"
                      />
                      {!phoneVerified && !showPhoneOTP && (
                        <button
                          onClick={() => {
                            if (!mobile) {
                              toast.error("Please enter a mobile number.");
                              return;
                            }
                            setShowPhoneOTP(true);
                            toast.info(
                              `Enter any 4-digit OTP for ${mobile} (use 1234 for testing)`
                            );
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
                      <div className="mt-2 flex items-center">
                        <input
                          type="text"
                          maxLength={4}
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          className="w-32 py-2 px-5 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          placeholder="4-digit OTP"
                        />
                        <button
                          onClick={() => {
                            if (phoneOtp.length === 4) {
                              setPhoneVerified(true);
                              setVerifiedRegisterOtp(phoneOtp);
                              setShowPhoneOTP(false);
                              toast.success("Phone number verified!");
                            } else {
                              toast.error("Please enter a 4-digit OTP.");
                            }
                          }}
                          disabled={isLoading || phoneOtp.length !== 4}
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
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          placeholder="Enter your password"
                        />
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
                          onChange={(e) => setPan(e.target.value)}
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
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
                          value={gst}
                          onChange={(e) => setGst(e.target.value)}
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
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
                        Email or Mobile Number
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
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          placeholder="Enter your email or mobile number"
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
                        OTP (Use 1234 for testing)
                      </label>
                      <div className="mt-1 relative flex items-center">
                        <input
                          id="forgot-otp"
                          type="text"
                          maxLength={4}
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          className="block w-32 py-2 px-5 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          placeholder="4-digit OTP"
                        />
                        <button
                          onClick={handleVerifyForgotOTP}
                          disabled={isLoading || forgotOtp.length !== 4}
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
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full py-3 px-5 pl-10 rounded-full border-gray-200 border focus:border-[#FF6900] focus:ring focus:ring-[#FF6900] focus:ring-opacity-50"
                          placeholder="Enter new password (min 8 characters)"
                        />
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
                          setForgotOtp("");
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

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../vendor/auth/ProtectedRoute';

// Loading component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

// Lazy-loaded pages
const Home = lazy(() => import('../pages/home'));
const VendorLayout = lazy(() => import('../vendor/layouts/VendorLayout'));
const VendorDashboardHome = lazy(() => import('../vendor/pages/VendorDashboardHome'));
const VendorLogin = lazy(() => import('../vendor/auth/login'));
const VendorRegistration = lazy(() => import('../vendor/auth/register'));
const VendorAddcar = lazy(() => import('../vendor/pages/AddCar'));
const VendorCarList = lazy(() => import('../vendor/pages/VendorCarList'));
const VendorProfile = lazy(() => import('../vendor/pages/Vendorprofile'));
const CarListing = lazy(() => import('../pages/carlisting'));
const CardDetails = lazy(() => import('../pages/BookingDetailsPage'));
const ExplorePackages = lazy(() => import('../pages/ExplorePackages'));
const SuccessPage = lazy(() => import('../pages/SuccessPage'));
const MyProfilePage = lazy(() => import('../pages/MyProfilePage'));
const MyBookingsPage = lazy(() => import('../pages/MyBookingsPage'));
const MyBookingDetailPage = lazy(() => import('../pages/MyBookingDetailPage'));
const MobilitySolutionsPage = lazy(() => import('../pages/MobilitySolutionsPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));
const OurTeamPage = lazy(() => import('../pages/OurTeamPage'));
const TermAndConditionPage = lazy(() => import('../pages/legal/TermAndConditionPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/legal/PrivacyPolicyPage'));
const LegalNoticePage = lazy(() => import('../pages/legal/LegalNoticePage'));
const AccessibilityPage = lazy(() => import('../pages/legal/AccessibilityPage'));
const PaymentPolicyPage = lazy(() => import('../pages/legal/PaymentPolicyPage'));
const FailurePage = lazy(() => import('../pages/FailurePage'));
const ContactUsPage = lazy(() => import('../pages/ContactUsPage'));
const AllBookingsPage = lazy(() => import('../vendor/pages/AllBookingsPage'));
const EditCar = lazy(() => import('../vendor/pages/EditCar'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />
        <Route path="/car-listing" element={<CarListing />} />
        <Route path="/booking-details" element={<CardDetails />} />
        <Route path="/explore-packages" element={<ExplorePackages />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-booking-detail/:id" element={<MyBookingDetailPage />} />
        <Route path="/mobility-solutions" element={<MobilitySolutionsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/our-team" element={<OurTeamPage />} />
        <Route path="/terms-and-conditions" element={<TermAndConditionPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/legal-notice" element={<LegalNoticePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/payment-policy" element={<PaymentPolicyPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/failure" element={<FailurePage />} />

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboardHome />} />
          <Route path="add-car" element={<VendorAddcar />} />
          <Route path="car-list" element={<VendorCarList />} />
          <Route path="edit-car/:carId" element={<EditCar />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="bookings" element={<AllBookingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
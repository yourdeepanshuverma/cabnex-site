import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ScrollToTop from "../../utils/scroll-to-top";

const TermAndConditionPage = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Terms & <span className="text-orange-500">Conditions</span>
            </h2>
          </div>
          <div className="mt-12 font-grotesk">
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28 – Oct - 2025
            </p>
            <p className="text-lg text-gray-600">
              <strong>Last Updated:</strong> Welcome to Cabnex (operated by
              Nexfleet Tech Solutions Pvt. Ltd.).By accessing or using our
              website www.cabnex.in, or by availing of our services, you agree
              to comply with the following Terms and Conditions. Please read
              them carefully before using our platform.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              1. General Overview
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              These Terms & Conditions govern your use of Cabnex’s website,
              booking platform, and related travel and transport services.By
              making a booking or using our services, you acknowledge that you
              have read, understood, and agree to be bound by these terms.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              2. Company Information
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex is a brand of Nexfleet Tech Solutions Pvt. Ltd., offering
              intercity, airport, corporate, and leisure cab rental services
              across India.All bookings, communications, and payments are
              managed by the company through the official website and verified
              contact channels.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              3. User Eligibility
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                You must be at least 18 years of age to make a booking or enter
                into any contractual agreement with Cabnex.
              </li>
              <li>
                You agree to provide accurate and complete information during
                the booking process.
              </li>
              <li>
                Any misuse or false information may result in booking
                cancellation or denial of service.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              4. Bookings and Confirmation
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Bookings can be made through our website, mobile communication,
                or authorized agents.
              </li>
              <li>
                Confirmation of bookings is subject to vehicle availability and
                successful payment or advance deposit (if applicable).
              </li>
              <li>
                Cabnex reserves the right to decline or cancel a booking due to
                unforeseen circumstances, safety concerns, or operational
                reasons.A confirmation message or email will serve as proof of
                booking.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              5. Payments and Pricing
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                All fares are calculated based on distance, duration, route,
                vehicle type, applicable tolls, state permits, and driver
                allowances.
              </li>
              <li>
                Prices may vary depending on fuel rates, seasonal demand, or
                dynamic route conditions.
              </li>
              <li>
                Payments can be made through online gateways, UPI, or bank
                transfers.
              </li>
              <li>
                Any additional charges such as parking, entry fees, or permit
                costs (if not included in the package) are to be borne by the
                customer.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              6. Cancellation and Refund Policy
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Cancellations made 24 hours or more before the scheduled trip
                start time may be eligible for a refund (after applicable
                deductions).
              </li>
              <li>
                Cancellations made within 24 hours or no-shows are
                non-refundable.
              </li>
              <li>
                In case of unavoidable vehicle breakdown or force majeure
                (natural calamities, strikes, etc.), Cabnex will provide an
                alternate vehicle or refund the unused portion.Refunds, if
                applicable, will be processed to the original payment method
                within 7–10 working days.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              7. Service Usage Guidelines
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Customers are requested to:
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>Treat the vehicle and driver with respect.</li>
              <li>Avoid carrying prohibited or hazardous items.</li>
              <li>Maintain cleanliness inside the vehicle.</li>
              <li>Adhere to local traffic laws and regulations.</li>
            </ul>
            <p className="mt-4 text-lg text-gray-600">
              Any damage to the vehicle or misconduct may result in penalties or
              service termination.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              8. Driver and Vehicle Policy
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                All Cabnex drivers are verified and authorized to operate
                commercial passenger vehicles.
              </li>
              <li>
                Vehicles are maintained in roadworthy condition and comply with
                transport authority regulations.
              </li>
              <li>
                Drivers may refuse service if the passenger’s conduct is deemed
                unsafe, intoxicated, or abusive.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              9. Liability Disclaimer
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex strives to provide safe and reliable services; however:
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                The company shall not be held liable for delays caused by
                traffic, weather, accidents, or road closures.
              </li>
              <li>
                Cabnex is not responsible for loss of personal belongings left
                in the vehicle.
              </li>
              <li>
                In no event shall the company’s total liability exceed the
                amount paid for the specific booking.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              10. Intellectual Property Rights
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              All content, text, graphics, logos, photos, and software on
              www.cabnex.in are the intellectual property of Nexfleet Tech
              Solutions Pvt. Ltd. and protected under copyright
              laws.Unauthorized use, reproduction, or modification is strictly
              prohibited.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              11. Privacy Policy
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Your use of our website and services is also governed by our
              Privacy Policy, which explains how we collect, use, and protect
              your data.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              12. Modifications and Updates
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Cabnex reserves the right to update or modify these Terms &
              Conditions at any time without prior notice.Revised terms will be
              posted on this page with the updated effective date. Continued use
              of the platform indicates your acceptance of the new terms.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              13. Governing Law and Jurisdiction
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              These Terms & Conditions shall be governed by and construed in
              accordance with the laws of India.Any disputes shall be subject to
              the exclusive jurisdiction of the courts in Noida, Uttar Pradesh,
              India.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              14. Contact Information
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              For any questions, clarifications, or disputes regarding these
              Terms, please contact:
            </p>
            <address className="mt-4 not-italic text-lg text-gray-600">
              Nexfleet Tech Solutions Pvt. Ltd.
              <br />
              Email: info@cabnex.in
              <br />
              Phone: +91 96672 84400
              <br />
              Website: www.cabnex.in
              <br />
              Registered Address: MIQB, C 25, Sector 58, Noida 201301
            </address>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermAndConditionPage;

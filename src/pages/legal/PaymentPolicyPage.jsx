import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ScrollToTop from "../../utils/scroll-to-top";

const PaymentPolicyPage = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold font-grotesk text-gray-900 sm:text-5xl">
              Payment, Cancellation &{" "}
              <span className="text-orange-500">Refund Policy</span>
            </h2>
          </div>
          <div className="mt-12 font-grotesk">
            <p className="text-lg text-gray-600">
              <strong>Effective Date:</strong> 28 – Oct - 2025
            </p>
            <p className="text-lg text-gray-600">
              <strong>Last Updated:</strong> At Cabnex (Nexfleet Tech Solutions
              Pvt. Ltd.), we value transparency and customer satisfaction. The
              following policy outlines how payments, cancellations, and refunds
              are managed for all bookings made through our website, mobile
              communication, or authorized representatives.
            </p>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              1. Payment Policy
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                All bookings are confirmed only after a partial or full payment
                is received, depending on the nature of the trip.
              </li>
              <li>
                Payments can be made securely through UPI, bank transfer,
                credit/debit card, or authorized online payment gateways.
              </li>
              <li>
                For corporate or contractual clients, payment terms may vary as
                per agreed terms or invoices.
              </li>
              <li>
                The fare amount is calculated based on distance, duration,
                route, vehicle type, tolls, driver allowances, and applicable
                taxes.
              </li>
              <li>
                Any additional expenses such as parking, entry fees, interstate
                permit charges, or waiting charges (if not included in the
                package) are to be paid directly to the driver or as per
                invoice.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              2. Cancellation Policy
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              We understand that plans can change. To ensure fairness to both
              customers and service providers, the following cancellation terms
              apply:
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Cancellations made 24 hours or more before the scheduled pickup
                time — eligible for a refund after applicable administrative or
                payment gateway deductions.
              </li>
              <li>
                Cancellations made within 24 hours of the scheduled pickup time
                — non-refundable.
              </li>
              <li>
                No-show (if the customer fails to report at pickup point) — no
                refund applicable.
              </li>
              <li>
                In case of a service cancellation by Cabnex due to vehicle
                unavailability, breakdown, or unavoidable operational issues, a
                full refund or suitable alternative will be offered.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              3. Refund Policy
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Refunds, if applicable, will be processed through the original
                mode of payment used during booking.
              </li>
              <li>
                Refunds will normally be initiated within 7–10 working days from
                the date of cancellation confirmation.
              </li>
              <li>
                In some cases, processing time may vary depending on the payment
                gateway or bank policies.
              </li>
              <li>
                No refund shall be provided for services already commenced or
                partially utilized.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              4. Modifications or Rescheduling
            </h3>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Any request for date change, vehicle upgrade, or route
                modification will be treated as per availability and may incur
                additional charges.
              </li>
              <li>
                Rescheduling is allowed only once per booking, and confirmation
                will depend on fleet availability.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              5. Non-Refundable Situations
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Refunds will not be applicable in the following situations:
            </p>
            <ul className="list-disc list-inside mt-4 text-lg text-gray-600">
              <li>
                Customer delay resulting in missed trip or schedule change.
              </li>
              <li>
                Partial utilization of the service (early drop-off or reduced
                travel).
              </li>
              <li>
                Misconduct, intoxication, or violation of driver/service
                guidelines.
              </li>
              <li>
                Acts of nature (heavy rain, landslides, traffic closures) that
                are beyond Cabnex’s control.
              </li>
            </ul>

            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              6. Contact for Cancellations or Refunds
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              To cancel or modify your booking, please contact our support team:
            </p>
            <address className="mt-4 not-italic text-lg text-gray-600">
              Cabnex – Nexfleet Tech Solutions Pvt. Ltd.
              <br />
              📞 +91 96672 84400
              <br />
              ✉️ info@cabnex.in
              <br />
              🌐 www.cabnex.in
            </address>
            <p className="mt-4 text-lg text-gray-600">
              Our support team is available to assist you with cancellations,
              payment clarifications, and refund status
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPolicyPage;

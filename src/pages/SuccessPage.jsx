import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { jsPDF } from "jspdf";
import Header from "../components/header";

const SuccessPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const encodedData = params.get("data");

    if (encodedData) {
      try {
        const decoded = JSON.parse(encodedData);
        setBookingData(decoded?.data?.booking || null);
        setError(null);
      } catch (error) {
        console.error("Error decoding payment data:", error);
        setError("Failed to load booking details. Please try again later.");
      }
    } else if (bookingId) {
      setBookingData({ bookingId });
      setError(null);
    } else {
      setError("No booking data available.");
    }
    setIsLoading(false);
  }, [location, bookingId]);

  const downloadPDF = () => {
    if (!bookingData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingData.bookingId}`, 20, 40);
    if (bookingData.startLocation) {
      doc.text(`From: ${bookingData.startLocation.address}`, 20, 50);
    }
    if (bookingData.destinations && bookingData.destinations.length > 0) {
      doc.text(`To: ${bookingData.destinations[0].address}`, 20, 60);
    }
    doc.text(`Paid Amount: ₹${bookingData.recievedAmount}`, 20, 70);
    doc.text(`Total Amount: ₹${bookingData.totalAmount}`, 20, 80);
    doc.text(`Service Type: ${bookingData.serviceType}`, 20, 90);
    doc.text(
      `Pickup Time: ${new Date(bookingData.pickupDateTime).toLocaleString()}`,
      20,
      100,
    );
    doc.text(`Status: ${bookingData.status}`, 20, 110);
    doc.save(`Booking_${bookingData.bookingId}.pdf`);
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-3xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <Header />
        <div className="text-center mt-8">
          <CheckCircleIcon
            className={`h-16 w-16 mx-auto mb-4 ${
              bookingData?.paymentStatus === "pending"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
            aria-hidden="true"
          />

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {bookingData?.paymentStatus === "pending"
              ? "Booking Request Received"
              : "Payment Successful!"}
          </h1>

          {isLoading ? (
            <p
              role="status"
              aria-live="polite"
              className="text-lg text-gray-600"
            >
              Loading booking details...
            </p>
          ) : error ? (
            <p role="alert" className="text-lg text-red-500">
              {error}
            </p>
          ) : bookingData ? (
            bookingData?.paymentStatus === "pending" ? (
              <>
                <div className="mx-auto max-w-xl text-left space-y-3 bg-gray-50 p-6 rounded-lg">
                  <p className="text-lg text-gray-700">
                    We have received your booking request.
                  </p>
                  <p className="text-sm text-gray-600">
                    Our operations team will review the details and get back to
                    you shortly with the booking confirmation.
                  </p>
                  <p className="text-sm text-gray-600">
                    Need help?{" "}
                    <a
                      href="tel:+919667284400"
                      className="font-medium text-orange-600"
                    >
                      +91 96672 84400
                    </a>{" "}
                    |{" "}
                    <a
                      href="mailto:sales@cabnex.in"
                      className="font-medium text-orange-600"
                    >
                      sales@cabnex.in
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    Booking ID:{" "}
                    <span className="font-medium">{bookingData.bookingId}</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-2xl text-left space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="text-lg font-medium text-gray-800">
                      {bookingData.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-medium text-gray-800 capitalize">
                      {bookingData.status}
                    </p>
                  </div>

                  {bookingData.startLocation && (
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-lg font-medium text-gray-800">
                        {bookingData.startLocation.address}
                      </p>
                    </div>
                  )}

                  {bookingData.exactLocation && (
                    <div>
                      <p className="text-sm text-gray-500">Exactly From</p>
                      <p className="text-lg font-medium text-gray-800">
                        {bookingData.exactLocation}
                      </p>
                    </div>
                  )}

                  {bookingData.destinations &&
                    bookingData.destinations.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="text-lg font-medium text-gray-800">
                          {bookingData.destinations[0].address}
                        </p>
                      </div>
                    )}

                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="text-lg font-medium text-gray-800 capitalize">
                      {bookingData.serviceType || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p className="text-lg font-medium text-gray-800">
                      {bookingData.pickupDateTime
                        ? new Date(bookingData.pickupDateTime).toLocaleString()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Paid Amount</p>
                    <p className="text-lg font-medium text-gray-800">
                      {Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                      }).format(bookingData?.recievedAmount || 0)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-medium text-gray-800">
                      {Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                      }).format(bookingData?.totalAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <p className="text-lg text-gray-600">
              No booking details available.
            </p>
          )}

          <p className="mt-6 text-gray-600 text-sm">
            A confirmation will be sent to your email or phone soon.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
              aria-label="Back to home"
            >
              Back to Home
            </button>

            <button
              type="button"
              onClick={downloadPDF}
              disabled={
                isLoading ||
                !bookingData ||
                bookingData?.paymentStatus === "pending"
              }
              className={`w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition duration-300 text-white ${
                isLoading ||
                !bookingData ||
                bookingData?.paymentStatus === "pending"
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              aria-label="Download booking PDF"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;

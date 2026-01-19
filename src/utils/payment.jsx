// src/utils/payment.js
import axios from "axios";
import { toast } from "sonner";
import { endpoints } from "../api/api-config"; // Import endpoints

// const API_URL = "http://localhost:3000/api/v1";
const API_URL = "https://api.cabnex.in/api/v1";
// const BASE_URL = "http://localhost:5173";
const BASE_URL = "https://cabnex.in";

export const loadRazorpay = async ({
  carCategoryName,
  serviceType,
  packageType,
  packageId,
  exactLocation,
  pickupDateTime,
  startLocation,
  destinations,
  returnDateTime,
  distance,
  totalAmount,
  city,
  oneWay,
  user,
}) => {
  let amount = 1; // Default to 100 INR
  const initiatePayment = async () => {
    try {
      // Step 1: Get Razorpay Key
      const { data: keyData } = await axios.get(
        `${API_URL}/transaction/get-razorpay-key`,
        {
          withCredentials: true,
        },
      );
      console.log("Razorpay Key Response:", keyData);

      // Step 2: Create order with amount in rupees
      if (isNaN(amount) || amount <= 0) {
        toast.error("Invalid amount!");
        return;
      }
      console.log(`Amount Debug: Sending Rupees ${amount} to backend`);

      const { data: orderData } = await axios.post(
        `${API_URL}/transaction/create-order`,
        { price: amount },
        { withCredentials: true },
      );
      console.log("Order Creation Response:", orderData);

      // Step 3: Razorpay options
      const options = {
        key: keyData.data,
        amount: orderData.data.amount.toString(),
        currency: orderData.data.currency || "INR",
        name: "Cabnex",
        description: `Booking Payment - ₹${amount.toFixed(2)}`,
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            console.log("Razorpay Response:", response);

            const verifyPayload = {
              amount: amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              carCategory: carCategoryName,
              serviceType,
              packageId: packageType,
              exactLocation,
              pickupDateTime,
              startLocation:
                typeof startLocation === "object"
                  ? startLocation
                  : { address: startLocation, place_id: null },
              destinations: Array.isArray(destinations)
                ? destinations
                : destinations
                  ? [
                      typeof destinations === "object"
                        ? destinations
                        : { address: destinations, place_id: null },
                    ]
                  : [],
              returnDateTime,
              distance: distance || 0,
              totalAmount,
              city,
              oneWay,
            };
            console.log("Verification Payload:", verifyPayload);

            const verifyRes = await axios.post(
              `${API_URL}/transaction/verify-payment`,
              verifyPayload,
              {
                withCredentials: true,
              },
            );
            console.log("Backend Verification:", verifyRes.data);

            if (verifyRes.data.success) {
              toast.success("Payment verified! Redirecting to success page...");
              // Extract bookingId from the nested structure
              const bookingResponse = encodeURIComponent(
                JSON.stringify(verifyRes.data),
              );
              setTimeout(() => {
                window.location.href = `${BASE_URL}/success?data=${bookingResponse}`;
              }, 2000);
            } else {
              toast.error(
                verifyRes.data.message ||
                  "Verification failed! Redirecting to failure page...",
              );
              setTimeout(() => {
                window.location.href = `${BASE_URL}/failure?reason=${encodeURIComponent(
                  verifyRes.data.message || "unknown",
                )}`;
              }, 2000);
            }
          } catch (err) {
            console.error("Verification Error:", err.response?.data || err);
            toast.error("Verification failed! Redirecting to failure page...");
            setTimeout(() => {
              window.location.href = `${BASE_URL}/failure?reason=${encodeURIComponent(
                err.response?.data?.message || "network_error",
              )}`;
            }, 2000);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: { color: "#FF6900" },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
            window.location.href = `${BASE_URL}/`;
          },
        },
      };

      // Open Razorpay Popup
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        console.error("Payment Failed:", response.error);
        toast.error(response.error.description || "Payment failed!");
        setTimeout(() => {
          window.location.href = `${BASE_URL}/failure?reason=payment_failed`;
        }, 2000);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Initiation Error:", error.response?.data || error);
      toast.error("Payment start failed.");
    }
  };

  if (!window.Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = initiatePayment;
    script.onerror = () => toast.error("Razorpay SDK load failed.");
    document.head.appendChild(script);
  } else {
    initiatePayment();
  }
};

export const createOfflineBooking = async (bookingDetails) => {
  try {
    const bookingRes = await axios.post(
      `${API_URL}/auth/bookings/without-payment`,
      bookingDetails,
      {
        withCredentials: true,
      },
    );

    if (bookingRes.data.success) {
      toast.success("Booking successful! Redirecting to success page...");
      const bookingResponse = encodeURIComponent(
        JSON.stringify(bookingRes.data),
      );
      setTimeout(() => {
        window.location.href = `${BASE_URL}/success?data=${bookingResponse}`;
      }, 2000);
    } else {
      toast.error(
        bookingRes.data.message ||
          "Booking failed! Redirecting to failure page...",
      );
      // setTimeout(() => {
      //   window.location.href = `${BASE_URL}/failure?reason=${encodeURIComponent(
      //     bookingRes.data.message || 'unknown'
      //   )}`;
      // }, 2000);
    }
  } catch (err) {
    console.error("Offline Booking Error:", err.response?.data || err);
    toast.error("Booking failed! Redirecting to failure page...");
    // setTimeout(() => {
    //   window.location.href = `${BASE_URL}/failure?reason=${encodeURIComponent(
    //     err.response?.data?.message || 'network_error'
    //   )}`;
    // }, 2000);
  }
};

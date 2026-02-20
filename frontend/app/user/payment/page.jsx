"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  AlertCircle,
  Lock,
  ChevronLeft,
  Loader2,
  IndianRupee,
  Truck,
} from "lucide-react";

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load booking data
  useEffect(() => {
    if (!bookingId) {
      setError("Invalid booking ID");
      setLoading(false);
      return;
    }

    async function loadBooking() {
      setLoading(true);
      setError("");

      try {
        const res = await apiFetch(
          `/api/bookings/customer/bookings/${bookingId}/`,
        );
        if (res?.error === "TOKEN_EXPIRED") return router.push("/login");
        if (res?.error || !res?.id) throw new Error("Booking not found");

        if (
          res.payment_status === "paid" ||
          res.payment_status === "completed"
        ) {
          router.replace(`/user/payment-success?bookingId=${res.id}`);
          return;
        }

        if (res.payment_status === "cancelled") {
          setError("This booking has been cancelled.");
          return;
        }

        setBooking(res);
      } catch (err) {
        console.error(err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId, router]);

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    if (!booking?.total_price || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      const orderRes = await apiFetch(
        "/api/payments/customer/payments/create_order/",
        {
          method: "POST",
          body: JSON.stringify({ booking_id: booking.id }),
        },
      );

      if (orderRes?.error)
        throw new Error(orderRes.error || "Failed to create order");

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Failed to load Razorpay");

      const options = {
        key: orderRes.key,
        amount: orderRes.amount * 100,
        currency: orderRes.currency,
        order_id: orderRes.order_id,
        name: "DayTaask",
        description: `Booking #${booking.booking_code}`,

        handler: async function (response) {
          const verifyRes = await apiFetch(
            "/api/payments/customer/payments/verify/",
            {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            },
          );

          if (!verifyRes?.error) {
            router.push(`/user/payment-success?bookingId=${booking.id}`);
          } else {
            router.push(
              `/user/payment-failed?bookingId=${booking.id}&reason=verify_failed`,
            );
          }
        },

        modal: {
          ondismiss: function () {
            router.push(
              `/user/payment-failed?bookingId=${booking.id}&reason=cancelled`,
            );
          },
        },

        theme: {
          color: "#FACC15",
        },
      };
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        router.push(
          `/user/payment-failed?bookingId=${booking.id}&reason=failed`,
        );
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Unable to start payment.");
      setIsProcessing(false);
    }
  };

  const handleCOD = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError("");

    try {
      const res = await apiFetch("/api/payments/customer/payments/cod/", {
        method: "POST",
        body: JSON.stringify({ booking_id: booking.id }),
      });

      if (res?.error) throw new Error(res.error);

      router.push(`/user/payment-success?bookingId=${booking.id}`);
    } catch (err) {
      setError("Failed to confirm Cash on Delivery.");
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "cod") {
      handleCOD();
    } else {
      handleOnlinePayment();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-600 text-xl">
        <AlertCircle className="w-12 h-12 mb-4" />
        {error || "Booking not found"}
      </div>
    );
  }

  const totalPrice = parseFloat(booking.total_price || 0);
  const servicePrice = parseFloat(booking.service_price || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Payment
          </h1>
          <p className="text-xl text-gray-600">
            Secure checkout for Booking #{booking.booking_code || bookingId}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT - Payment Methods */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Lock className="w-7 h-7 text-amber-600" />
                Select Payment Method
              </h2>

              <div className="space-y-5">
                {/* UPI */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">UPI</p>
                        <p className="text-sm text-gray-600">
                          GPay, PhonePe, Paytm & more
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        Recommended
                      </span>
                    </div>
                  </div>
                </label>

                {/* Card */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Credit / Debit Card
                        </p>
                        <p className="text-sm text-gray-600">
                          Visa, Mastercard, RuPay
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Wallet */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          DayTaask Wallet
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Available Balance: ₹1,250
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`block p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="cod_pending"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <IndianRupee className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          Pay in cash when service is completed
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="mt-4 ml-16 text-sm text-amber-700">
                      Service provider will collect ₹
                      {totalPrice.toLocaleString("en-IN")} at the time of
                      service.
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">
                    100% Secure Payments
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your payment information is encrypted and secure. COD
                    available for added convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary with detailed breakdown */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold">
                        {booking.service_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Price</span>
                      <span className="font-semibold">
                        ₹{servicePrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {booking.addons?.length > 0 && (
                      <>
                        <hr className="border-gray-200 my-2" />
                        {booking.addons.map((addon) => (
                          <div key={addon.id} className="flex justify-between">
                            <span className="text-gray-600">
                              {addon.addon_name}
                            </span>
                            <span className="font-semibold">
                              ₹
                              {parseFloat(
                                addon.addon_price || 0,
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </>
                    )}

                    <hr className="border-gray-200 my-4" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-amber-600">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !totalPrice}
                    className="w-full bg-amber-600 text-white font-bold text-xl py-5 rounded-xl hover:bg-amber-700 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === "cod" ? (
                      <>
                        Confirm COD ₹{totalPrice.toLocaleString("en-IN")}
                        <Truck className="w-6 h-6" />
                      </>
                    ) : (
                      <>
                        Pay ₹{totalPrice.toLocaleString("en-IN")}
                        <Lock className="w-6 h-6" />
                      </>
                    )}
                  </button>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">
                          Cancellation Policy
                        </p>
                        <p className="text-gray-600 mt-1">
                          Free cancellation up to 4 hours before scheduled time.
                          After that, ₹199 fee applies.
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-center font-medium mt-4">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

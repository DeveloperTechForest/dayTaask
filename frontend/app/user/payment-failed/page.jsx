"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import {
  XCircle,
  RefreshCcw,
  MessageCircle,
  Phone,
  Home,
  AlertCircle,
  CreditCard,
  Wifi,
  ShieldAlert,
  ChevronLeft,
  Loader2,
} from "lucide-react";

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId") || "unknown";
  const reason = searchParams?.get("reason") || "unknown";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Reason → friendly message mapping
  const reasonMessages = {
    failed: "Your bank declined the transaction. No amount was deducted.",
    cancelled: "You cancelled the payment process. Booking is still active.",
    verify_failed:
      "Payment was attempted but could not be verified. If money was deducted, it will be refunded automatically within 3–5 days.",
    unknown: "Something went wrong during payment. No charges applied.",
  };

  const commonIssues = [
    {
      icon: CreditCard,
      title: "Insufficient Balance",
      description: "Please ensure your account has sufficient balance",
    },
    {
      icon: Wifi,
      title: "Network Issue",
      description: "Payment might have failed due to network connectivity",
    },
    {
      icon: ShieldAlert,
      title: "Card Declined",
      description: "Your bank may have declined the transaction",
    },
  ];

  // Fetch latest booking data
  useEffect(() => {
    if (!bookingId || bookingId === "unknown") {
      setFetchError("Missing booking information");
      setLoading(false);
      return;
    }

    async function loadBooking() {
      setLoading(true);
      setFetchError("");

      try {
        const res = await apiFetch(
          `/api/bookings/customer/bookings/${bookingId}/`,
        );
        if (res?.error === "TOKEN_EXPIRED") {
          router.push("/login");
          return;
        }
        if (res?.error || !res?.id) {
          throw new Error("Booking not found");
        }

        setBooking(res);

        // If somehow paid now (rare race condition), redirect
        if (
          res.payment_status === "paid" ||
          res.payment_status === "completed"
        ) {
          router.replace(`/user/payment-success?bookingId=${res.id}`);
        }
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setFetchError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId, router]);

  const handleRetry = () => {
    router.push(`/user/payment?bookingId=${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          Loading details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-brand"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-card rounded-2xl border-2 border-red-200 shadow-xl overflow-hidden">
          <div className="p-10 sm:p-12 text-center">
            {/* Big Error Icon */}
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
              We couldn't process your payment. Don't worry — your booking is
              safe and no money was deducted.
            </p>

            {/* Error Details - now dynamic */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  {booking ? (
                    <>
                      <p>
                        <span className="font-bold">Booking:</span>{" "}
                        {booking.service_name} • #
                        {booking.booking_code || bookingId}
                      </p>
                      <p>
                        <span className="font-bold">Amount Attempted:</span> ₹
                        {parseFloat(booking.total_price || 0).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                      <p>
                        <span className="font-bold">Current Status:</span>{" "}
                        <span className="capitalize">
                          {booking.payment_status}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p>
                      <span className="font-bold">Booking ID:</span> #
                      {bookingId}
                    </p>
                  )}
                  <p>
                    <span className="font-bold">Error Code:</span>{" "}
                    <span className="text-red-600 font-mono">
                      {reason.toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-2 text-red-700">
                    {reasonMessages[reason] || "An unknown error occurred."}
                  </p>
                </div>
              </div>
            </div>

            {/* Common Issues - unchanged */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-foreground mb-6 text-left">
                Common Reasons for Payment Failure
              </h3>
              <div className="grid gap-4">
                {commonIssues.map((issue, index) => {
                  const Icon = issue.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-muted/50 rounded-xl border border-border"
                    >
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {issue.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What You Can Do - unchanged */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 mb-10">
              <h3 className="text-xl font-bold text-foreground mb-5 flex items-center gap-3">
                What You Can Do Next
              </h3>
              <ul className="space-y-3 text-foreground">
                {[
                  "Check your internet connection and try again",
                  "Ensure you have sufficient balance",
                  "Try a different payment method (UPI, Card, Wallet)",
                  "Contact your bank if the issue persists",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold text-lg">•</span>
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons - unchanged */}
            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={handleRetry}
                className="w-full bg-red-600 text-white font-bold text-xl py-5 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-6 h-6" />
                Retry Payment
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/user/dashboard")}
                  className="py-4 border-2 border-border rounded-xl font-medium hover:bg-secondary/10 transition-all"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => router.push("/support")}
                  className="py-4 border-2 border-border rounded-xl font-medium hover:bg-secondary/10 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get Help
                </button>
              </div>

              <button
                onClick={() => router.push("/")}
                className="w-full py-4 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>

            {/* Support Contact - unchanged */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-6">
                Still facing issues? We're here 24/7
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-yellow-600">
                <button className="flex items-center gap-3 font-bold hover:underline">
                  <Phone className="w-6 h-6" />
                  Call: 1800-123-4567
                </button>
                <button className="flex items-center gap-3 font-bold hover:underline">
                  <MessageCircle className="w-6 h-6" />
                  Start Live Chat
                </button>
              </div>
            </div>

            {/* Final Assurance - unchanged */}
            <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-center text-green-800 font-medium">
                No amount has been deducted. Your booking is 100% safe and
                saved.
                <br />
                You can retry payment anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// app/cancel-booking/[bookingId]/page.jsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { AlertCircle, XCircle, ChevronLeft } from "lucide-react";

export default function CancelBooking() {
  const { bookingId } = useParams();
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const cancellationReasons = [
    "Found a better price elsewhere",
    "Service no longer needed",
    "Want to reschedule",
    "Taaskr not responding",
    "Change in plans",
    "Other",
  ];

  const handleCancel = () => {
    // TODO: API call to cancel booking
    router.push("/user/dashboard?cancelled=true");
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
            <XCircle className="w-20 h-20 text-red-600" />
          </div>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
            Cancel Booking
          </h1>
          <p className="text-2xl text-muted-foreground">
            Booking ID:{" "}
            <span className="font-bold text-red-600">#{bookingId}</span>
          </p>
        </div>

        {/* Cancellation Policy Alert */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-6 mb-10 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 text-lg mb-2">
                Cancellation Policy
              </h3>
              <p className="text-yellow-900 font-medium">
                Free cancellation up to 4 hours before scheduled time.
                <br />
                After that, a cancellation fee of{" "}
                <span className="font-bold">₹199</span> will be charged.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl border-2 border-red-200 shadow-2xl overflow-hidden">
          <div className="p-10">
            <h2 className="text-3xl font-bold text-foreground mb-10">
              Why are you cancelling?
            </h2>

            {/* Reasons */}
            <div className="space-y-5 mb-10">
              {cancellationReasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    reason === r
                      ? "border-red-500 bg-red-50 shadow-lg"
                      : "border-border hover:border-red-400 hover:bg-red-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-6 h-6 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-lg font-medium text-foreground">
                    {r}
                  </span>
                </label>
              ))}
            </div>

            {/* Other Reason Textarea */}
            {reason === "Other" && (
              <div className="mb-10 animate-in slide-in-from-top-4">
                <label className="block text-lg font-medium text-foreground mb-3">
                  Please tell us more
                </label>
                <textarea
                  placeholder="Help us improve by sharing your feedback..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-5 bg-background border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg resize-none"
                />
              </div>
            )}

            {/* Refund Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-red-50 border-2 border-red-200 rounded-2xl p-8 mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Refund Summary
              </h3>
              <div className="space-y-5 text-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Amount</span>
                  <span className="font-bold">₹2,499</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Cancellation Fee
                  </span>
                  <span className="text-red-600 font-bold">-₹0</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-foreground">
                    You’ll get back
                  </span>
                  <span className="text-4xl font-bold text-green-600">
                    ₹2,499
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                Refund will be processed to your original payment method within
                5–7 business days
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6">
              <button
                onClick={() => router.back()}
                className="flex-1 py-6 border-2 border-border rounded-2xl font-bold text-lg hover:bg-secondary/10 transition-all"
              >
                Nevermind, Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={!reason}
                className="flex-1 py-6 bg-red-600 text-white font-bold text-xl rounded-2xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <XCircle className="w-7 h-7" />
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            Changed your mind? You can book again anytime
            <br />
            We’re here when you need us!
          </p>
        </div>
      </main>
    </div>
  );
}

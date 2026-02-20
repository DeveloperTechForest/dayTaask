// app/quote-to-booking/[quoteId]/[responseId]/page.jsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Calendar, Clock, MapPin, CreditCard, ChevronLeft } from "lucide-react";

export default function QuoteToBooking() {
  const { quoteId, responseId } = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock expert response
  const expertResponse = {
    expertName: "Rajesh Kumar",
    expertRating: 4.9,
    expertImage: "https://i.pravatar.cc/150?img=12",
    estimatedPrice: 18500,
    estimatedDuration: "3-4 days",
    serviceTitle: "Complete House Rewiring",
  };

  const handleConfirmBooking = () => {
    // In real app: create booking → redirect
    router.push("/user/payment");
  };

  const totalAmount = Math.round((expertResponse.estimatedPrice + 99) * 1.18);

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-brand cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Quote
          </button>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
            Confirm Your Booking
          </h1>
          <p className="text-xl text-muted-foreground">
            Review details and schedule your service
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Selected Expert */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Selected Expert
              </h2>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-secondary/20">
                  <img
                    src={expertResponse.expertImage}
                    alt={expertResponse.expertName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {expertResponse.expertName}
                  </h3>
                  <p className="text-lg text-secondary font-medium">
                    {expertResponse.expertRating} Excellent Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-yellow-500" />
                Choose Date & Time
              </h2>

              <div className="flex justify-center mb-8">
                <div className="bg-background border border-border rounded-2xl p-6 shadow-md">
                  <input
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="text-center text-lg font-medium cursor-pointer hover:bg-secondary/5 rounded-lg px-4 py-3 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {["Morning", "Afternoon", "Evening"].map((slot) => (
                  <button
                    key={slot}
                    className="py-4 px-6 bg-background border border-border rounded-xl font-medium hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all"
                  >
                    {slot}
                    <span className="block text-sm opacity-70 mt-1">
                      {slot === "Morning" && "9 AM - 12 PM"}
                      {slot === "Afternoon" && "12 PM - 4 PM"}
                      {slot === "Evening" && "4 PM - 8 PM"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Address */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-yellow-500" />
                Service Address
              </h2>

              <div className="space-y-4">
                <button className="w-full text-left p-6 bg-background border-2 border-secondary/30 rounded-xl hover:border-yellow-500 transition-all flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-foreground">Home</p>
                    <p className="text-muted-foreground">
                      123 Main Street, Apartment 4B, Mumbai
                    </p>
                  </div>
                </button>

                <button className="w-full py-4 border-2 border-dashed border-border rounded-xl text-yellow-500 font-medium hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all">
                  + Add New Address
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                  <h3 className="text-2xl font-bold">Booking Summary</h3>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="font-bold text-lg text-foreground">
                      {expertResponse.serviceTitle}
                    </h4>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                      <Clock className="w-5 h-5" />
                      Estimated: {expertResponse.estimatedDuration}
                    </p>
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-foreground">
                      <span>Service Cost</span>
                      <span className="font-semibold">
                        ₹{expertResponse.estimatedPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Platform Fee</span>
                      <span className="font-semibold">₹99</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>GST (18%)</span>
                      <span className="font-semibold">
                        ₹
                        {Math.round(
                          (expertResponse.estimatedPrice + 99) * 0.18
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-foreground">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-yellow-600">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full bg-yellow-500 text-white font-bold text-xl py-5 rounded-xl hover:bg-yellow-600 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    <CreditCard className="w-6 h-6" />
                    Proceed to Payment
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    By proceeding, you agree to our{" "}
                    <span className="text-yellow-600 underline">
                      Terms & Conditions
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

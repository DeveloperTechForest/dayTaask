// app/booking-confirmed/[bookingId]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Confetti from "react-confetti";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Home,
  ChevronLeft,
} from "lucide-react";

// Custom hook for window size (SSR-safe)
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default function BookingConfirmed() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const booking = {
    id: bookingId || "12345",
    serviceName: "Complete House Wiring",
    taaskrName: "Rajesh Kumar",
    taaskrPhone: "+91 98765 43210",
    taaskrImage: "https://i.pravatar.cc/150?img=12",
    date: "February 1, 2024",
    time: "10:00 AM - 2:00 PM",
    address: "123 Main Street, Apartment 4B, Mumbai",
    totalAmount: 21946,
    estimatedDuration: "3-4 days",
  };

  return (
    <div className="min-h-screen bg-light-bg relative overflow-hidden">
      {/* Confetti Celebration */}
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={600}
        gravity={0.25}
        colors={["#facc15", "#fbbf24", "#f59e0b", "#10b981", "#059669"]} // Yellow + Green
      />

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-brand"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-2xl text-muted-foreground mb-3">
            Your service is scheduled and confirmed
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold text-xl rounded-full shadow-xl">
            Booking ID: #{booking.id}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl border-4 border-green-200 shadow-2xl overflow-hidden mb-10">
          <div className="p-8 sm:p-12 space-y-10">
            {/* Booking Details */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Booking Details
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Service Date
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {booking.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Time Slot</p>
                    <p className="text-xl font-bold text-foreground">
                      {booking.time}
                    </p>
                    <p className="text-muted-foreground">
                      Duration: {booking.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Service Location
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {booking.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Service Professional */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Your Service Professional
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-6">
                  <img
                    src={booking.taaskrImage}
                    alt={booking.taaskrName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-foreground">
                      {booking.taaskrName}
                    </h4>
                    <p className="text-lg text-green-600 font-medium">
                      4.9 • 500+ bookings completed
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Verified & Background Checked
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button className="py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-3">
                    <Phone className="w-6 h-6" />
                    Call Now
                  </button>
                  <button className="py-4 border-2 border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-3">
                    <MessageSquare className="w-6 h-6" />
                    Chat
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Payment Summary */}
            <div className="text-center">
              <p className="text-muted-foreground text-lg">Total Amount Paid</p>
              <p className="text-5xl font-bold text-green-600 mt-3">
                ₹{booking.totalAmount.toLocaleString()}
              </p>
              <p className="text-muted-foreground mt-2">
                Payment completed via UPI
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-5 max-w-md mx-auto">
          <button
            onClick={() => router.push(`/tracking/${booking.id}`)}
            className="w-full bg-green-600 text-white font-bold text-xl py-6 rounded-2xl hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4"
          >
            Track Your Booking Live
            <CheckCircle2 className="w-7 h-7" />
          </button>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="w-full py-5 border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-600 hover:text-white transition-all"
          >
            View All Bookings
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-5 text-muted-foreground hover:text-  hover:text-foreground font-medium transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-6 h-6" />
            Back to Home
          </button>
        </div>

        {/* What Happens Next */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-amber-50 border-4 border-yellow-300 rounded-3xl p-10">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            What Happens Next?
          </h3>
          <div className="space-y-6 text-left max-w-2xl mx-auto">
            {[
              "Your professional will contact you 30 minutes before arrival",
              "Track real-time location and ETA on the map",
              "Service completed with before/after photos",
              "Digital invoice + warranty automatically activated",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-5">
                <span className="text-4xl font-bold text-yellow-600">
                  {i + 1}
                </span>
                <p className="text-xl text-foreground pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-16 text-center">
          <p className="text-3xl font-bold text-green Moving text-green-600">
            Thank you for trusting us!
            <br />
            <span className="text-yellow-600">See you soon!</span>
          </p>
        </div>
      </main>
    </div>
  );
}

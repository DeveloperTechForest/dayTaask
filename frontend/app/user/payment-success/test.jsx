// app/payment-success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Confetti from "react-confetti";
import {
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Home,
  ChevronLeft,
} from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId") || "12345";

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto redirect to dashboard after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/user/dashboard");
    }, 30000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-light-bg relative overflow-hidden">
      {/* Confetti Celebration */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={600}
        gravity={0.25}
        colors={["#facc15", "#fbbf24", "#f59e0b", "#d97706", "#92400e"]} // Yellow theme
      />

      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-brand"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-card rounded-3xl border-4 border-green-200 shadow-2xl overflow-hidden">
          <div className="p-10 sm:p-16 text-center">
            {/* Success Icon */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-24 h-24 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-2xl text-muted-foreground mb-10">
              Your booking is confirmed. We're excited to serve you!
            </p>

            {/* Booking ID Badge */}
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold text-xl rounded-full shadow-lg mb-12">
              Booking ID: #{bookingId}
            </div>

            {/* Booking Details Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-8">
                Booking Details
              </h3>

              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled For
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      Today, March 15, 2025 at 11:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service Address
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      123 Main Street, Sector 5, Gurgaon
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-3xl font-bold text-green-600">₹2,499</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-10 mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-8">
                What's Next?
              </h3>
              <div className="space-y-5 text-left max-w-2xl mx-auto">
                {[
                  "You'll receive a confirmation SMS and email shortly",
                  "Your expert will be assigned within 30 minutes",
                  "Track your booking live from your dashboard",
                  "Our professional will arrive on time & complete the job perfectly",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-4xl font-bold text-yellow-600">
                      {i + 1}.
                    </span>
                    <p className="text-lg text-foreground pt-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-5 max-w-md mx-auto">
              <button
                onClick={() => router.push(`/tracking/${bookingId}`)}
                className="w-full bg-green-600 text-white font-bold text-xl py-6 rounded-2xl hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4"
              >
                Track Your Booking Live
                <CheckCircle className="w-7 h-7" />
              </button>

              <div className="grid grid-cols-2 gap-5">
                <button
                  onClick={() => router.push(`/invoice/${bookingId}`)}
                  className="py-5 border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  Download Invoice
                </button>

                <button
                  onClick={() => router.push("/support")}
                  className="py-5 border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  Contact Support
                </button>
              </div>

              <button
                onClick={() => router.push("/")}
                className="w-full py-5 text-muted-foreground hover:text-foreground font-medium transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Home className="w-6 h-6" />
                Back to Home
              </button>
            </div>

            {/* Support */}
            <div className="mt-16 pt-10 border-t border-border">
              <p className="text-muted-foreground mb-6 text-lg">
                Need help? We're available 24/7
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="flex items-center gap-3 text-green-600 font-bold text-xl hover:underline">
                  <Phone className="w-8 h-8" />
                  Call: 1800-123-4567
                </button>
                <button className="flex items-center gap-3 text-green-600 font-bold text-xl hover:underline">
                  <MessageCircle className="w-8 h-8" />
                  Start Live Chat
                </button>
              </div>
            </div>

            {/* Final Note */}
            <div className="mt-12 p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl">
              <p className="text-center text-2xl font-bold">
                Thank you for choosing us!
                <br />
                <span className="text-yellow-300">
                  Your satisfaction is our priority
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

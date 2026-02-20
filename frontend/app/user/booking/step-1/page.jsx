// app/services/electrical-wiring/page.jsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

// Import Lucide React Icons
import { ArrowLeft, Star, Clock, Shield, Check } from "lucide-react";

export default function BookingStep1() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-700 text-md font-medium hover:text-amber-600"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ⭐ DO NOT CHANGE STEPPER (only removed 6) */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-2xl ring-4 ring-amber-200">
              1
            </div>
            <div className="w-24 h-1 bg-amber-500"></div>

            {[2, 3, 4, 5].map((num) => (
              <React.Fragment key={num}>
                <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">
                  {num}
                </div>
                {num < 5 && <div className="w-24 h-1 bg-gray-300/30"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Service Summary
          </h1>
          <p className="text-sm text-gray-600">
            Confirm the service you selected
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Service Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-56">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-4 border-amber-100">
                      <img
                        src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80"
                        alt="Electrician working"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Electrical Wiring & Repair
                      </h2>
                      <p className="text-sm text-gray-600">
                        Professional electrical services for your home safety
                        and convenience
                      </p>
                    </div>

                    {/* Badges (React Icons used) */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm shadow">
                        <Star
                          size={16}
                          className="text-amber-600 fill-amber-600"
                        />
                        4.8 (2,453)
                      </span>

                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} /> 1–2 hours
                      </span>

                      <span className="flex items-center gap-1 text-gray-600">
                        <Shield size={16} /> 30-day warranty
                      </span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mt-8 pt-6 border-t border-amber-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What's Included
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Complete inspection and diagnosis",
                      "Professional repair work",
                      "Quality parts replacement",
                      "Post-service warranty",
                      "Cleanup after work",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shadow">
                          <Check size={16} className="text-amber-600" />
                        </div>

                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Price Sidebar */}
          <div>
            <div className="sticky top-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl p-6">
              <p className="text-sm text-amber-100">Starting from</p>

              <div className="mt-2">
                <span className="text-4xl font-bold">₹299</span>
              </div>

              <p className="text-xs text-amber-100 mt-1">+ applicable taxes</p>

              <button
                onClick={() => router.push("/user/booking/step-2")}
                className="w-full mt-6 bg-white text-amber-600 font-bold text-lg py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Continue Booking
              </button>

              <div className="mt-6 pt-4 border-t border-white/30 text-center">
                <p className="text-sm text-white/90">
                  Trusted by <span className="text-lg font-bold">50,000+</span>{" "}
                  happy homes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

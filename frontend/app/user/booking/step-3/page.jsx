// app/booking/step-3/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ArrowLeft, Zap, CheckCircle, Star } from "lucide-react";

export default function BookingStep3() {
  const router = useRouter();
  const [selectedTaaskr, setSelectedTaaskr] = useState("auto");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-700 hover:text-amber-600 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* ⭐ STEP 3 (Do NOT change anything here — only spacing reduced slightly) */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
              1
            </div>
            <div className="w-20 h-1 bg-amber-500"></div>

            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
              2
            </div>
            <div className="w-20 h-1 bg-amber-500"></div>

            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-2xl ring-4 ring-amber-200">
              3
            </div>
            <div className="w-20 h-1 bg-amber-500"></div>

            {[4, 5].map((num) => (
              <React.Fragment key={num}>
                <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">
                  {num}
                </div>
                {num < 6 && <div className="w-20 h-1 bg-gray-300/30"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Taaskr
          </h1>
          <p className="text-md text-gray-600">
            Pick a professional or let us auto-match the best one
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Auto-match */}
          <label
            className={`relative p-6 bg-white rounded-2xl border-4 cursor-pointer transition-all shadow-lg hover:shadow-xl
              ${
                selectedTaaskr === "auto"
                  ? "border-amber-500 ring-4 ring-amber-200 bg-amber-50"
                  : "border-gray-200 hover:border-amber-400"
              }`}
            onClick={() => setSelectedTaaskr("auto")}
          >
            <input type="radio" name="taaskr" className="sr-only" readOnly />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Auto-match
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We’ll assign the{" "}
                    <span className="font-bold text-amber-600">
                      highest-rated Taaskr
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-amber-600 font-semibold">
                      4.9+ Rating
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">Fastest arrival</span>
                  </div>
                </div>
              </div>

              {selectedTaaskr === "auto" && (
                <CheckCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>
          </label>

          {/* Specific Taaskr */}
          <label
            className={`relative p-6 bg-white rounded-2xl border-4 cursor-pointer transition-all shadow-lg hover:shadow-xl
              ${
                selectedTaaskr === "rajesh"
                  ? "border-amber-500 ring-4 ring-amber-200 bg-amber-50"
                  : "border-gray-200 hover:border-amber-400"
              }`}
            onClick={() => setSelectedTaaskr("rajesh")}
          >
            <input type="radio" name="taaskr" className="sr-only" readOnly />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/300?img=12"
                    alt="Rajesh Kumar"
                    className="w-20 h-20 rounded-xl object-cover ring-2 ring-amber-100"
                  />
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    Top Rated
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Rajesh Kumar
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Expert Electrician • 8+ years
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-4 h-4" />
                      4.9
                    </span>
                    <span className="text-gray-600">• 500+ jobs</span>
                  </div>
                </div>
              </div>

              {selectedTaaskr === "rajesh" && (
                <CheckCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>
          </label>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/user/booking/step-4")}
            className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:scale-105 transition-all"
          >
            Continue Booking
          </button>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-lg font-semibold text-gray-800">
            All Taaskrs are{" "}
            <span className="text-amber-600">background verified</span> &
            <span className="text-amber-600"> highly trained</span>
          </p>
        </div>
      </div>
    </div>
  );
}

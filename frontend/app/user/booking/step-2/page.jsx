// app/booking/step-2/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Home,
  Info,
  MessageSquare,
} from "lucide-react";

export default function BookingStep2() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");

  const timeSlots = [
    "09:00 AM – 11:00 AM",
    "11:30 AM – 01:30 PM",
    "02:00 PM – 04:00 PM",
    "04:30 PM – 06:30 PM",
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const isFormValid =
    selectedDate && selectedSlot && address.trim().length > 15;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600 text-xs font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 🔥 Stepper — NOT TOUCHED */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
              1
            </div>
            <div className="w-24 h-1 bg-amber-500"></div>

            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-2xl ring-4 ring-amber-200">
              2
            </div>
            <div className="w-24 h-1 bg-amber-500"></div>

            {[3, 4, 5].map((num) => (
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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Book Your Service
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Date, time & location — all in one step
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* LEFT FORM */}
          <div className="space-y-8">
            {/* Date */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Calendar size={28} className="text-amber-600" />
                Select Date
              </h2>

              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-14 px-5 text-base bg-amber-50 border-2 border-amber-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-600 transition-all cursor-pointer"
              />

              {selectedDate && (
                <div className="mt-4 p-4 bg-amber-100 border-2 border-amber-300 rounded-2xl text-center">
                  <p className="text-lg font-semibold text-amber-800">
                    {formatDate(selectedDate)}
                  </p>
                </div>
              )}
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Clock size={28} className="text-amber-600" />
                Choose Time Slot
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {timeSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`p-5 border-2 rounded-2xl cursor-pointer text-center text-sm font-semibold transition-all shadow-md hover:shadow-lg
                      ${
                        selectedSlot === slot
                          ? "border-amber-600 bg-amber-600 text-white ring-4 ring-amber-200"
                          : "border-gray-300 hover:border-amber-500 hover:bg-amber-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="sr-only"
                    />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Home size={28} className="text-amber-600" />
                Service Address
              </h2>

              <textarea
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat/House no., Building, Street, Landmark..."
                className="w-full p-5 text-base bg-amber-50 border-2 border-amber-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-600 resize-none transition-all placeholder:text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                <Info size={16} />
                Include landmark for faster arrival
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MessageSquare size={28} className="text-amber-600" />
                Special Instructions (Optional)
              </h2>

              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Call on arrival, pet inside..."
                className="w-full p-5 text-base bg-gray-50 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-600 resize-none transition-all"
              />
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:sticky lg:top-20 space-y-8 h-fit">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl p-8">
              <p className="text-amber-100 text-lg font-medium mb-4">
                Service Summary
              </p>
              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span>Electrical Wiring & Repair</span>
                  <span className="font-bold">₹299</span>
                </div>
                <div className="h-px bg-white/30"></div>
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total Amount</span>
                  <span>₹299</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/user/booking/step-3")}
              disabled={!isFormValid}
              className={`w-full py-5 text-xl font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 duration-300
                ${
                  isFormValid
                    ? "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Continue to Choose Taaskr
            </button>

            <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300 text-center">
              <p className="text-xl font-bold text-gray-800">
                Trusted by <span className="text-amber-600">50,000+</span> homes
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Verified Taaskrs • On-time • 30-day warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

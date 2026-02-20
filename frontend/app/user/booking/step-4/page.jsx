// app/booking/step-4/page.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

// Lucide React Icons
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function BookingStep4() {
  const router = useRouter();
  const basePrice = 299;

  const [extras, setExtras] = useState([
    {
      name: "Extra wiring (per meter)",
      price: 45,
      quantity: 0,
      checked: false,
    },
    { name: "Switchboard upgrade", price: 350, quantity: 0, checked: false },
    { name: "Emergency call-out fee", price: 150, quantity: 0, checked: false },
  ]);

  const total =
    basePrice +
    extras.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleExtra = (index) => {
    setExtras((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const updateQuantity = (index, qty) => {
    const value = Math.max(0, parseInt(qty) || 0);
    setExtras((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: value } : item))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-700 hover:text-amber-600 text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* ⭐ DO NOT MODIFY STEPPER (only spacing reduced) */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow">
                  {step}
                </div>
                <div className="w-20 h-1 bg-amber-500"></div>
              </React.Fragment>
            ))}

            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-amber-200">
              4
            </div>
            <div className="w-20 h-1 bg-amber-500"></div>

            {[5].map((num) => (
              <React.Fragment key={num}>
                <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs">
                  {num}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Add-ons & Materials
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Select any extras you might need
          </p>
        </div>

        {/* Add-ons List */}
        <div className="space-y-5 mb-10">
          {extras.map((item, index) => (
            <div
              key={index}
              className={`p-5 bg-white rounded-2xl border-2 transition shadow hover:shadow-lg
                ${
                  item.checked || item.quantity > 0
                    ? "border-amber-500 ring-4 ring-amber-200 bg-amber-50"
                    : "border-gray-200 hover:border-amber-400"
                }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleExtra(index)}
                    className="w-5 h-5 text-amber-600 border-gray-300 cursor-pointer"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.price}{" "}
                      {item.price === 45 ? "/ meter" : "(one-time)"}
                    </p>
                  </div>
                </div>

                {/* Quantity (only for wiring) */}
                {item.price === 45 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Meters:</span>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                      className="w-16 px-3 py-2 text-sm font-semibold text-center border rounded-lg focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                )}

                {(item.checked || item.quantity > 0) && (
                  <CheckCircle size={28} className="text-amber-600 ml-3" />
                )}
              </label>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl p-6 mb-10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-amber-100">Total Amount</p>
              <p className="text-3xl md:text-4xl font-bold mt-1">₹{total}</p>
              <p className="text-xs text-amber-100 mt-2">
                Base: ₹299 + Add-ons
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-amber-100">You save up to</p>
              <p className="text-3xl font-bold">30%</p>
              <p className="text-xs text-amber-100">vs local rates</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/user/booking/step-5")}
            className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:scale-105 transition"
          >
            Continue to Payment
          </button>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-10">
          <p className="text-sm md:text-base font-semibold text-gray-800">
            Transparent pricing • No hidden charges •{" "}
            <span className="text-amber-600">100% satisfaction guaranteed</span>
          </p>
        </div>
      </div>
    </div>
  );
}

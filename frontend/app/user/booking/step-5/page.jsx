// app/booking/step-5/page.jsx → SMALLER UI (Stepper UNCHANGED)
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

// Mock data
const mockBooking = {
  service: {
    name: "Electrical Wiring & Repair",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80",
    date: "Thursday, February 1, 2025",
    time: "10:00 AM – 12:00 PM",
  },
  taaskr: {
    name: "Rajesh Kumar",
    rating: 4.9,
    jobs: 500,
    avatar: "https://i.pravatar.cc/300?img=12",
  },
  address: "B-12, Green Park Extension, Near Metro Station, New Delhi - 110016",
  instructions: "Call when you reach. Pet dog inside.",
  addons: [
    { name: "Extra wiring", qty: 2, price: 45, total: 90 },
    { name: "Switchboard upgrade", qty: 1, price: 350, total: 350 },
  ],
  basePrice: 299,
  serviceFee: 30,
};

export default function BookingStep5() {
  const router = useRouter();

  const subtotal = mockBooking.addons.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const total = mockBooking.basePrice + subtotal + mockBooking.serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-700 hover:text-amber-600 text-sm font-medium"
          >
            <i data-lucide="arrow-left" className="w-4 h-4"></i>
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ❗ DO NOT TOUCH — STEPPER (unchanged) */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {step}
                </div>
                <div className="w-20 h-1 bg-amber-500"></div>
              </React.Fragment>
            ))}

            <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-2xl ring-4 ring-amber-200">
              5
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review & Confirm
          </h1>
          <p className="text-base text-gray-600">
            You're one step away from completing your booking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="tool" className="w-6 h-6 text-amber-600"></i>
                Service Details
              </h2>

              <div className="flex gap-5">
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-amber-100">
                  <img
                    src={mockBooking.service.image}
                    alt="Service"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    {mockBooking.service.name}
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <i
                        data-lucide="calendar"
                        className="w-4 h-4 text-amber-600"
                      ></i>
                      {mockBooking.service.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <i
                        data-lucide="clock"
                        className="w-4 h-4 text-amber-600"
                      ></i>
                      {mockBooking.service.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Taaskr */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="user" className="w-6 h-6 text-amber-600"></i>
                Your Taaskr
              </h2>

              <div className="flex items-center gap-5">
                <img
                  src={mockBooking.taaskr.avatar}
                  width={90}
                  height={90}
                  className="w-24 h-24 rounded-xl object-cover ring-2 ring-amber-100"
                />

                <div>
                  <p className="text-lg font-bold">{mockBooking.taaskr.name}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <i
                      data-lucide="star"
                      className="w-4 h-4 text-amber-500 fill-amber-500"
                    ></i>
                    {mockBooking.taaskr.rating} ({mockBooking.taaskr.jobs}+
                    jobs)
                  </p>
                </div>
              </div>
            </div>

            {/* Addons */}
            {mockBooking.addons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <i
                    data-lucide="plus-circle"
                    className="w-6 h-6 text-amber-600"
                  ></i>
                  Add-ons
                </h2>

                <div className="space-y-2">
                  {mockBooking.addons.map((addon, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm font-medium"
                    >
                      <span>
                        {addon.name} {addon.qty > 1 && `(${addon.qty})`}
                      </span>
                      <span className="text-amber-600 font-semibold">
                        ₹{addon.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i data-lucide="home" className="w-6 h-6 text-amber-600"></i>
                Service Address
              </h2>

              <p className="text-sm text-gray-700">{mockBooking.address}</p>

              {mockBooking.instructions && (
                <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                  <span className="font-semibold">Note:</span>{" "}
                  {mockBooking.instructions}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE PAYMENT */}
          <div>
            <div className="sticky top-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-lg p-6 space-y-6">
              <div>
                <p className="text-sm text-amber-100 font-medium">
                  Final Amount
                </p>
                <p className="text-4xl font-bold mt-1">₹{total}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Service</span>
                  <span>₹{mockBooking.basePrice}</span>
                </div>

                {mockBooking.addons.map((addon, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{addon.name}</span>
                    <span>₹{addon.total}</span>
                  </div>
                ))}

                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₹{mockBooking.serviceFee}</span>
                </div>

                <div className="h-px bg-white/30 my-2"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/user/payment")}
                className="w-full py-3 bg-white text-amber-600 font-semibold text-lg rounded-xl hover:bg-gray-100 transition"
              >
                Pay ₹{total}
              </button>

              <p className="text-xs text-center text-amber-100 pt-2">
                100% Secure • Instant Confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lucide Icons */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('DOMContentLoaded', () => lucide?.createIcons?.());`,
        }}
      />
    </div>
  );
}

"use client";

import { useAuth } from "@/app/context/AuthContext";
import Header from "@/components/Header";
import {
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Settings,
  User,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const activeBookings = [
    {
      id: 1,
      service: "Electrical Wiring & Repair",
      date: "Today, 3:00 PM",
      status: "Confirmed",
      address: "123 Main Street, Apartment 4B",
      price: "₹353",
    },
  ];

  const pastBookings = [
    {
      id: 2,
      service: "AC Service & Repair",
      date: "Dec 10, 2024",
      status: "Completed",
      address: "123 Main Street, Apartment 4B",
      price: "₹599",
    },
    {
      id: 3,
      service: "Home Deep Cleaning",
      date: "Dec 5, 2024",
      status: "Completed",
      address: "123 Main Street, Apartment 4B",
      price: "₹1,199",
    },
  ];

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            My Dashboard
          </h1>
          <p className="text-base text-muted-foreground">
            Welcome back! Here's everything you need
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Active Bookings</p>
                <p className="text-3xl font-bold mt-1">1</p>
              </div>
              <Calendar className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Wallet Balance</p>
                <p className="text-3xl font-bold mt-1">₹500</p>
              </div>
              <Wallet className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Total Services</p>
                <p className="text-3xl font-bold mt-1">12</p>
              </div>
              <Settings className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Saved This Year</p>
                <p className="text-2xl font-bold mt-1">₹8,450</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-card rounded-2xl shadow border border-border">
          <div className="border-b border-border px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">Your Bookings</h2>

            <div className="flex gap-2">
              <button className="px-5 py-2 bg-yellow-500 text-white font-semibold rounded-xl">
                Active (1)
              </button>
              <button className="px-5 py-2 bg-gray-100 text-foreground font-semibold rounded-xl">
                Past (2)
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Active Bookings */}
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-4">
                Active & Upcoming
              </h3>

              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold">{booking.service}</h4>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                          {booking.status}
                        </span>
                      </div>

                      <p className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-600" />
                        {booking.date}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {booking.address}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {booking.price}
                      </p>
                      <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg">
                        Track Live
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Past Bookings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Past Services</h3>

              <div className="space-y-3">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-card border border-border rounded-xl p-4 hover:border-gray-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold">
                          {booking.service}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {booking.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold">{booking.price}</p>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <User className="w-14 h-14" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h3 className="text-2xl font-bold">{user.full_name}</h3>
              <p className="text-sm opacity-90">{user.email}</p>
              <p className="text-sm opacity-90">{user.phone}</p>
            </div>

            <button
              className="px-6 py-3 bg-white text-indigo-600 text-sm font-semibold rounded-xl flex items-center gap-2 shadow cursor-pointer hover:bg-white/90 transition-all"
              onClick={() => router.push("/user/profile")}
            >
              Edit Profile
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xl font-semibold text-foreground">
            Thank you for being with us <br />
            <span className="text-yellow-600 text-2xl">
              Your home is in safe hands
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

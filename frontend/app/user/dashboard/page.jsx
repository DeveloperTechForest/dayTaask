"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import {
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Settings,
  User,
  ChevronRight,
  HousePlus,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [stats, setStats] = useState({
    active_bookings: 0,
    wallet_balance: 0,
    total_services: 0,
    saved_this_year: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "past"

  useEffect(() => {
    if (!user) return;

    async function fetchDashboard() {
      setLoading(true);
      setError("");

      try {
        const res = await apiFetch("/api/bookings/dashboard/");

        if (res?.error === "TOKEN_EXPIRED") {
          router.push("/login");
          return;
        }

        if (res?.error) {
          throw new Error(res.error || "Failed to load dashboard");
        }

        setStats(res.stats || {});
        setActiveBookings(res.active_bookings || []);
        setPastBookings(res.past_bookings || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [user, router]);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Please log in to view your dashboard
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center text-red-600 text-xl">
        {error || "Failed to load dashboard"}
      </div>
    );
  }

  // Choose which bookings to show based on tab
  const displayedBookings =
    activeTab === "active" ? activeBookings : pastBookings;


  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {user.full_name} Dashboard
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
                <p className="text-3xl font-bold mt-1">
                  {stats.active_bookings}
                </p>
              </div>
              <Calendar className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Most booked services</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.most_booked_service || "N/A"}
                </p>
              </div>
              <HousePlus className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Total Services</p>
                <p className="text-3xl font-bold mt-1">
                  {stats.total_services}
                </p>
              </div>
              <Settings className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-90 text-sm">Saved This Year</p>
                <p className="text-2xl font-bold mt-1">
                  ₹{stats.saved_this_year}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quote Requests Shortcuts */}
        <div className="bg-card rounded-2xl shadow border border-border mb-8">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-xl font-bold text-foreground">
              Quote Requests
            </h2>
          </div>
          <div className="p-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/user/quotes/active")}
              className="px-5 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600"
            >
              View Active Quotes
            </button>
            <button
              onClick={() => router.push("/user/quotes/past")}
              className="px-5 py-3 bg-gray-100 text-foreground font-semibold rounded-xl hover:bg-gray-200"
            >
              View Past Quotes
            </button>
            <button
              onClick={() => router.push("/user/quote/quote-request")}
              className="px-5 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-gray-50"
            >
              Request New Quote
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-card rounded-2xl shadow border border-border">
          <div className="border-b border-border px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">Your Bookings</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-5 py-2 font-semibold rounded-xl transition-all ${
                  activeTab === "active"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                Active ({activeBookings.length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-5 py-2 font-semibold rounded-xl transition-all ${
                  activeTab === "past"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Active & Upcoming */}
            {activeTab === "active" && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-4">
                  Active & Upcoming
                </h3>

                {activeBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No active or upcoming bookings
                  </p>
                ) : (
                  activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm mb-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold">
                              {booking.service_name}
                            </h4>

                            {/* Status Badge with dynamic color */}
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                booking.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : booking.status === "confirmed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : booking.status === "started"
                                      ? "bg-cyan-100 text-cyan-800"
                                      : booking.status === "completed"
                                        ? "bg-slate-100 text-slate-800"
                                        : booking.status === "cancelled"
                                          ? "bg-rose-100 text-rose-800"
                                          : "bg-gray-100 text-gray-800" // fallback
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>

                          <p className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-green-600" />
                            {new Date(booking.scheduled_at).toLocaleString(
                              "en-IN",
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </p>

                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {booking.address}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ₹
                            {parseFloat(booking.total_price).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          <button
                            onClick={() =>
                              router.push(`/user/tracking/${booking.id}`)
                            }
                            className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Track Live
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Past Services */}
            {activeTab === "past" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Past Services</h3>

                {pastBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No past services yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-card border border-border rounded-xl p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h4 className="text-base font-bold">
                              {booking.service_name}
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(
                                booking.scheduled_at,
                              ).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ₹
                              {parseFloat(booking.total_price).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-14 h-14" />
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h3 className="text-2xl font-bold">{user.full_name}</h3>
              <p className="text-sm opacity-90">{user.email}</p>
              <p className="text-sm opacity-90">
                {user.phone ? `+91 ${user.phone}` : "Phone not provided"}
              </p>
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

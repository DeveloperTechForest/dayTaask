// app/tracking/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import {
  CheckCircle,
  Clock,
  MapPin,
  User,
  Truck,
  Home,
  Phone,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";

export default function TrackBooking() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid booking ID");
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      setLoading(true);
      setError("");

      try {
        const res = await apiFetch(`/api/bookings/customer/bookings/${id}/`);

        if (res?.error === "TOKEN_EXPIRED") {
          router.push("/login");
          return;
        }

        if (res?.error || !res?.id) {
          throw new Error("Booking not found");
        }

        setBooking(res);
      } catch (err) {
        console.error(err);
        setError("Unable to load tracking details.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          Loading tracking...
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 text-xl">
        <AlertCircle className="w-16 h-16 mb-4" />
        {error || "Booking not found"}
      </div>
    );
  }

  const statusColor =
    booking.status === "completed"
      ? "bg-green-500"
      : booking.status === "cancelled"
        ? "bg-red-500"
        : booking.status === "started"
          ? "bg-blue-500"
          : booking.status === "confirmed"
            ? "bg-emerald-500"
            : "bg-amber-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Track Booking #{booking.booking_code || id}
        </h1>
        <p className="text-gray-600 mt-1">
          {booking.service_name} •{" "}
          {new Date(booking.scheduled_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        {/* Status Card */}
        <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl font-bold ${statusColor}`}
            >
              {booking.status.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {booking.status}
              </h2>
              <p className="text-gray-600">
                {booking.status === "confirmed"
                  ? "Confirmed & scheduled"
                  : booking.status === "started"
                    ? "Service in progress"
                    : booking.status === "completed"
                      ? "Service completed successfully"
                      : "Booking status"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-amber-600">
              ₹{parseFloat(booking.total_price || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>

        {/* Booking Progress */}
        <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Booking Progress
          </h3>

          <div className="space-y-8 relative pl-10">
            {/* Line */}
            <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-gray-200" />

            {/* Booking Placed */}
            <div className="flex items-start gap-6 relative">
              <div className="absolute -left-10 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="relative pl-4">
                <p className="font-semibold text-gray-900">Booking Placed</p>
                <p className="text-sm text-gray-600">
                  {new Date(
                    booking.created_at || booking.scheduled_at,
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Booking Confirmed */}
            <div className="flex items-start gap-6 relative">
              <div className="absolute -left-10 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="relative pl-4">
                <p className="font-semibold text-gray-900">Booking Confirmed</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            {/* Booking Confirmed */}
            <div className="flex items-start gap-6 relative">
              <div className="absolute -left-10 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="relative pl-4">
                <p className="font-semibold text-gray-900">Taaskr Assigned</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            {/* Service Started */}
            <div className="flex items-start gap-6 relative">
              <div className="absolute -left-10 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div className="relative pl-4">
                <p className="font-semibold text-gray-900">Service Started</p>
                <p className="text-sm text-gray-600">Not started</p>
              </div>
            </div>

            {/* Service Completed */}
            <div className="flex items-start gap-6 relative">
              <div className="absolute -left-10 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="relative pl-4">
                <p className="font-semibold text-gray-900">Service Completed</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Taaskr */}
        <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Your Taaskr</h3>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="w-9 h-9 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Ramesh Kumar</p>
              <p className="text-gray-600">Expert in {booking.service_name}</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                <Phone className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                <MessageCircle className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-4 bg-orange-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all">
            <MessageCircle className="w-6 h-6" />
            Contact Support
          </button>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex-1 py-4 border-2 border-gray-300 font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all"
          >
            <Home className="w-6 h-6" />
            Dashboard
          </button>

          <button className="flex-1 py-4 bg-red-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all">
            <AlertCircle className="w-6 h-6" />
            Cancel Booking
          </button>
        </div>
      </main>
    </div>
  );
}

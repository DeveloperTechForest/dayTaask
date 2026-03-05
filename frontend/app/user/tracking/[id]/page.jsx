// app/tracking/[id]/page.jsx   (dynamic route: /tracking/42)

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import {
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  Phone,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Camera,
  User,
  Home,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";

export default function TrackBooking() {
  const { id } = useParams(); // booking ID from URL
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
        setError("Unable to load booking tracking.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [id, router]);

  // Progress steps based on your status flow
  const getProgress = () => {
    if (!booking) return [];

    const statusOrder = ["pending", "confirmed", "started", "completed"];
    const currentIndex = statusOrder.indexOf(booking.status);

    return [
      {
        title: "Booking Placed",
        description: "Your request has been received",
        completed: currentIndex >= 0,
        time: booking.created_at
          ? new Date(booking.created_at).toLocaleString("en-IN")
          : "N/A",
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        title: "Booking Confirmed",
        description: "Taaskr accepted your job",
        completed: currentIndex >= 1,
        time: booking.confirmed_at
          ? new Date(booking.confirmed_at).toLocaleString("en-IN")
          : "Pending",
        icon: CheckCircle,
        color: currentIndex >= 1 ? "text-green-600" : "text-gray-400",
      },
      {
        title: "Service Started",
        description: "Taaskr has arrived and started work",
        completed: currentIndex >= 2,
        time: booking.started_at
          ? new Date(booking.started_at).toLocaleString("en-IN")
          : "Not started",
        icon: Clock,
        color: currentIndex >= 2 ? "text-blue-600" : "text-gray-400",
      },
      {
        title: "Service Completed",
        description: "Job finished — payment processed",
        completed: currentIndex >= 3,
        time: booking.completed_at
          ? new Date(booking.completed_at).toLocaleString("en-IN")
          : "Pending",
        icon: CheckCircle,
        color: currentIndex >= 3 ? "text-green-600" : "text-gray-400",
      },
    ];
  };

  const progress = getProgress();

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-600 text-xl">
        <AlertCircle className="w-16 h-16 mb-4" />
        {error || "Booking not found"}
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Go Back
        </button>
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
        {/* Back & Title */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Track Booking #{booking.booking_code || id}
          </h1>
          <p className="text-gray-600 mt-1">
            {booking.service_name} •{" "}
            {new Date(booking.scheduled_at).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold ${statusColor}`}
              >
                {booking.status.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {booking.status}
                </h2>
                <p className="text-gray-600">
                  {booking.status === "completed"
                    ? "Service completed successfully"
                    : booking.status === "cancelled"
                      ? "Booking cancelled"
                      : booking.status === "started"
                        ? "Service in progress"
                        : "Confirmed & scheduled"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-amber-600">
                ₹{parseFloat(booking.total_price).toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Booking Progress
          </h3>

          <div className="relative pl-10">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />

            <div className="space-y-10">
              {progress.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  <div
                    className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-4 border-white ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <step.icon
                      className={`w-5 h-5 ${step.completed ? "text-white" : "text-gray-600"}`}
                    />
                  </div>

                  <div className="flex-1">
                    <h4
                      className={`font-semibold text-lg ${
                        step.completed ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expert / Taaskr Info */}
        {booking.status !== "pending" && booking.status !== "cancelled" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your Taaskr
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="w-10 h-10 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">Ramesh Kumar</p>
                <p className="text-sm text-gray-600">
                  Expert in {booking.service_name}
                </p>
                <div className="flex gap-4 mt-2">
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-800">
                    <Phone className="w-5 h-5" />
                    Call
                  </button>
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-800">
                    <MessageCircle className="w-5 h-5" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Before/After Photos (from Taaskr) */}
        {(booking.status === "started" || booking.status === "completed") && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Work Photos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Before Photos */}
              <div className="col-span-full">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Before Work
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Mock - in real app fetch from booking.before_photos */}
                  {["/placeholder.jpg", "/placeholder.jpg"].map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={src}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* After Photos */}
              {booking.status === "completed" && (
                <div className="col-span-full mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    After Work
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["/placeholder.jpg", "/placeholder.jpg"].map((src, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={src}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/support")}
            className="flex items-center justify-center gap-3 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-md"
          >
            <MessageCircle className="w-6 h-6" />
            Contact Support
          </button>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center justify-center gap-3 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all"
          >
            <Home className="w-6 h-6" />
            Dashboard
          </button>

          <button
            disabled={
              booking.status === "cancelled" || booking.status === "completed"
            }
            className={`flex items-center justify-center gap-3 py-4 font-semibold rounded-xl transition-all shadow-md ${
              booking.status === "cancelled" || booking.status === "completed"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <AlertCircle className="w-6 h-6" />
            Cancel Booking
          </button>
        </div>
      </main>
    </div>
  );
}

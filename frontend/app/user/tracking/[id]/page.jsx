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
  Phone,
  Truck,
  Home,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

export default function TrackBooking() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [startOtp, setStartOtp] = useState("");
  const [completionOtp, setCompletionOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState({
    start: false,
    completion: false,
  });
  const [otpError, setOtpError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!id) return setError("Invalid booking ID");

    async function fetchBooking() {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/bookings/customer/bookings/${id}/`);
        if (res?.error) throw new Error(res.error);
        setBooking(res);
      } catch (err) {
        setError("Unable to load tracking details.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (!booking?.service || booking?.custom_service_id) {
      setServiceDetails(null);
      return;
    }

    async function fetchServiceDetails() {
      try {
        const res = await apiFetch(
          `/api/services/services-detail/${booking.service}/`,
        );
        if (res?.error) return;
        setServiceDetails(res);
      } catch (err) {
        setServiceDetails(null);
      }
    }

    fetchServiceDetails();
  }, [booking?.service, booking?.custom_service_id]);

  const handleCustomServiceAction = async (action) => {
    if (!booking) return;
    try {
      setChangeLoading(true);
      await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/custom-service/action/`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        },
      );
      const refreshed = await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/`,
      );
      setBooking(refreshed);
    } catch (err) {
      setError("Failed to update service change.");
    } finally {
      setChangeLoading(false);
    }
  };

  const handleViewStartOtp = async () => {
    if (!booking) return;
    try {
      setOtpError("");
      setOtpLoading((prev) => ({ ...prev, start: true }));
      const res = await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/start-otp/`,
      );
      if (res?.error) throw new Error(res.detail || "Failed to load OTP");
      setStartOtp(res.start_otp || "");
    } catch (err) {
      setOtpError(err?.message || "Failed to load start OTP");
    } finally {
      setOtpLoading((prev) => ({ ...prev, start: false }));
    }
  };

  const handleViewCompletionOtp = async () => {
    if (!booking) return;
    try {
      setOtpError("");
      setOtpLoading((prev) => ({ ...prev, completion: true }));
      const res = await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/completion-otp/`,
      );
      if (res?.error) throw new Error(res.detail || "Failed to load OTP");
      setCompletionOtp(res.completion_otp || "");
    } catch (err) {
      setOtpError(err?.message || "Failed to load completion OTP");
    } finally {
      setOtpLoading((prev) => ({ ...prev, completion: false }));
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    try {
      setCancelLoading(true);
      const res = await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/cancel/`,
        { method: "POST" },
      );
      if (res?.error) throw new Error(res.detail || "Cancel failed");
      const refreshed = await apiFetch(
        `/api/bookings/customer/bookings/${booking.id}/`,
      );
      setBooking(refreshed);
      setShowCancelModal(false);
    } catch (err) {
      setError(err?.message || "Unable to cancel booking.");
    } finally {
      setCancelLoading(false);
    }
  };

  // Progress steps (updated with OTP points)
  const progressSteps = [
    { title: "Booking Placed", completed: true },
    { title: "Taaskr Assigned", completed: booking?.status !== "pending" },
    {
      title: "Start OTP Shared",
      completed: !!startOtp,
      note: startOtp
        ? `OTP: ${startOtp}`
        : "Waiting for assignment",
    },
    { title: "Service Started", completed: booking?.status === "started" },
    { title: "Service Completed", completed: booking?.status === "completed" },
    {
      title: "Remaining Payment",
      completed: booking?.remaining_paid,
      note: booking?.remaining_paid
        ? "Paid"
        : `Pay ₹${booking?.remaining_amount || 0}`,
    },
    {
      title: "Completion OTP Shared",
      completed: !!completionOtp,
      note: completionOtp
        ? `OTP: ${completionOtp}`
        : "After payment",
    },
    { title: "Warranty Started", completed: !!booking?.warranty_start_date },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  const statusColor =
    {
      pending: "bg-amber-500",
      confirmed: "bg-emerald-500",
      started: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    }[booking.status] || "bg-gray-500";

  const addressLabel = (() => {
    if (!booking?.address) return "";
    if (typeof booking.address === "string") return booking.address;
    if (typeof booking.address === "number")
      return `Address #${booking.address}`;
    if (typeof booking.address === "object") {
      return (
        booking.address.full_address ||
        booking.address.address_line ||
        booking.address.line1 ||
        booking.address.address ||
        booking.address.street ||
        ""
      );
    }
    return "";
  })();

  const taaskrName =
    booking?.taaskr_name ||
    booking?.taaskr?.full_name ||
    booking?.taaskr?.name ||
    "";
  const taaskrPhone = booking?.taaskr_phone || booking?.taaskr?.phone || "";
  const taaskrProfileImage =
    booking?.taaskr_profile_image || booking?.taaskr?.profile_image || "";
  const isAssigned = booking?.assignment_status === "assigned" || !!taaskrName;
  const canViewStartOtp =
    booking?.assignment_status === "assigned" &&
    ["confirmed", "started"].includes(booking?.status);
  const canViewCompletionOtp =
    !!booking?.completion_requested_at &&
    ["paid", "cod_pending"].includes(booking?.payment_status) &&
    ["started", "completed"].includes(booking?.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-6"
        >
          <ChevronLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Track Booking #{booking.booking_code || id}
        </h1>
        <p className="text-gray-600 mb-6">
          {booking.service_name} •{" "}
          {new Date(booking.scheduled_at).toLocaleString("en-IN")}
        </p>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold ${statusColor}`}
            >
              {booking.status.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold capitalize">
                {booking.status}
              </h2>
              <p className="text-gray-600">
                {booking.status === "confirmed" ? "Confirmed & scheduled" : ""}
                {booking.status === "started" ? "Service in progress" : ""}
                {booking.status === "completed" ? "Service completed" : ""}
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

        {/* Service Details */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Service Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {booking.custom_service_name || booking.service_name}
              </p>
              {booking.custom_service_description ? (
                <p className="text-sm text-gray-600 mt-2">
                  {booking.custom_service_description}
                </p>
              ) : serviceDetails?.description ? (
                <p className="text-sm text-gray-600 mt-2">
                  {serviceDetails.description}
                </p>
              ) : null}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(booking.scheduled_at).toLocaleString("en-IN")}
              </p>
              {addressLabel && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {addressLabel}
                </p>
              )}
            </div>
          </div>

          {(booking.custom_service_whats_included?.length > 0 ||
            serviceDetails?.whats_included?.length > 0) && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Whats included
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                {(booking.custom_service_whats_included?.length
                  ? booking.custom_service_whats_included
                  : serviceDetails?.whats_included || []
                ).map((item, idx) => (
                  <li key={idx}>- {item}</li>
                ))}
              </ul>
            </div>
          )}

          {booking.addons?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Selected add-ons
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                {booking.addons.map((addon) => (
                  <li key={addon.id}>- {addon.addon_name}</li>
                ))}
              </ul>
            </div>
          )}

          {booking.location_notes && (
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                Location Notes:
              </span>{" "}
              {booking.location_notes}
            </div>
          )}
        </div>

        {/* OTP Actions */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">OTP Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold mb-2">Start OTP</p>
              <p className="text-xs text-gray-600 mb-3">
                Share this with the taaskr when they arrive to start the job.
              </p>
              <button
                onClick={handleViewStartOtp}
                disabled={!canViewStartOtp || otpLoading.start}
                className={`w-full py-3 rounded-xl font-semibold ${
                  !canViewStartOtp
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {otpLoading.start
                  ? "Loading..."
                  : startOtp
                    ? `OTP: ${startOtp}`
                    : "View Start OTP"}
              </button>
              {!canViewStartOtp && (
                <p className="text-xs text-gray-500 mt-2">
                  Available after taaskr is assigned and booking is confirmed.
                </p>
              )}
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold mb-2">Completion OTP</p>
              <p className="text-xs text-gray-600 mb-3">
                After work is done and payment is ready, share this to finish.
              </p>
              <button
                onClick={handleViewCompletionOtp}
                disabled={!canViewCompletionOtp || otpLoading.completion}
                className={`w-full py-3 rounded-xl font-semibold ${
                  !canViewCompletionOtp
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {otpLoading.completion
                  ? "Loading..."
                  : completionOtp
                    ? `OTP: ${completionOtp}`
                    : "View Completion OTP"}
              </button>
              {!canViewCompletionOtp && (
                <p className="text-xs text-gray-500 mt-2">
                  Available after taaskr requests completion and payment is
                  ready.
                </p>
              )}
            </div>
          </div>

          {otpError && (
            <p className="text-sm text-red-600 mt-3">{otpError}</p>
          )}
        </div>

        {/* Service Change Request */}
        {booking.custom_service_status === "sent" && (
          <div className="bg-white rounded-2xl shadow border border-amber-200 p-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-amber-700 mb-2">
                  Service Change Requested
                </h3>
                <p className="text-sm text-gray-600">
                  Your taaskr has proposed a change to the service details.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-700">
                  ₹
                  {parseFloat(booking.service_price || 0).toLocaleString(
                    "en-IN",
                  )}
                </p>
                <p className="text-xs text-gray-500">New price</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold">{booking.custom_service_name}</p>
              {booking.custom_service_description && (
                <p className="text-sm text-gray-600 mt-1">
                  {booking.custom_service_description}
                </p>
              )}
              {booking.custom_service_whats_included?.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {booking.custom_service_whats_included.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => handleCustomServiceAction("reject")}
                disabled={changeLoading}
                className="py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100"
              >
                Reject
              </button>
              <button
                onClick={() => handleCustomServiceAction("accept")}
                disabled={changeLoading}
                className="py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700"
              >
                {changeLoading ? "Updating..." : "Accept"}
              </button>
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Booking Progress</h3>
          <div className="relative pl-10 space-y-10">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
            {progressSteps.map((step, i) => (
              <div key={i} className="relative flex items-start gap-6">
                <div
                  className={`absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle size={20} /> : i + 1}
                </div>
                <div className="relative pl-2">
                  <p
                    className={`font-semibold ${step.completed ? "text-green-700" : "text-gray-700"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {step.time || step.note || "Pending"}
                  </p>
                  {step.note && (
                    <p className="text-sm font-medium text-amber-700 mt-1">
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Proof */}
        {(booking.before_media?.length > 0 || booking.after_media?.length > 0) && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Work Proof</h3>

            {booking.before_media?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Before</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.before_media.map((media) =>
                    media.media_type === "photo" ? (
                      <img
                        key={media.id}
                        src={media.file}
                        alt="Before"
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    ) : (
                      <audio key={media.id} controls className="w-full">
                        <source src={media.file} />
                      </audio>
                    ),
                  )}
                </div>
              </div>
            )}

            {booking.after_media?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">After</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {booking.after_media.map((media) =>
                    media.media_type === "photo" ? (
                      <img
                        key={media.id}
                        src={media.file}
                        alt="After"
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    ) : (
                      <audio key={media.id} controls className="w-full">
                        <source src={media.file} />
                      </audio>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Your Taaskr */}
        {isAssigned ? (
          <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Your Taaskr
            </h3>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center overflow-hidden">
                {taaskrProfileImage ? (
                  <img
                    src={taaskrProfileImage}
                    alt={taaskrName || "Taaskr"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-9 h-9 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {taaskrName || "Assigned Taaskr"}
                </p>
                <p className="text-gray-600">
                  Expert in {booking.service_name}
                </p>
                {taaskrPhone && (
                  <p className="text-sm text-gray-500 mt-1">
                    +91 {taaskrPhone}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  disabled={!taaskrPhone}
                  onClick={() => {
                    if (taaskrPhone) {
                      window.location.href = `tel:${taaskrPhone}`;
                    }
                  }}
                  className={`p-3 rounded-full transition-all ${
                    taaskrPhone
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-100 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Phone className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-2xl shadow border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Taaskr Pending
            </h3>
            <p className="text-gray-600">
              A taaskr has not been assigned yet. You will see details here
              once someone is assigned to your booking.
            </p>
          </div>
        )}

        {/* Pay Remaining Amount (if needed) */}
        {booking.status === "completed" && !booking.remaining_paid && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              Pay Remaining Amount
            </h3>
            <p className="text-lg mb-4">
              ₹
              {parseFloat(booking.remaining_amount || 0).toLocaleString(
                "en-IN",
              )}
            </p>
            <button
              onClick={() =>
                router.push(`/user/payment?bookingId=${id}&remaining=true`)
              }
              className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700"
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Completion OTP (after remaining payment) */}
        {booking.completion_otp && (
          <div className="bg-white rounded-2xl shadow border p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Completion OTP</h3>
            <p className="text-3xl font-mono tracking-widest text-center mb-4">
              {booking.completion_otp}
            </p>
            <p className="text-sm text-gray-600 text-center">
              Share this OTP with your Taaskr after verifying the work
            </p>
          </div>
        )}

        {/* Warranty Info */}
        {booking.warranty_start_date && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800">
              Warranty Started
            </h3>
            <p className="text-gray-700 mt-2">
              From{" "}
              {new Date(booking.warranty_start_date).toLocaleDateString(
                "en-IN",
              )}
              <br />
              Valid for 30 days
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <button className="py-4 bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-amber-700">
            <MessageCircle /> Contact Support
          </button>
          <button
            onClick={() => router.push("/user/dashboard")}
            className="py-4 border-2 border-gray-300 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100"
          >
            <Home /> Dashboard
          </button>
          <button
            disabled={
              booking.status === "completed" || booking.status === "cancelled"
            }
            onClick={() => setShowCancelModal(true)}
            className={`py-4 rounded-xl font-bold flex items-center justify-center gap-3 ${
              booking.status === "completed" || booking.status === "cancelled"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <AlertCircle /> Cancel Booking
          </button>
        </div>
      </main>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Cancel Booking?
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                This will cancel your booking. You can always book again later.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                {cancelLoading ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

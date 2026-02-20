// app/(taaskr)/jobs/[id]/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { StatusBadge } from "@/components/taaskr/StatusBadge";
import { useToast } from "@/components/taaskr/ToastProvider";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  User,
  Phone,
  MessageSquare,
  Camera,
  CheckCircle,
  Play,
  Upload,
  Image as ImageIcon,
  Mic,
  X,
  AlertCircle,
} from "lucide-react";

// Mock job data (same as your original)
const jobData = {
  id: "1",
  serviceName: "Home Deep Cleaning",
  customerName: "Priya Sharma",
  customerPhone: "+91 98765 43210",
  location: "123, 4th Cross, Koramangala 5th Block, Bangalore - 560034",
  distance: "3.2 km",
  dateTime: "Today, 2:00 PM",
  duration: "2-3 hours",
  earnings: 850,
  status: "accepted",
  instructions:
    "Please bring your own cleaning supplies. Focus on kitchen and bathrooms. There are 2 pets in the house.",
  serviceDetails: [
    "Deep cleaning of 2BHK apartment",
    "Kitchen deep cleaning with chimney",
    "Bathroom sanitization (2 bathrooms)",
    "Floor mopping and vacuum",
  ],
  attachments: [
    { type: "image", url: "/placeholder.svg", label: "Kitchen area" },
    { type: "image", url: "/placeholder.svg", label: "Bathroom 1" },
  ],
  priceBreakdown: {
    serviceCharge: 1000,
    discount: -100,
    platformFee: -50,
    total: 850,
  },
};

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id;
  const { addToast } = useToast();

  const [jobStatus, setJobStatus] = useState(jobData.status);
  const [showStartOTP, setShowStartOTP] = useState(false);
  const [showCompleteOTP, setShowCompleteOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);

  const handleStartJob = () => {
    setShowStartOTP(true);
  };

  const handleVerifyStartOTP = () => {
    if (otp.length === 4) {
      setJobStatus("in-progress");
      setShowStartOTP(false);
      setOtp("");
      addToast("Job started successfully!", { type: "success" });
    } else {
      addToast("Please enter a 4-digit OTP", { type: "error" });
    }
  };

  const handleCompleteJob = () => {
    setShowCompleteOTP(true);
  };

  const handleVerifyCompleteOTP = () => {
    if (otp.length === 4) {
      setJobStatus("completed");
      setShowCompleteOTP(false);
      setOtp("");
      addToast("Job completed! Payment will be processed.", {
        type: "success",
      });
    } else {
      addToast("Please enter a 4-digit OTP", { type: "error" });
    }
  };

  const addPhoto = (type) => {
    // Mock adding photo (in real app, use file input + upload)
    const newPhoto = "/placeholder.svg";
    if (type === "before") {
      setBeforePhotos([...beforePhotos, newPhoto]);
    } else {
      setAfterPhotos([...afterPhotos, newPhoto]);
    }
  };

  const removePhoto = (type, index) => {
    if (type === "before") {
      setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-32">
      <main className="container py-6 px-4 space-y-6">
        {/* Status & Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display">
              {jobData.serviceName}
            </h2>
            <p className="text-[var(--color-text-light)] text-sm mt-1">
              Job #{jobId}
            </p>
          </div>
          <StatusBadge status={jobStatus} showIcon={true} />
        </div>

        {/* Customer Info */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
          <h3 className="font-semibold text-lg mb-4">Customer</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <User className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-base">{jobData.customerName}</p>
              <p className="text-sm text-[var(--color-text-light)] mt-0.5">
                {jobData.customerPhone}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Phone className="w-5 h-5 text-[var(--color-text)]" />
              </button>
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <MessageSquare className="w-5 h-5 text-[var(--color-text)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Location with Map Placeholder */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-md)]">
          {/* Map Placeholder */}
          <div className="h-48 bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-[var(--color-primary)] mx-auto mb-3" />
                <p className="text-base text-[var(--color-text-light)]">
                  Map Preview
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-d)] transition-colors shadow-md">
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-1" />
              <p className="text-[var(--color-text)]">{jobData.location}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm text-[var(--color-text-light)]">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                <span>{jobData.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{jobData.dateTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{jobData.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
          <h3 className="font-semibold text-lg mb-4">Service Details</h3>
          <ul className="space-y-3">
            {jobData.serviceDetails.map((detail, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-[var(--color-text)]"
              >
                <CheckCircle className="w-5 h-5 text-[var(--color-success)] mt-0.5 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Special Instructions */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
          <h3 className="font-semibold text-lg mb-4">Special Instructions</h3>
          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
              <p className="text-[var(--color-text)]">{jobData.instructions}</p>
            </div>
          </div>
        </div>

        {/* Attachments from Customer */}
        {jobData.attachments.length > 0 && (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
            <h3 className="font-semibold text-lg mb-4">
              Attachments from Customer
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {jobData.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-[var(--color-border)] group"
                >
                  <img
                    src={attachment.url}
                    alt={attachment.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white truncate">
                      {attachment.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Breakdown */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
          <h3 className="font-semibold text-lg mb-4">Earnings Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-[var(--color-text)]">
              <span className="text-[var(--color-text-light)]">
                Service Charge
              </span>
              <span>₹{jobData.priceBreakdown.serviceCharge}</span>
            </div>
            <div className="flex justify-between text-[var(--color-text)]">
              <span className="text-[var(--color-text-light)]">Discount</span>
              <span className="text-[var(--color-danger)]">
                ₹{Math.abs(jobData.priceBreakdown.discount)}
              </span>
            </div>
            <div className="flex justify-between text-[var(--color-text)]">
              <span className="text-[var(--color-text-light)]">
                Platform Fee
              </span>
              <span className="text-[var(--color-danger)]">
                ₹{Math.abs(jobData.priceBreakdown.platformFee)}
              </span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-4 mt-2">
              <div className="flex justify-between font-semibold text-xl">
                <span className="text-[var(--color-text)]">Your Earnings</span>
                <span className="text-[var(--color-success)] flex items-center gap-1.5">
                  <IndianRupee className="w-5 h-5" />
                  {jobData.priceBreakdown.total}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-light)] mt-1">
                Payment will be credited within 24 hours after completion
              </p>
            </div>
          </div>
        </div>

        {/* Work Proof Upload (for in-progress jobs) */}
        {jobStatus === "in-progress" && (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
            <h3 className="font-semibold text-lg mb-4">Upload Work Proof</h3>

            {/* Before Photos */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Before Photos</p>
              <div className="flex flex-wrap gap-3">
                {beforePhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                  >
                    <img
                      src={photo}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto("before", index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-[var(--color-danger)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPhoto("before")}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-6 h-6 text-[var(--color-text-light)]" />
                  <span className="text-xs text-[var(--color-text-light)]">
                    Add
                  </span>
                </button>
              </div>
            </div>

            {/* After Photos */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">After Photos</p>
              <div className="flex flex-wrap gap-3">
                {afterPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                  >
                    <img
                      src={photo}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto("after", index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-[var(--color-danger)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPhoto("after")}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-6 h-6 text-[var(--color-text-light)]" />
                  <span className="text-xs text-[var(--color-text-light)]">
                    Add
                  </span>
                </button>
              </div>
            </div>

            {/* Audio Note (optional) */}
            <div>
              <p className="text-sm font-medium mb-3">Audio Note (Optional)</p>
              <button className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center gap-3 transition-colors">
                <Mic className="w-6 h-6 text-[var(--color-text-light)]" />
                <span className="text-sm font-medium text-[var(--color-text-light)]">
                  Record audio note
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Cancelled Job Message */}
        {jobStatus === "cancelled" && (
          <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl p-5">
            <h3 className="font-semibold text-[var(--color-danger)] mb-3">
              Job Cancelled
            </h3>
            <p className="text-sm text-[var(--color-text)]">
              This job was cancelled by the customer. The cancellation fee of
              ₹50 will be credited to your wallet.
            </p>
          </div>
        )}
      </main>

      {/* Fixed Action Footer */}
      <footer className="fixed bottom-16 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] py-4 px-4 z-40 shadow-[var(--shadow-md)]">
        <div className="container">
          {jobStatus === "accepted" && (
            <button
              onClick={handleStartJob}
              className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-medium flex items-center justify-center gap-3 hover:bg-[var(--color-primary-d)] transition-colors shadow-md active:scale-95"
            >
              <Play className="w-5 h-5" />
              Start Job
            </button>
          )}

          {jobStatus === "in-progress" && (
            <button
              onClick={handleCompleteJob}
              disabled={beforePhotos.length === 0 || afterPhotos.length === 0}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95 ${
                beforePhotos.length === 0 || afterPhotos.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Complete Job
            </button>
          )}

          {jobStatus === "completed" && (
            <div className="text-center py-3">
              <div className="flex items-center justify-center gap-3 text-[var(--color-success)]">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">Job Completed!</span>
              </div>
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                Payment of ₹{jobData.priceBreakdown.total} will be credited
                within 24 hours
              </p>
            </div>
          )}

          {jobStatus === "cancelled" && (
            <Link href="/jobs">
              <button className="w-full py-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-gray-50 transition-colors">
                Back to Jobs
              </button>
            </Link>
          )}
        </div>
      </footer>

      {/* Start Job OTP Dialog */}
      {showStartOTP && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Enter Customer OTP</h3>
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                Ask the customer for the 4-digit OTP to start the job
              </p>
            </div>

            <div className="flex justify-center gap-4 py-4">
              {[...Array(4)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const newOtp = otp.split("");
                    newOtp[i] = e.target.value;
                    setOtp(newOtp.join(""));
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyStartOTP}
              disabled={otp.length !== 4}
              className={`w-full py-4 rounded-xl font-medium transition-colors ${
                otp.length === 4
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-d)]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify & Start Job
            </button>
          </div>
        </div>
      )}

      {/* Complete Job OTP Dialog */}
      {showCompleteOTP && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Complete Job</h3>
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                Enter the completion OTP from customer to finalize the job
              </p>
            </div>

            <div className="flex justify-center gap-4 py-4">
              {[...Array(4)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const newOtp = otp.split("");
                    newOtp[i] = e.target.value;
                    setOtp(newOtp.join(""));
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerifyCompleteOTP}
                disabled={otp.length !== 4}
                className={`w-full py-4 rounded-xl font-medium transition-colors ${
                  otp.length === 4
                    ? "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Complete & Get Paid
              </button>

              <p className="text-xs text-center text-[var(--color-text-light)]">
                ₹{jobData.priceBreakdown.total} will be credited to your wallet
              </p>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

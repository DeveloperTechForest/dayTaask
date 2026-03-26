// app/(taaskr)/jobs/[id]/page.jsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/taaskr/StatusBadge";
import { useToast } from "@/components/taaskr/ToastProvider";
import { apiFetch } from "@/utils/api";
import {
  MapPin,
  Clock,
  Navigation,
  User,
  Phone,
  MessageSquare,
  Camera,
  CheckCircle,
  Play,
  Mic,
  X,
  AlertCircle,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id;
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState("incoming");
  const [showStartOTP, setShowStartOTP] = useState(false);
  const [showCompleteOTP, setShowCompleteOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [beforeMedia, setBeforeMedia] = useState([]);
  const [afterMedia, setAfterMedia] = useState([]);
  const [uploading, setUploading] = useState({
    beforePhoto: false,
    beforeAudio: false,
    afterPhoto: false,
    afterAudio: false,
  });
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeForm, setChangeForm] = useState({
    name: "",
    description: "",
    base_price: "",
    price_unit: "fixed",
    whats_included: "",
    duration_minutes: "60",
    warranty_days: "0",
  });

  const beforePhotoInputRef = useRef(null);
  const beforeAudioInputRef = useRef(null);
  const afterPhotoInputRef = useRef(null);
  const afterAudioInputRef = useRef(null);

  const toAbsoluteUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http")) return value;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
  };

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(
          `/api/bookings/taaskr/bookings/${jobId}/detail/`,
        );
        if (data?.error) throw new Error(data.error);
        setJob(data);
        setBeforeMedia(Array.isArray(data.before_media) ? data.before_media : []);
        setAfterMedia(Array.isArray(data.after_media) ? data.after_media : []);

        const bookingStatus = data?.booking_status;
        const assignmentStatus = data?.assignment_status;
        let nextStatus = "incoming";
        if (bookingStatus === "cancelled") nextStatus = "cancelled";
        else if (bookingStatus === "completed") nextStatus = "completed";
        else if (bookingStatus === "started") nextStatus = "in-progress";
        else if (assignmentStatus === "accepted") nextStatus = "accepted";
        else if (assignmentStatus === "requested") nextStatus = "incoming";
        setJobStatus(nextStatus);
      } catch (err) {
        addToast("Failed to load job details", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (jobId) loadJob();
  }, [jobId, addToast]);

  const reloadJob = async () => {
    if (!jobId) return;
    try {
      const data = await apiFetch(
        `/api/bookings/taaskr/bookings/${jobId}/detail/`,
      );
      if (data?.error) throw new Error(data.error);
      setJob(data);
      setBeforeMedia(Array.isArray(data.before_media) ? data.before_media : []);
      setAfterMedia(Array.isArray(data.after_media) ? data.after_media : []);
    } catch {
      addToast("Failed to refresh job details", { type: "error" });
    }
  };

  const serviceDetails = useMemo(() => {
    if (!job) return [];
    if (Array.isArray(job.service_whats_included) && job.service_whats_included.length) {
      return job.service_whats_included;
    }
    if (job.service_description) return [job.service_description];
    return [];
  }, [job]);

  const attachments = useMemo(() => {
    if (!job?.attachments) return [];
    return job.attachments
      .map((a) => ({
        type: "image",
        url: toAbsoluteUrl(a.url),
        label: a.label || "Attachment",
      }))
      .filter((a) => a.url);
  }, [job]);

  const beforePhotos = useMemo(
    () => beforeMedia.filter((m) => m.media_type === "photo"),
    [beforeMedia],
  );
  const beforeAudios = useMemo(
    () => beforeMedia.filter((m) => m.media_type === "audio"),
    [beforeMedia],
  );
  const afterPhotos = useMemo(
    () => afterMedia.filter((m) => m.media_type === "photo"),
    [afterMedia],
  );
  const afterAudios = useMemo(
    () => afterMedia.filter((m) => m.media_type === "audio"),
    [afterMedia],
  );

  const handleUploadMedia = async (stage, mediaType, files) => {
    if (!job?.booking_id || !files || files.length === 0) return;
    const key =
      stage === "before"
        ? mediaType === "photo"
          ? "beforePhoto"
          : "beforeAudio"
        : mediaType === "photo"
          ? "afterPhoto"
          : "afterAudio";

    try {
      setUploading((prev) => ({ ...prev, [key]: true }));
      const formData = new FormData();
      formData.append("stage", stage);
      formData.append("media_type", mediaType);
      Array.from(files).forEach((file) => formData.append("files", file));

      const res = await apiFetch(
        `/api/bookings/taaskr/bookings/${job.booking_id}/media/`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (res?.error) {
        throw new Error(res.detail || "Upload failed");
      }
      addToast("Uploaded successfully", { type: "success" });
      await reloadJob();
    } catch (err) {
      addToast(err?.message || "Upload failed", { type: "error" });
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-[var(--color-text-light)]">
          Loading job...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-[var(--color-text-light)]">
          Job not found
        </div>
      </div>
    );
  }

  const completionRequested = !!job?.completion_requested_at;
  const canStartJob = beforeMedia.length > 0;
  const canRequestCompletion = afterMedia.length > 0;

  const handleStartJob = () => {
    setShowStartOTP(true);
  };

  const handleSendChangeRequest = async () => {
    if (!job?.booking_id) return;
    try {
      setChangeLoading(true);
      await apiFetch("/api/bookings/taaskr/custom-services/", {
        method: "POST",
        body: JSON.stringify({
          booking_id: job.booking_id,
          name: changeForm.name,
          description: changeForm.description,
          base_price: changeForm.base_price,
          price_unit: changeForm.price_unit,
          whats_included: changeForm.whats_included,
          duration_minutes: Number(changeForm.duration_minutes || 60),
          warranty_days: Number(changeForm.warranty_days || 0),
        }),
      });
      addToast("Service change sent to customer", { type: "success" });
      setShowChangeModal(false);
      await reloadJob();
    } catch (err) {
      addToast(err?.detail || "Failed to send change request", {
        type: "error",
      });
    } finally {
      setChangeLoading(false);
    }
  };

  const handleAssignmentAction = async (action) => {
    if (!job?.assignment_log_id) {
      addToast("Unable to update assignment", { type: "error" });
      return;
    }
    try {
      await apiFetch(
        `/api/bookings/taaskr/assignments/${job.assignment_log_id}/action/`,
        {
          method: "PATCH",
          body: JSON.stringify({ action }),
        }
      );

      if (action === "accept") {
        setJobStatus("accepted");
        addToast("Job accepted", { type: "success" });
      } else {
        setJobStatus("rejected");
        addToast("Job rejected", { type: "info" });
      }
    } catch (err) {
      addToast("Action failed", { type: "error" });
    }
  };

  const handleVerifyStartOTP = async () => {
    if (otp.length !== 6) {
      addToast("Please enter a 6-digit OTP", { type: "error" });
      return;
    }
    try {
      const res = await apiFetch(
        `/api/bookings/taaskr/bookings/${job.booking_id}/start/`,
        {
          method: "POST",
          body: JSON.stringify({ otp }),
        },
      );
      if (res?.error) throw new Error(res.detail || "Invalid OTP");
      setJob(res);
      setJobStatus("in-progress");
      setShowStartOTP(false);
      setOtp("");
      addToast("Service started", { type: "success" });
    } catch (err) {
      addToast(err?.message || "Failed to start service", { type: "error" });
    }
  };

  const handleRequestCompletion = async () => {
    try {
      const res = await apiFetch(
        `/api/bookings/taaskr/bookings/${job.booking_id}/completion-request/`,
        { method: "POST" },
      );
      if (res?.error) throw new Error(res.detail || "Request failed");
      addToast("Completion requested", { type: "success" });
      await reloadJob();
    } catch (err) {
      addToast(err?.message || "Failed to request completion", {
        type: "error",
      });
    }
  };

  const handleVerifyCompleteOTP = async () => {
    if (otp.length !== 6) {
      addToast("Please enter a 6-digit OTP", { type: "error" });
      return;
    }
    try {
      const res = await apiFetch(
        `/api/bookings/taaskr/bookings/${job.booking_id}/complete/`,
        {
          method: "POST",
          body: JSON.stringify({ otp }),
        },
      );
      if (res?.error) throw new Error(res.detail || "Invalid OTP");
      setJob(res);
      setJobStatus("completed");
      setShowCompleteOTP(false);
      setOtp("");
      addToast("Job completed", { type: "success" });
    } catch (err) {
      addToast(err?.message || "Failed to complete job", { type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-32">
      <main className="container py-6 px-4 space-y-6">
        {/* Status & Title */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display">
                {job.service_name || "Service"}
              </h2>
              <p className="text-[var(--color-text-light)] text-sm mt-1">
                Job #{jobId} • {job.booking_code || "—"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={jobStatus} showIcon={true} />
              {job.booking_status && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {job.booking_status}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs text-[var(--color-text-light)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {job.scheduled_at
                  ? new Date(job.scheduled_at).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              <span>{job.address?.city || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{job.address?.state || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {job.service_duration_minutes
                  ? `${job.service_duration_minutes} min`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-6">
          {/* Customer + Location */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
              <h3 className="font-semibold text-lg mb-4">Customer</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base">
                    {job.customer_name || "Customer"}
                  </p>
                  <p className="text-sm text-[var(--color-text-light)] mt-0.5">
                    {job.customer_phone || "N/A"}
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

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-md)]">
              <div className="h-40 bg-gray-100 relative">
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
                  <p className="text-[var(--color-text)]">
                    {job.address?.full || "Location not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
              <h3 className="font-semibold text-lg mb-3">Service Change</h3>
              <p className="text-sm text-[var(--color-text-light)]">
                {job.custom_service_status === "sent"
                  ? "Pending customer approval"
                  : job.custom_service_status === "accepted" ||
                      job.custom_service_status === "in_progress"
                    ? "Approved by customer"
                    : "No pending changes"}
              </p>
              {job.custom_service_status !== "sent" && (
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="mt-4 w-full py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-gray-50 transition-colors"
                >
                  Request Service Change
                </button>
              )}
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
              <h3 className="font-semibold text-lg mb-4">Service Details</h3>
              {serviceDetails.length > 0 ? (
                <ul className="space-y-3">
                  {serviceDetails.map((detail, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[var(--color-text)]"
                    >
                      <CheckCircle className="w-5 h-5 text-[var(--color-success)] mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-text-light)]">N/A</p>
              )}
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
              <h3 className="font-semibold text-lg mb-4">Special Instructions</h3>
              <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-warning)] shrink-0 mt-0.5" />
                  <p className="text-[var(--color-text)]">
                    {job.location_notes || "No special instructions"}
                  </p>
                </div>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
                <h3 className="font-semibold text-lg mb-4">
                  Attachments from Customer
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {attachments.map((attachment, index) => (
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
          </div>
        </div>

        {/* Work Proof Upload */}
        {(jobStatus === "accepted" || jobStatus === "in-progress") && (
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-md)]">
            <h3 className="font-semibold text-lg mb-4">Upload Work Proof</h3>

            {/* Before Photos */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Before Photos</p>
              <div className="flex flex-wrap gap-3">
                {beforePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                  >
                    <img
                      src={toAbsoluteUrl(photo.file)}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <button
                  onClick={() => beforePhotoInputRef.current?.click()}
                  disabled={uploading.beforePhoto}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-6 h-6 text-[var(--color-text-light)]" />
                  <span className="text-xs text-[var(--color-text-light)]">
                    {uploading.beforePhoto ? "Uploading..." : "Add"}
                  </span>
                </button>
              </div>
              <input
                ref={beforePhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) =>
                  handleUploadMedia("before", "photo", e.target.files)
                }
              />
            </div>

            {/* Before Audio */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Before Audio</p>
              <div className="space-y-3">
                {beforeAudios.map((audio) => (
                  <audio key={audio.id} controls className="w-full">
                    <source src={toAbsoluteUrl(audio.file)} />
                  </audio>
                ))}
                <button
                  onClick={() => beforeAudioInputRef.current?.click()}
                  disabled={uploading.beforeAudio}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center gap-3 transition-colors"
                >
                  <Mic className="w-5 h-5 text-[var(--color-text-light)]" />
                  <span className="text-sm font-medium text-[var(--color-text-light)]">
                    {uploading.beforeAudio ? "Uploading..." : "Upload audio"}
                  </span>
                </button>
              </div>
              <input
                ref={beforeAudioInputRef}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) =>
                  handleUploadMedia("before", "audio", e.target.files)
                }
              />
            </div>

            {/* After Photos */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">After Photos</p>
              <div className="flex flex-wrap gap-3">
                {afterPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-[var(--color-border)] group"
                  >
                    <img
                      src={toAbsoluteUrl(photo.file)}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <button
                  onClick={() => afterPhotoInputRef.current?.click()}
                  disabled={uploading.afterPhoto}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-6 h-6 text-[var(--color-text-light)]" />
                  <span className="text-xs text-[var(--color-text-light)]">
                    {uploading.afterPhoto ? "Uploading..." : "Add"}
                  </span>
                </button>
              </div>
              <input
                ref={afterPhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) =>
                  handleUploadMedia("after", "photo", e.target.files)
                }
              />
            </div>

            {/* After Audio */}
            <div>
              <p className="text-sm font-medium mb-3">After Audio</p>
              <div className="space-y-3">
                {afterAudios.map((audio) => (
                  <audio key={audio.id} controls className="w-full">
                    <source src={toAbsoluteUrl(audio.file)} />
                  </audio>
                ))}
                <button
                  onClick={() => afterAudioInputRef.current?.click()}
                  disabled={uploading.afterAudio}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center gap-3 transition-colors"
                >
                  <Mic className="w-5 h-5 text-[var(--color-text-light)]" />
                  <span className="text-sm font-medium text-[var(--color-text-light)]">
                    {uploading.afterAudio ? "Uploading..." : "Upload audio"}
                  </span>
                </button>
              </div>
              <input
                ref={afterAudioInputRef}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) =>
                  handleUploadMedia("after", "audio", e.target.files)
                }
              />
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
              This job was cancelled by the customer.
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
              disabled={job.custom_service_status === "sent" || !canStartJob}
              className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-medium flex items-center justify-center gap-3 hover:bg-[var(--color-primary-d)] transition-colors shadow-md active:scale-95"
            >
              <Play className="w-5 h-5" />
              {job.custom_service_status === "sent"
                ? "Waiting for customer approval"
                : !canStartJob
                  ? "Upload before media to start"
                  : "Start Job"}
            </button>
          )}

          {jobStatus === "incoming" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAssignmentAction("reject")}
                className="w-full py-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-gray-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleAssignmentAction("accept")}
                className="w-full py-4 rounded-xl bg-[var(--color-success)] text-white font-medium hover:bg-[var(--color-success)]/90 transition-colors shadow-md"
              >
                Accept
              </button>
            </div>
          )}

          {jobStatus === "in-progress" && !completionRequested && (
            <button
              onClick={handleRequestCompletion}
              disabled={!canRequestCompletion}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95 ${
                !canRequestCompletion
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {canRequestCompletion
                ? "Request Completion"
                : "Upload after media to continue"}
            </button>
          )}

          {jobStatus === "in-progress" && completionRequested && (
            <button
              onClick={() => setShowCompleteOTP(true)}
              className="w-full py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-md active:scale-95 bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
            >
              <CheckCircle className="w-5 h-5" />
              Enter Completion OTP
            </button>
          )}

          {jobStatus === "completed" && (
            <div className="text-center py-3">
              <div className="flex items-center justify-center gap-3 text-[var(--color-success)]">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">Job Completed!</span>
              </div>
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                Job marked as completed.
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
                Ask the customer for the 6-digit OTP to start the job
              </p>
            </div>

            <div className="flex justify-center gap-4 py-4">
              {[...Array(6)].map((_, i) => (
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
              disabled={otp.length !== 6}
              className={`w-full py-4 rounded-xl font-medium transition-colors ${
                otp.length === 6
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
                Enter the 6-digit completion OTP from customer to finalize the job
              </p>
            </div>

            <div className="flex justify-center gap-4 py-4">
              {[...Array(6)].map((_, i) => (
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
                disabled={otp.length !== 6}
                className={`w-full py-4 rounded-xl font-medium transition-colors ${
                  otp.length === 6
                    ? "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Complete & Get Paid
              </button>

              <p className="text-xs text-center text-[var(--color-text-light)]">
                Completion will be verified by admin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Change Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Request Service Change</h3>
              <button onClick={() => setShowChangeModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Service name"
                value={changeForm.name}
                onChange={(e) =>
                  setChangeForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
              />
              <textarea
                rows={3}
                placeholder="Describe the change"
                value={changeForm.description}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="New price"
                  value={changeForm.base_price}
                  onChange={(e) =>
                    setChangeForm((prev) => ({
                      ...prev,
                      base_price: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                />
                <select
                  value={changeForm.price_unit}
                  onChange={(e) =>
                    setChangeForm((prev) => ({
                      ...prev,
                      price_unit: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder="What's included (comma or new line separated)"
                value={changeForm.whats_included}
                onChange={(e) =>
                  setChangeForm((prev) => ({
                    ...prev,
                    whats_included: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={changeForm.duration_minutes}
                  onChange={(e) =>
                    setChangeForm((prev) => ({
                      ...prev,
                      duration_minutes: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                />
                <input
                  type="number"
                  placeholder="Warranty days"
                  value={changeForm.warranty_days}
                  onChange={(e) =>
                    setChangeForm((prev) => ({
                      ...prev,
                      warranty_days: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowChangeModal(false)}
                className="flex-1 py-3 rounded-lg border border-[var(--color-border)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendChangeRequest}
                disabled={changeLoading}
                className="flex-1 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium"
              >
                {changeLoading ? "Sending..." : "Send to Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

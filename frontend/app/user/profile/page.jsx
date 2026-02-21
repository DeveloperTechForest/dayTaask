// app/profile/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
  Camera,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Lock,
  Trash2,
  Edit3,
  Plus,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";

export default function Profile() {
  const { logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    latitude: null,
    longitude: null,
    is_primary: false,
  });
  const [addressLoading, setAddressLoading] = useState(false);

  // Email verification modal
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const emailOtpInputRef = useRef(null);

  // Phone verification modal
  const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const phoneOtpInputRef = useRef(null);

  const fileInputRef = useRef(null);

  // Dynamic base URL from .env
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Helper: make image URL absolute
  const getAvatarUrl = (path) => {
    if (!path) return "https://i.pravatar.cc/150?img=8";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Load data
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        // 1. Profile
        const prof = await apiFetch("/api/users/customer/me/");
        if (prof?.error) throw new Error(prof.error || "Profile load failed");
        setProfile(prof);
        setFormData({
          full_name: prof.full_name || "",
          phone: prof.phone || "",
        });

        // 2. Addresses – handle both plain array and paginated response
        const addrRes = await apiFetch("/api/users/customer/addresses/");
        const addrList = Array.isArray(addrRes)
          ? addrRes
          : Array.isArray(addrRes?.results)
            ? addrRes.results
            : [];
        setAddresses(addrList);
      } catch (err) {
        console.error("Load error:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // Auto-focus OTP inputs
  useEffect(() => {
    if (emailOtpSent && emailOtpInputRef.current) {
      emailOtpInputRef.current.focus();
    }
  }, [emailOtpSent]);

  useEffect(() => {
    if (phoneOtpSent && phoneOtpInputRef.current) {
      phoneOtpInputRef.current.focus();
    }
  }, [phoneOtpSent]);

  // Email resend timer
  useEffect(() => {
    if (emailResendTimer <= 0) return;

    const interval = setInterval(() => {
      setEmailResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [emailResendTimer]);

  // Phone resend timer
  useEffect(() => {
    if (phoneResendTimer <= 0) return;

    const interval = setInterval(() => {
      setPhoneResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [phoneResendTimer]);

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const form = new FormData();
    form.append("profile_image", file);

    try {
      const res = await apiFetch("/api/users/customer/me/avatar/", {
        method: "POST",
        body: form,
      });
      console.log("Avatar upload response:", res);
      if (res?.error) throw new Error(res.error || "Upload failed");

      // Update profile with new image path (will be converted by getAvatarUrl)
      setProfile((prev) => ({
        ...prev,
        profile_image: res.profile_image || prev.profile_image,
      }));
    } catch (err) {
      setError("Failed to upload avatar.");
      console.error(err);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await apiFetch("/api/users/customer/me/", {
        method: "PATCH",
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
        }),
      });

      if (res?.error) throw new Error(res.error || "Update failed");

      setProfile((p) => ({ ...p, ...res }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Send OTP
  const handleSendEmailOtp = async () => {
    setEmailOtpLoading(true);
    setEmailOtpError("");

    try {
      const res = await apiFetch("/api/users/customer/send-email-otp/", {
        method: "POST",
        // no body needed – uses request.user
      });

      // Check status and content properly
      if (!res || res.error || res.detail?.includes("failed")) {
        throw new Error(res?.error || res?.detail || "Failed to send OTP");
      }

      setEmailOtpSent(true);
      setEmailResendTimer(60); // 60 second countdown
    } catch (err) {
      setEmailOtpError(err.message || "Could not send OTP. Try again.");
      console.error("Send email OTP error:", err);
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      setEmailOtpError("Please enter 6-digit code");
      return;
    }

    setEmailOtpLoading(true);
    setEmailOtpError("");

    try {
      const res = await apiFetch("/api/users/customer/verify-email-otp/", {
        method: "POST",
        body: JSON.stringify({ otp: emailOtp }),
      });

      if (res?.error) throw new Error(res.error || "Verification failed");

      // Refresh profile
      const updated = await apiFetch("/api/users/customer/me/");
      setProfile(updated);
      setShowEmailVerifyModal(false);
      setEmailOtp("");
      setEmailOtpSent(false);
      alert("Email verified successfully!");
    } catch (err) {
      setEmailOtpError(err.message || "Invalid or expired OTP.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Phone Verification (symmetric to email)
  // ──────────────────────────────────────────────
  const handleSendPhoneOtp = async () => {
    setPhoneOtpLoading(true);
    setPhoneOtpError("");

    try {
      const res = await apiFetch("/api/users/customer/send-phone-otp/", {
        method: "POST",
      });

      if (!res || res.error) {
        throw new Error(res?.error || res?.detail || "Failed to send OTP");
      }

      setPhoneOtpSent(true);
      setPhoneResendTimer(60);
    } catch (err) {
      setPhoneOtpError(err.message || "Could not send OTP. Try again.");
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneOtpError("Please enter 6-digit code");
      return;
    }

    setPhoneOtpLoading(true);
    setPhoneOtpError("");

    try {
      const res = await apiFetch("/api/users/customer/verify-phone-otp/", {
        method: "POST",
        body: JSON.stringify({ otp: phoneOtp }),
      });

      if (!res || res.error) {
        throw new Error(res?.error || res?.detail || "Verification failed");
      }

      const updated = await apiFetch("/api/users/customer/me/");
      setProfile(updated);
      setShowPhoneVerifyModal(false);
      setPhoneOtp("");
      setPhoneOtpSent(false);
      alert("Phone verified successfully!");
    } catch (err) {
      setPhoneOtpError(err.message || "Invalid or expired OTP.");
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  //  Change Password (unchanged – looks good)
  // ──────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError("");
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await apiFetch("/api/users/customer/me/change-password/", {
        method: "POST",
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }),
      });
      if (res?.error) throw new Error(res.error || "Failed");
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setPasswordError(err.message || "Could not change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  //  Address CRUD (fixed array handling)
  // ──────────────────────────────────────────────
  const openAddressModal = (addr = null) => {
    setEditingAddress(addr);
    setAddressForm(
      addr
        ? {
            ...addr,
            latitude: addr.latitude || null,
            longitude: addr.longitude || null,
          }
        : {
            label: "Home",
            street: "",
            city: "",
            state: "",
            pincode: "",
            latitude: null,
            longitude: null,
            is_primary: false,
          },
    );
    setShowAddressModal(true);
  };

  const saveAddress = async () => {
    setAddressLoading(true);
    try {
      const url = editingAddress
        ? `/api/users/customer/addresses/${editingAddress.id}/`
        : "/api/users/customer/addresses/";
      const method = editingAddress ? "PATCH" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(addressForm),
      });
      if (res?.error) throw new Error(res.error);

      // Refresh
      const fresh = await apiFetch("/api/users/customer/addresses/");
      const addrList = Array.isArray(fresh)
        ? fresh
        : Array.isArray(fresh?.results)
          ? fresh.results
          : [];
      setAddresses(addrList);
      setShowAddressModal(false);
    } catch (err) {
      alert(err.message || "Failed to save address.");
    } finally {
      setAddressLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await apiFetch(`/api/users/customer/addresses/${id}/`, {
        method: "DELETE",
      });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  // ──────────────────────────────────────────────
  //  RENDER
  // ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <AlertCircle className="w-16 h-16 mb-4" />
        <p className="text-xl">{error || "Failed to load profile"}</p>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(profile.profile_image);

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white text-center relative">
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                </div>
              )}

              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                  <img
                    src={avatarUrl}
                    alt={profile.full_name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading || isSaving}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 disabled:opacity-60"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <h2 className="text-xl font-semibold mb-1">
                {profile.full_name || "User"}
              </h2>
              <p className="text-sm opacity-90 mb-4">{profile.email}</p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {profile.email_verified ? (
                  <span className="px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Email Verified
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      Email Not Verified
                    </span>
                    <button
                      onClick={() => setShowEmailVerifyModal(true)}
                      className="px-3 py-1 bg-white text-indigo-600 text-xs font-semibold rounded-lg hover:bg-gray-100"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {profile.phone_verified ? (
                  <span className="px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Phone Verified
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      Phone Not Verified
                    </span>
                    <button
                      onClick={() => setShowPhoneVerifyModal(true)}
                      className="px-3 py-1 bg-white text-indigo-600 text-xs font-semibold rounded-lg hover:bg-gray-100"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-5 h-5 opacity-80" />
                  <div>
                    <p className="opacity-80">Member Since</p>
                    <p className="font-semibold">
                      {profile.member_since || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 opacity-80" />
                  <div>
                    <p className="opacity-80">Saved Addresses</p>
                    <p className="font-semibold">
                      {addresses.length} Locations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Details */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Personal Information</h3>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      disabled={isSaving || avatarUploading}
                      className="px-4 py-2 bg-white text-yellow-600 font-semibold text-sm rounded-lg shadow hover:bg-gray-100 disabled:opacity-60"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            full_name: profile.full_name || "",
                            phone: profile.phone || "",
                          });
                        }}
                        disabled={isSaving}
                        className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-4 py-2 bg-white text-yellow-600 text-sm font-semibold rounded-lg shadow flex items-center gap-2 disabled:opacity-60"
                      >
                        {isSaving && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={
                      isEditing ? formData.full_name : profile.full_name || ""
                    }
                    onChange={(e) =>
                      isEditing &&
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={!isEditing || isSaving}
                    className={`w-full px-4 py-3 text-sm rounded-xl border ${
                      isEditing
                        ? "border-yellow-500 bg-white focus:ring-yellow-500"
                        : "border-border bg-muted/30"
                    } outline-none transition-all`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative flex items-center gap-3">
                    <input
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className="flex-1 px-4 py-3 text-sm rounded-xl border border-border bg-muted/30 pr-24"
                    />

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-bold ${
                        profile.email_verified
                          ? "bg-green-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {profile.email_verified ? "Verified" : "Not Verified"}
                    </span>

                    {!profile.email_verified && (
                      <button
                        onClick={() => setShowEmailVerifyModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={isEditing ? formData.phone : profile.phone || ""}
                    onChange={(e) =>
                      isEditing &&
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing || isSaving}
                    className={`w-full px-4 py-3 text-sm rounded-xl border ${
                      isEditing
                        ? "border-green-500 bg-white focus:ring-green-500"
                        : "border-border bg-muted/30"
                    } outline-none transition-all`}
                  />
                </div>

                <hr className="border-border my-6" />

                <h3 className="text-lg font-bold text-foreground mb-4">
                  Account Actions
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="py-3 px-4 border border-indigo-600 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>

                  <button
                    onClick={logout}
                    className="py-3 px-4 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">
              Saved Addresses
            </h3>
            <button
              onClick={() => openAddressModal()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No addresses saved yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-xl border ${
                    addr.is_primary
                      ? "border-indigo-500 bg-indigo-50/30"
                      : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {addr.label || "Unnamed"}
                        {addr.is_primary && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {addr.street}, {addr.city}, {addr.state} {addr.pincode}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAddressModal(addr)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Secure note */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-foreground">
            Your account is secure
            <br />
            <span className="text-green-600 text-base font-bold">
              We've got your back!
            </span>
          </p>
        </div>
      </main>

      {/* Password Modal – unchanged, looks good */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Change Password</h3>
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {passwordError}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current password"
                value={passwordForm.old_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    old_password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                disabled={passwordLoading}
              />
              <input
                type="password"
                placeholder="New password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                disabled={passwordLoading}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirm_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirm_password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                disabled={passwordLoading}
              />
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordLoading}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                {passwordLoading && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal – added latitude/longitude fields if your backend requires them */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Label (e.g. Home, Office)"
                value={addressForm.label}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, label: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={addressForm.street}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, street: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              {/* Optional – if your backend accepts lat/long */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (optional)"
                  value={addressForm.latitude ?? ""}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      latitude: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (optional)"
                  value={addressForm.longitude ?? ""}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      longitude: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.is_primary}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      is_primary: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-indigo-600"
                />
                <span>Set as primary address</span>
              </label>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveAddress}
                disabled={addressLoading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                {addressLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {editingAddress ? "Update" : "Add"} Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Verify Your Email</h3>
            <p className="text-gray-600 mb-6">
              Code sent to <strong>{profile.email}</strong>
            </p>

            {emailOtpError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {emailOtpError}
              </div>
            )}

            {!emailOtpSent ? (
              <button
                onClick={handleSendEmailOtp}
                disabled={emailOtpLoading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {emailOtpLoading && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                Send OTP
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  ref={emailOtpInputRef}
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={emailOtp}
                  onChange={(e) =>
                    setEmailOtp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-xl tracking-widest focus:outline-none focus:border-indigo-500"
                />

                <div className="flex justify-between text-sm">
                  <button
                    onClick={handleSendEmailOtp}
                    disabled={emailResendTimer > 0 || emailOtpLoading}
                    className={`text-indigo-600 hover:underline ${emailResendTimer > 0 || emailOtpLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {emailResendTimer > 0
                      ? `Resend in ${emailResendTimer}s`
                      : "Resend OTP"}
                  </button>

                  <button
                    onClick={handleVerifyEmailOtp}
                    disabled={emailOtpLoading || emailOtp.length !== 6}
                    className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
                      emailOtp.length === 6 && !emailOtpLoading
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {emailOtpLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Verify
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowEmailVerifyModal(false);
                setEmailOtpSent(false);
                setEmailOtp("");
                setEmailOtpError("");
              }}
              className="mt-6 w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Phone Verification Modal (symmetric) */}
      {showPhoneVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Verify Your Phone</h3>
            <p className="text-gray-600 mb-6">
              Code sent to <strong>{profile.phone}</strong>
            </p>

            {phoneOtpError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {phoneOtpError}
              </div>
            )}

            {!phoneOtpSent ? (
              <button
                onClick={handleSendPhoneOtp}
                disabled={phoneOtpLoading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {phoneOtpLoading && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                Send OTP
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  ref={phoneOtpInputRef}
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={phoneOtp}
                  onChange={(e) =>
                    setPhoneOtp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-xl tracking-widest focus:outline-none focus:border-indigo-500"
                />

                <div className="flex justify-between text-sm">
                  <button
                    onClick={handleSendPhoneOtp}
                    disabled={phoneResendTimer > 0 || phoneOtpLoading}
                    className={`text-indigo-600 hover:underline ${phoneResendTimer > 0 || phoneOtpLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {phoneResendTimer > 0
                      ? `Resend in ${phoneResendTimer}s`
                      : "Resend OTP"}
                  </button>

                  <button
                    onClick={handleVerifyPhoneOtp}
                    disabled={phoneOtpLoading || phoneOtp.length !== 6}
                    className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
                      phoneOtp.length === 6 && !phoneOtpLoading
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {phoneOtpLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Verify
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowPhoneVerifyModal(false);
                setPhoneOtpSent(false);
                setPhoneOtp("");
                setPhoneOtpError("");
              }}
              className="mt-6 w-full py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

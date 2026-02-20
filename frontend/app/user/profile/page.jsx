// app/profile/page.jsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?img=8",
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-foreground mb-6 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white text-center">
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-semibold mb-1">{profileData.name}</h2>
              <p className="text-sm opacity-90 mb-4">{profileData.email}</p>

              <span className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Verified
              </span>

              <div className="mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-5 h-5 opacity-80" />
                  <div>
                    <p className="opacity-80">Member Since</p>
                    <p className="font-semibold">January 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 opacity-80" />
                  <div>
                    <p className="opacity-80">Saved Addresses</p>
                    <p className="font-semibold">3 Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Personal Information</h3>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-white text-yellow-600 font-semibold text-sm rounded-lg shadow hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-white text-yellow-600 text-sm font-semibold rounded-lg shadow"
                      >
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
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 text-sm rounded-xl border ${
                      isEditing
                        ? "border-yellow-500 bg-white"
                        : "border-border bg-muted/30"
                    } outline-none`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-muted/30 pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 text-sm rounded-xl border ${
                      isEditing
                        ? "border-green-500 bg-white"
                        : "border-border bg-muted/30"
                    }`}
                  />
                </div>

                {/* Actions */}
                <hr className="border-border" />

                <h3 className="text-lg font-bold text-foreground">
                  Account Actions
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <button className="py-3 px-4 border border-indigo-600 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition">
                    Change Password
                  </button>

                  <button
                    onClick={logout}
                    className="py-3 px-4 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Note */}
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
    </div>
  );
}

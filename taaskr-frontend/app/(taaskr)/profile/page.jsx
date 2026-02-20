// app/(taaskr)/profile/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { StatusBadge } from "@/components/taaskr/StatusBadge";
import { useToast } from "@/components/taaskr/ToastProvider";
import {
  User,
  Briefcase,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  ChevronRight,
  Camera,
  LogOut,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
} from "lucide-react";

// Mock profile data
const profileData = {
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@email.com",
  address: "Koramangala, Bangalore",
  rating: 4.8,
  jobsCompleted: 127,
  memberSince: "Jan 2024",
};

const selectedServices = [
  "Home Cleaning",
  "AC Service",
  "Plumbing",
  "Electrical Work",
];

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "availability", label: "Availability", icon: Calendar },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "bank", label: "Bank", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function ProfilePage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    addToast("Logged out successfully", { type: "success" });
    // In real app: redirect to login
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <main className="container py-6 px-4 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <User className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md hover:bg-[var(--color-primary-d)] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold font-display">
                {profileData.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-[var(--color-warning)] fill-current" />
                  <span className="font-medium text-lg">
                    {profileData.rating}
                  </span>
                </div>
                <span className="text-[var(--color-text-light)] text-sm">
                  ({profileData.jobsCompleted} jobs)
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                Member since {profileData.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-md)]">
          <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--color-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <Phone className="w-6 h-6 text-[var(--color-text-light)]" />
                    <div>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Phone
                      </p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <Mail className="w-6 h-6 text-[var(--color-text-light)]" />
                    <div>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Email
                      </p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <MapPin className="w-6 h-6 text-[var(--color-text-light)] mt-0.5" />
                    <div>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Address
                      </p>
                      <p className="font-medium">{profileData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Selected Services</h3>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedServices.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Working Schedule</h3>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <span className="font-medium">{day}</span>
                      <span className="text-sm text-[var(--color-text-light)]">
                        9:00 AM - 6:00 PM
                      </span>
                    </div>
                  ))}
                  {["Sat", "Sun"].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <span className="font-medium">{day}</span>
                      <span className="text-sm text-[var(--color-text-light)]">
                        Off
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Uploaded Documents</h3>
                <div className="space-y-3">
                  {[
                    { name: "Aadhaar Card", status: "verified" },
                    { name: "Address Proof", status: "verified" },
                    { name: "Profile Photo", status: "verified" },
                    { name: "Skill Certificate", status: "pending" },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[var(--color-text-light)]" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                          doc.status === "verified"
                            ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                            : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                        }`}
                      >
                        {doc.status === "verified" ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Tab */}
            {activeTab === "bank" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Bank Account</h3>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-text)]">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Account Holder", value: "Rajesh Kumar" },
                    { label: "Account Number", value: "XXXX XXXX 4567" },
                    { label: "Bank", value: "State Bank of India" },
                    { label: "UPI ID", value: "rajesh@upi" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--color-text-light)]">
                        {item.label}
                      </p>
                      <p className="font-medium mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Security Settings</h3>
                <div className="space-y-3">
                  {[
                    "Change Password",
                    "Two-Factor Authentication",
                    "Logout from All Devices",
                  ].map((item) => (
                    <button
                      key={item}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="font-medium">{item}</span>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-light)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl border border-[var(--color-danger)]/30 text-[var(--color-danger)] font-medium flex items-center justify-center gap-3 hover:bg-[var(--color-danger)]/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

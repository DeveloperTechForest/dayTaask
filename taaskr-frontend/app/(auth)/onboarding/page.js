// app/onboarding/page.js    ← place in app/onboarding/page.js for route /onboarding
"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Calendar,
  FileText,
  CreditCard,
  Check,
  Upload,
  Loader2,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Services", icon: Briefcase },
  { id: 3, title: "Availability", icon: Calendar },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "Bank Details", icon: CreditCard },
];

const services = [
  { id: "cleaning", name: "Home Cleaning", category: "Home Services" },
  { id: "plumbing", name: "Plumbing", category: "Home Services" },
  { id: "electrical", name: "Electrical Work", category: "Home Services" },
  { id: "carpentry", name: "Carpentry", category: "Home Services" },
  { id: "painting", name: "Painting", category: "Home Services" },
  { id: "pest", name: "Pest Control", category: "Home Services" },
  { id: "appliance", name: "Appliance Repair", category: "Technical" },
  { id: "ac", name: "AC Service", category: "Technical" },
];

const timeSlots = [
  "06:00 AM - 09:00 AM",
  "09:00 AM - 12:00 PM",
  "12:00 PM - 03:00 PM",
  "03:00 PM - 06:00 PM",
  "06:00 PM - 09:00 PM",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function OnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDays, setSelectedDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [selectedSlots, setSelectedSlots] = useState([
    "09:00 AM - 12:00 PM",
    "03:00 PM - 06:00 PM",
  ]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        router.push("/pending");
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex items-center justify-between h-14 px-4 md:px-6">
          <Logo size="sm" />
          <span className="text-sm text-[var(--color-text-light)]">
            Step {currentStep} of 5
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 overflow-x-auto">
        <div className="container">
          <div className="flex items-center justify-between min-w-[520px] px-2">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step */}
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-[var(--color-success)] text-white"
                      : isActive
                        ? "bg-[var(--color-primary)] text-white scale-110"
                        : "bg-gray-200 text-gray-500"
                  }
                `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>

                    <span
                      className={`mt-2 text-xs font-medium text-center transition-colors
                  ${
                    isCompleted || isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-text-light)]"
                  }
                `}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-3">
                      <div className="h-0.5 w-full bg-gray-200 rounded overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300
                      ${
                        isCompleted
                          ? "w-10 bg-[var(--color-success)]"
                          : "w-0 bg-[var(--color-primary)]"
                      }
                    `}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Personal Information
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Tell us about yourself
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-6 shadow-[var(--shadow-md)]">
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-[var(--color-border)]">
                    <Camera className="w-8 h-8 text-[var(--color-text-light)]" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                </div>

                <div className="grid gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        placeholder="Enter first name"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        placeholder="Enter last name"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dob" className="block text-sm font-medium">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      placeholder="Enter your address"
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        placeholder="Enter city"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium"
                      >
                        Pincode
                      </label>
                      <input
                        id="pincode"
                        placeholder="Enter pincode"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Select Services
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Choose the services you can provide
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedServices.includes(service.id)
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedServices.includes(service.id)
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedServices.includes(service.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-[var(--color-text-light)]">
                          {service.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-[var(--color-primary)]/5 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-[var(--color-primary)]">
                    {selectedServices.length} service
                    {sselectedServices.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Availability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Set Availability
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Choose when you're available to work
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-6 shadow-[var(--shadow-md)]">
                {/* Working Days */}
                <div>
                  <h3 className="font-semibold mb-3">Working Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedDays.includes(day)
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-gray-100 text-[var(--color-text-light)] hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="font-semibold mb-3">Time Slots</h3>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                          selectedSlots.includes(slot)
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedSlots.includes(slot)
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedSlots.includes(slot) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Upload Documents
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Verify your identity with required documents
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-4 shadow-[var(--shadow-md)]">
                {[
                  { title: "Government ID (Aadhaar/PAN)", required: true },
                  { title: "Address Proof", required: true },
                  { title: "Profile Photo (Selfie)", required: true },
                  { title: "Skill Certificate", required: false },
                ].map((doc) => (
                  <div
                    key={doc.title}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-[var(--color-text-light)]">
                        {doc.required ? "Required" : "Optional"}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Bank Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display">
                  Bank Details
                </h2>
                <p className="text-[var(--color-text-light)] mt-1">
                  Add your bank account for payouts
                </p>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-5 shadow-[var(--shadow-md)]">
                <div className="space-y-2">
                  <label
                    htmlFor="accountName"
                    className="block text-sm font-medium"
                  >
                    Account Holder Name
                  </label>
                  <input
                    id="accountName"
                    placeholder="Enter account holder name"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium"
                  >
                    Account Number
                  </label>
                  <input
                    id="accountNumber"
                    placeholder="Enter account number"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ifsc" className="block text-sm font-medium">
                    IFSC Code
                  </label>
                  <input
                    id="ifsc"
                    placeholder="Enter IFSC code"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium"
                  >
                    Bank Name
                  </label>
                  <input
                    id="bankName"
                    placeholder="Enter bank name"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="upi" className="block text-sm font-medium">
                    UPI ID (Optional)
                  </label>
                  <input
                    id="upi"
                    placeholder="yourname@upi"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer Navigation */}
      <footer className="sticky bottom-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] py-4 shadow-[var(--shadow-md)]">
        <div className="container">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] transition-colors ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? "bg-[var(--color-primary)]/70 cursor-wait"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)] shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 5 ? (
                <>
                  Submit Application
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

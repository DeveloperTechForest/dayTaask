// app/register/page.js    ← place it in app/register/page.js for route /register
"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import { ArrowLeft, Chrome, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [otp, setOtp] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setStep(2);
      setIsLoading(false);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate verification success
    setTimeout(() => {
      router.push("/onboarding");
    }, 1200);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header / Back */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex items-center h-14 px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + Title */}
          <div className="text-center space-y-3">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-bold font-display">Become a Taaskr</h1>
            <p className="text-[var(--color-text-light)]">
              Create your account and start earning
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 md:p-8 space-y-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-[var(--color-border)] bg-white py-3 px-4 text-[var(--color-text)] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-divider)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-surface)] px-3 text-[var(--color-text-light)]">
                  Or register with phone
                </span>
              </div>
            </div>

            {/* Step 1: Registration Form */}
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 text-sm text-[var(--color-text-light)] bg-gray-100 border border-r-0 border-[var(--color-border)] rounded-l-lg">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 rounded-r-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      required
                    />
                  </div>
                </div>

                {/* Email (optional) */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Email (Optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-medium text-white transition-all ${
                    isLoading
                      ? "bg-[var(--color-primary)]/70 cursor-wait"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)] shadow-md"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Verification */
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-[var(--color-success)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-text-light)]">
                    OTP sent to your phone number
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-medium text-white transition-all ${
                    isLoading
                      ? "bg-[var(--color-primary)]/70 cursor-wait"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)] shadow-md"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
                >
                  Change phone number
                </button>
              </form>
            )}
          </div>

          {/* Already have account */}
          <p className="text-center text-sm text-[var(--color-text-light)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-[var(--color-text-light)] px-4">
            By registering, you agree to our{" "}
            <a href="#" className="text-[var(--color-primary)] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[var(--color-primary)] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

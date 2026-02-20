// app/login/page.js    ← place it in app/login/page.js for route /login

"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import {
  ArrowLeft,
  Mail,
  Phone,
  Chrome,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [method, setMethod] = useState("phone"); // "phone" | "email"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (method === "phone" && !showOTP) {
        setShowOTP(true);
        setIsLoading(false);
      } else {
        // Success → redirect to dashboard
        router.push("/taaskr/dashboard");
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/taaskr/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header / Back bar */}
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
            <h1 className="text-2xl font-bold font-display">Welcome Back</h1>
            <p className="text-[var(--color-text-light)]">
              Sign in to your Taaskr account
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 md:p-8 space-y-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
                  Or continue with
                </span>
              </div>
            </div>

            {/* Phone / Email Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  setMethod("phone");
                  setShowOTP(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  method === "phone"
                    ? "bg-white shadow-sm text-[var(--color-text)]"
                    : "text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setShowOTP(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  method === "email"
                    ? "bg-white shadow-sm text-[var(--color-text)]"
                    : "text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {method === "phone" ? (
                <>
                  {!showOTP ? (
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium"
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
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium"
                      >
                        Enter OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                        required
                      />
                      <p className="text-xs text-center text-[var(--color-text-light)]">
                        OTP sent to your phone number
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-medium text-white transition-all ${
                  isLoading
                    ? "bg-[var(--color-primary)]/70 cursor-wait"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-d)]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {method === "phone" && !showOTP
                      ? "Sending OTP..."
                      : "Signing in..."}
                  </>
                ) : method === "phone" && !showOTP ? (
                  "Send OTP"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[var(--color-text-light)]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Become a Taaskr
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

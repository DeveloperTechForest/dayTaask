"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PhoneOTPVerification() {
  const router = useRouter();

  // CORRECT LINE - this was broken before
  const [step, setStep] = useState("phone");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);

  // Timer countdown
  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, step]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert("Please enter a phone number");
      return;
    }
    setStep("otp");
    setResendTimer(30); // Reset timer
    // TODO: Send OTP API call here
    console.log("Sending OTP to:", phone);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter complete 6-digit OTP");
      return;
    }
    // TODO: Verify OTP API call here
    console.log("Verifying OTP:", enteredOtp);
    router.push("/"); // Redirect to home/dashboard
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
      // Auto-focus previous on backspace
      if (!value && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const handleResendOTP = () => {
    setResendTimer(30);
    // TODO: Resend OTP logic
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "phone" ? "Enter Phone Number" : "Verify OTP"}
          </h1>
          <p className="text-gray-600">
            {step === "phone"
              ? "We'll send you a verification code"
              : `Enter the 6-digit code sent to ${phone || "your phone"}`}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send OTP
              </button>

              <Link href="/auth/login">
                <button
                  type="button"
                  className="w-full text-gray-600 py-3 hover:text-gray-800 transition"
                >
                  ← Back to Login
                </button>
              </Link>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Verify & Continue
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend code in{" "}
                    <span className="font-bold">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-gray-600 py-3 hover:text-gray-800 transition"
              >
                ← Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

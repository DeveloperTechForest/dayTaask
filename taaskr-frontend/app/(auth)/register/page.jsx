// app/(auth)/register/page.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agreeToTerms) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setIsLoading(true);

    const res = await apiFetch("/api/users/taaskr/register/", {
      method: "POST",
      body: JSON.stringify({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        profile: {
          bio: "",
          skill_tags: [],
          certification: [],
        },
      }),
    });

    if (res?.error) {
      setError(res?.detail || res?.message || "Registration failed");
      setIsLoading(false);
      return;
    }

    const loginRes = await apiFetch("/api/users/login/", {
      method: "POST",
      body: JSON.stringify({
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        password: form.password,
      }),
    });

    if (loginRes?.error) {
      setError("Account created, please log in.");
      setIsLoading(false);
      router.push("/login");
      return;
    }

    setIsLoading(false);
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
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

      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <Logo size="lg" className="justify-center mb-4" />
            <h1 className="text-2xl font-bold font-display">Become a Taaskr</h1>
            <p className="text-[var(--color-text-light)]">
              Create your account and start earning
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 md:p-8 space-y-6">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 text-sm text-[var(--color-text-light)] bg-gray-100 border border-r-0 border-[var(--color-border)] rounded-l-lg">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                    className="flex-1 rounded-r-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter a password"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={(e) =>
                    setForm({ ...form, agreeToTerms: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[var(--color-text-light)] leading-tight"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-[var(--color-primary)] font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[var(--color-text-light)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

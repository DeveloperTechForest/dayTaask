// app/(auth)/login/page.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/taaskr/Logo";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, authStage, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ identifier: "", password: "" });

  useEffect(() => {
    if (loading) return;
    if (authStage === "active") router.replace("/dashboard");
    if (authStage === "pending") router.replace("/pending");
    if (authStage === "onboarding") router.replace("/onboarding");
  }, [authStage, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    const value = form.identifier.trim();
    const res = await login({
      email: value.includes("@") ? value : "",
      phone: value && !value.includes("@") ? value : "",
      password: form.password,
    });

    if (!res.ok) {
      setFormError("Invalid email or password");
    }

    setIsLoading(false);
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
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/dt-images/dt_logo-nobg.png"
                alt="DayTaask"
                width={200}
                height={60}
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 hover:scale-105"
                priority
              />
            </Link>
            <h1 className="text-2xl font-bold font-display">Welcome Back</h1>
            <p className="text-[var(--color-text-light)]">
              Sign in to your Taaskr account
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 md:p-8 space-y-6">
            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            {error && !formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium"
                >
                  Email or Phone
                </label>
                <input
                  id="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={(e) =>
                    setForm({ ...form, identifier: e.target.value })
                  }
                  placeholder="you@example.com or +91 98765 43210"
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
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

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

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

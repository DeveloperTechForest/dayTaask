"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { login, authLoading, error, user, loading, isAdminUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!loading && user && isAdminUser(user)) {
      router.replace("/dashboard");
    }
  }, [user, loading, router, isAdminUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const res = await login({ email, password });
    if (res?.ok) {
      router.push("/dashboard");
      return;
    }

    if (res?.error === "NOT_ADMIN") {
      setFormError("Only admin users are allowed here.");
      return;
    }

    setFormError(res?.error?.detail || res?.error || "Invalid credentials");
  };

  // const handleGoogleLogin = async () => {
  //   const BASE = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  //   try {
  //     const r = await fetch(`${BASE}/google/login/`);
  //     const data = await r.json();
  //     if (data?.auth_url) {
  //       window.location.href = data.auth_url;
  //     } else {
  //       alert("Google login URL not available");
  //     }
  //   } catch (e) {
  //     alert("Failed to fetch Google login url");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img
            src="./dt-images/dt_logo-nobg.png"
            alt="Logo"
            className="w-[15rem] h-auto object-contain mx-auto my-4"
          />
          <h1 className="text-xl font-bold ">Admin Sign In</h1>
          <p className="text-sm text-slate-600 mt-1">
            Sign in to access admin panel
          </p>
        </div>

        <div className=" p-8 ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email:
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password:
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Your password"
              />
            </div>

            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            {error && !formError && (
              <div className="text-red-600 text-sm">{String(error)}</div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-slate-900 text-white py-2 rounded-lg font-semibold"
            >
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="px-3 text-sm text-slate-500">OR</div>
            <div className="flex-1 h-px bg-slate-200" />
          </div> */}

          {/* <button
            onClick={handleGoogleLogin}
            className="w-full border rounded-lg py-2 flex items-center justify-center gap-3"
          >
            Continue with Google
          </button> */}

          {/* <p className="text-center text-sm text-slate-600 mt-6">
            Back to{" "}
            <Link href="/" className="text-slate-900">
              Home
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}

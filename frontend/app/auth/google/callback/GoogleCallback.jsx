// auth/google/callback/GoogleCallback.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function GoogleCallback() {
  const params = useSearchParams();
  const router = useRouter();

  const { loginWithGoogle, authLoading } = useAuth();

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      alert("Invalid Google response");
      router.push("/auth/login");
      return;
    }

    if (processing) return;
    setProcessing(true);

    // console.log("Processing Google login with code:", code);
    const processGoogleLogin = async () => {
      const result = await loginWithGoogle(code);

      if (result?.ok) {
        router.push("/");
      } else {
        alert(result?.error || "Google login failed");
        router.push("/auth/login");
      }
    };

    processGoogleLogin();
  }, [params, router, processing]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">
        {authLoading ? "Processing..." : "Logging you in..."}
      </p>
    </div>
  );
}

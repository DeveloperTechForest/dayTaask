"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Use AuthContext logout (clears cookies + state)
    logout({ redirect: false, silent: true });

    // Redirect to admin login
    router.replace("/login");
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Logging out...
    </div>
  );
}

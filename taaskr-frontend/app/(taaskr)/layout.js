"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { useAuth } from "@/app/context/AuthContext";

export default function TaaskrLayout({ children }) {
  const router = useRouter();
  const { authStage, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (authStage === "unauth") {
      router.replace("/login");
      return;
    }

    if (authStage === "register") {
      router.replace("/register");
      return;
    }

    if (authStage === "onboarding") {
      router.replace("/onboarding");
      return;
    }

    if (authStage === "pending") {
      router.replace("/pending");
      return;
    }
  }, [authStage, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-[var(--color-text-light)]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Header />
      <main className="flex-1 pb-20 ">{children}</main>
      <BottomNav />
    </div>
  );
}

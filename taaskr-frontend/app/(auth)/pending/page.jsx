// app/(auth)/pending/page.jsx
"use client";

import Link from "next/link";
import { Logo } from "@/components/taaskr/Logo";
import {
  Clock,
  CheckCircle,
  FileText,
  User,
  Briefcase,
  CreditCard,
  ChevronRight,
  Edit,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function PendingPage() {
  const router = useRouter();
  const { loading, authStage, profile, addresses, serviceAreas, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (authStage === "unauth") {
      router.replace("/login");
      return;
    }
    if (authStage === "onboarding") {
      router.replace("/onboarding");
      return;
    }
    if (authStage === "active") {
      router.replace("/dashboard");
    }
  }, [authStage, loading, router]);

  const hasDocs = Boolean(
    profile?.government_id_image &&
      profile?.address_proof_image &&
      profile?.profile_photo_image,
  );
  const hasBank = Boolean(
    profile?.bank_account_holder_name &&
      profile?.bank_account_number &&
      profile?.bank_ifsc_code &&
      profile?.bank_name,
  );
  const hasServices =
    Array.isArray(profile?.skill_tags) && profile?.skill_tags.length > 0;
  const hasAreas = Array.isArray(serviceAreas) && serviceAreas.length > 0;
  const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
  const adminVerified =
    profile?.verification_status === "approved" || profile?.verified === true;
  const adminDeclined = profile?.verification_status === "declined";
  const verificationNote = profile?.verification_note || "";

  const verificationSteps = [
    {
      id: "personal",
      title: "Personal Information",
      icon: User,
      status:
        profile?.bio && profile?.dob && hasAddresses ? "approved" : "pending",
      description: profile?.bio ? "Personal details submitted" : "Pending details",
    },
    {
      id: "services",
      title: "Services Selected",
      icon: Briefcase,
      status: hasServices ? "approved" : "pending",
      description: hasServices
        ? `${profile.skill_tags.length} services selected`
        : "Select your services",
    },
    {
      id: "areas",
      title: "Service Areas",
      icon: MapPin,
      status: hasAreas ? "approved" : "pending",
      description: hasAreas
        ? `${serviceAreas.length} areas selected`
        : "Select service areas",
    },
    {
      id: "documents",
      title: "Documents",
      icon: FileText,
      status:
        hasDocs && profile?.documents_verified ? "approved" : "pending",
      description:
        hasDocs && profile?.documents_verified
          ? "Documents verified"
          : hasDocs
            ? "Submitted, pending review"
            : "Upload documents",
    },
    {
      id: "bank",
      title: "Bank Details",
      icon: CreditCard,
      status: hasBank && profile?.bank_verified ? "approved" : "pending",
      description:
        hasBank && profile?.bank_verified
          ? "Bank verified"
          : hasBank
            ? "Submitted, pending review"
            : "Add bank details",
    },
    {
      id: "admin",
      title: "Admin Verification",
      icon: CheckCircle,
      status: adminVerified ? "approved" : adminDeclined ? "declined" : "pending",
      description: adminVerified
        ? "Approved by admin"
        : adminDeclined
          ? "Declined by admin"
          : "Pending admin approval",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex items-center justify-between h-14 px-4 md:px-6">
          <Logo size="sm" />
          <button
            onClick={logout}
            className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 container py-8 px-4">
        <div className="max-w-lg mx-auto space-y-8">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[var(--color-warning)]" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">
              {adminDeclined ? "Verification Declined" : "Verification Pending"}
            </h1>
            <p className="text-[var(--color-text-light)]">
              {adminDeclined
                ? "Your application needs updates before approval."
                : "Your application is being reviewed. We will notify you once you are approved."}
            </p>
            {adminDeclined && verificationNote && (
              <div className="mt-4 text-left bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700">
                  What needs to be fixed
                </p>
                <p className="text-sm text-red-700 mt-1">{verificationNote}</p>
              </div>
            )}
            <div className="mt-6 py-3 px-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">
                Estimated time:{" "}
                <span className="text-[var(--color-primary)]">24-48 hours</span>
              </p>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
            <h2 className="font-semibold mb-4">Verification Progress</h2>
            <div className="space-y-3">
              {verificationSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    step.status === "pending" || step.status === "declined"
                      ? "bg-[var(--color-warning)]/5 border border-[var(--color-warning)]/20"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === "approved"
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : step.status === "declined"
                          ? "bg-red-50 text-red-600"
                          : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                    }`}
                  >
                    {step.status === "approved" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : step.status === "declined" ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-[var(--color-text-light)] truncate">
                      {step.description}
                    </p>
                  </div>

                  {(step.status === "pending" || step.status === "declined") && (
                    <button
                      onClick={() => router.push("/onboarding?edit=1")}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-[var(--color-text-light)]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-[var(--color-text-light)]">
              Need to update something? You can edit your application.
            </p>
            <button
              onClick={() => router.push("/onboarding?edit=1")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow-md hover:bg-[var(--color-primary-d)] transition-colors"
            >
              Edit Application
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <footer className="py-6 border-t border-[var(--color-border)]">
        <div className="container text-center px-4">
          <p className="text-sm text-[var(--color-text-light)]">
            Need help?{" "}
            <Link
              href="/support"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

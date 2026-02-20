// app/pending/page.js    ← place in app/pending/page.js for route /pending
"use client";

import Link from "next/link";
import { Logo } from "@/components/taaskr/Logo";
import {
  Clock,
  CheckCircle,
  FileText,
  User,
  Briefcase,
  Calendar,
  CreditCard,
  ChevronRight,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";

const verificationSteps = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
    status: "approved",
    description: "Your personal details have been verified",
  },
  {
    id: "services",
    title: "Services Selected",
    icon: Briefcase,
    status: "approved",
    description: "3 services selected",
  },
  {
    id: "availability",
    title: "Availability Set",
    icon: Calendar,
    status: "approved",
    description: "Mon-Fri, 9AM-6PM",
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
    status: "pending",
    description: "Under review by admin",
  },
  {
    id: "bank",
    title: "Bank Details",
    icon: CreditCard,
    status: "approved",
    description: "Bank account verified",
  },
];

export default function PendingPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex items-center justify-center h-14 px-4 md:px-6">
          <Logo size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container py-8 px-4">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Status Card */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[var(--color-warning)]" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">
              Verification Pending
            </h1>
            <p className="text-[var(--color-text-light)]">
              Your application is being reviewed. We'll notify you once you're
              approved.
            </p>
            <div className="mt-6 py-3 px-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">
                Estimated time:{" "}
                <span className="text-[var(--color-primary)]">24-48 hours</span>
              </p>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
            <h2 className="font-semibold mb-4">Verification Progress</h2>
            <div className="space-y-3">
              {verificationSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    step.status === "pending"
                      ? "bg-[var(--color-warning)]/5 border border-[var(--color-warning)]/20"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === "approved"
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                    }`}
                  >
                    {step.status === "approved" ? (
                      <CheckCircle className="w-5 h-5" />
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

                  {step.status === "pending" && (
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Edit className="w-4 h-4 text-[var(--color-text-light)]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Demo / Skip Button */}
          <div className="text-center space-y-4">
            <p className="text-sm text-[var(--color-text-light)]">
              For demo purposes, you can skip ahead:
            </p>
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow-md hover:bg-[var(--color-primary-d)] transition-colors"
            >
              Continue to Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Footer */}
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

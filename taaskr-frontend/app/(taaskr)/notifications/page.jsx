// app/(taaskr)/notifications/page.jsx

"use client";

import { useState } from "react";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { useToast } from "@/components/taaskr/ToastProvider";
import {
  Bell,
  Briefcase,
  IndianRupee,
  Star,
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

// Mock notifications data (same as your original)
const notificationsData = [
  {
    id: "1",
    type: "payment",
    title: "Payment Received",
    message: "₹850 has been credited to your wallet for Home Deep Cleaning",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "rating",
    title: "New 5-Star Rating!",
    message: "Priya Sharma rated you 5 stars. Great job!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "job",
    title: "Job Assigned",
    message: "You have a new job for AC Service tomorrow at 10:00 AM",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "alert",
    title: "Low Acceptance Rate",
    message:
      "Your job acceptance rate has dropped below 80%. This may affect your visibility.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "document",
    title: "Document Verified",
    message: "Your Aadhaar card has been verified successfully.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "job",
    title: "Job Cancelled",
    message:
      "The customer cancelled the Plumbing Repair job scheduled for tomorrow.",
    time: "3 days ago",
    read: true,
  },
];

const iconMap = {
  payment: IndianRupee,
  rating: Star,
  job: Briefcase,
  alert: AlertCircle,
  document: FileText,
};

const colorMap = {
  payment: {
    bg: "bg-[var(--color-success)]/10",
    text: "text-[var(--color-success)]",
  },
  rating: {
    bg: "bg-[var(--color-warning)]/10",
    text: "text-[var(--color-warning)]",
  },
  job: {
    bg: "bg-[var(--color-primary)]/10",
    text: "text-[var(--color-primary)]",
  },
  alert: {
    bg: "bg-[var(--color-danger)]/10",
    text: "text-[var(--color-danger)]",
  },
  document: {
    bg: "bg-[var(--color-accent)]/10",
    text: "text-[var(--color-accent)]",
  },
};

export default function NotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState(notificationsData);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", { type: "success" });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <main className="container py-6 px-4 space-y-6">
        {/* Header Actions */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-light)]">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
            <button
              onClick={markAllRead}
              className="text-sm text-[var(--color-primary)] font-medium hover:underline transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              const colors = colorMap[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 flex items-start gap-4 transition-all hover:shadow-[var(--shadow-md)] ${
                    !notification.read
                      ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20"
                      : ""
                  }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`font-medium text-[var(--color-text)] ${
                          !notification.read ? "font-semibold" : ""
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-2"></span>
                      )}
                    </div>

                    <p className="text-sm text-[var(--color-text-light)] mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="text-xs text-[var(--color-text-light)] mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <Bell className="w-10 h-10 text-[var(--color-text-light)]" />
              </div>
              <h3 className="font-semibold text-xl mb-3">No Notifications</h3>
              <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

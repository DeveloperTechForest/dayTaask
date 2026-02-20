// app/(taaskr)/dashboard/page.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Wallet,
  Briefcase,
  Star,
  TrendingUp,
  ChevronRight,
  Bell,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { StatCard } from "@/components/taaskr/StatCard";
import { JobCard } from "@/components/taaskr/JobCard";
import { useToast } from "@/components/taaskr/ToastProvider";

// Mock data
const upcomingJobs = [
  {
    id: "1",
    serviceName: "Home Deep Cleaning",
    customerName: "Priya Sharma",
    location: "Koramangala, Bangalore",
    distance: "3.2 km",
    dateTime: "Today, 2:00 PM",
    earnings: 850,
    status: "accepted",
  },
  {
    id: "2",
    serviceName: "AC Service & Repair",
    customerName: "Rahul Verma",
    location: "Indiranagar, Bangalore",
    distance: "5.1 km",
    dateTime: "Tomorrow, 10:00 AM",
    earnings: 1200,
    status: "accepted",
  },
];

const incomingJob = {
  id: "3",
  serviceName: "Plumbing Repair",
  customerName: "Amit Kumar",
  location: "HSR Layout, Bangalore",
  distance: "2.5 km",
  dateTime: "Today, 4:30 PM",
  earnings: 650,
  status: "incoming",
};

export default function DashboardPage() {
  const { addToast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [showIncoming, setShowIncoming] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const hasMounted = useRef(false);

  // Countdown timer for incoming job
  useEffect(() => {
    if (!showIncoming || !isOnline || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowIncoming(false);
          if (hasMounted.current) {
            addToast("Job request expired!", {
              type: "warning",
              duration: 5000,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showIncoming, isOnline, countdown, addToast]);

  // Mark component as mounted
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const handleAcceptJob = () => {
    setShowIncoming(false);
    setCountdown(60);
    addToast("Job accepted! Added to your schedule.", { type: "success" });
  };

  const handleRejectJob = () => {
    setShowIncoming(false);
    setCountdown(60);
    addToast("Job rejected. Passed to another Taaskr.", { type: "info" });
  };

  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const goingOnline = !prev;
      if (goingOnline) {
        addToast("You're now online! You'll start receiving job requests.", {
          type: "success",
          duration: 5000,
        });
      } else {
        addToast("You're now offline. No new job requests.", {
          type: "warning",
          duration: 5000,
        });
        setShowIncoming(false);
      }
      return goingOnline;
    });
  };

  return (
    <div className="py-6 px-4 md:px-10 space-y-8">
      {/* Welcome + Beautiful Animated Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Hello, Rajesh!
          </h1>
          <p className="text-[var(--color-text-light)] mt-2 text-lg">
            {isOnline
              ? "You're live and ready for new jobs"
              : "Go online to start earning"}
          </p>
        </div>

        {/* Animated Toggle Button – same style, different color when online */}
        <button
          onClick={handleToggleOnline}
          className="button relative group"
          style={{
            "--active": "1",
            "--button-bg": isOnline
              ? "var(--color-success)"
              : "var(--color-black-700)",
            "--text-color": "white",
            "--sparkle-color": "white",
          }}
        >
          <div className="dots_border"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="sparkle"
          >
            <path
              className="path"
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="var(--sparkle-color)"
              fill="var(--sparkle-color)"
              d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
            />
            <path
              className="path"
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="var(--sparkle-color)"
              fill="var(--sparkle-color)"
              d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
            />
            <path
              className="path"
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="var(--sparkle-color)"
              fill="var(--sparkle-color)"
              d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
            />
          </svg>
          <span className="text_button font-medium" style={{ color: "white" }}>
            {isOnline ? "Online" : "Go Online"}
          </span>
        </button>
      </div>

      {/* Incoming Job Request */}
      {showIncoming && isOnline && (
        <div className="animate-slide-in-right transform transition-all duration-500 hover:scale-[1.01]">
          <JobCard
            {...incomingJob}
            countdown={countdown}
            onAccept={handleAcceptJob}
            onReject={handleRejectJob}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Today's Earnings",
            value: "₹2,450",
            subtitle: "3 jobs completed",
            icon: Wallet,
            variant: "primary",
          },
          {
            title: "This Week",
            value: "₹12,800",
            icon: TrendingUp,
            trend: { value: 15, isPositive: true },
          },
          {
            title: "Jobs Done",
            value: "47",
            subtitle: "This month",
            icon: Briefcase,
          },
          {
            title: "Rating",
            value: "4.8",
            subtitle: "Based on 42 reviews",
            icon: Star,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="transform transition-all duration-300 hover:scale-105"
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Today's Performance */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
        <h3 className="font-semibold text-xl mb-5 flex items-center gap-3">
          <Target className="w-6 h-6 text-[var(--color-primary)]" />
          Today's Performance
        </h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-[var(--color-success)] mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-sm text-[var(--color-text-light)]">Completed</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-[var(--color-primary)] mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">2</span>
            </div>
            <p className="text-sm text-[var(--color-text-light)]">Upcoming</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-[var(--color-warning)] mb-2">
              <Target className="w-5 h-5" />
              <span className="text-2xl font-bold">92%</span>
            </div>
            <p className="text-sm text-[var(--color-text-light)]">Acceptance</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-5">
        <Link href="/wallet">
          <button className="group w-full h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95">
            <Wallet className="w-8 h-8 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
            <span className="text-base font-medium">Wallet</span>
          </button>
        </Link>

        <Link href="/jobs">
          <button className="group w-full h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95">
            <Briefcase className="w-8 h-8 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
            <span className="text-base font-medium">Jobs</span>
          </button>
        </Link>
      </div>

      {/* Upcoming Jobs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold font-display">Upcoming Jobs</h2>
          <Link
            href="/jobs"
            className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1.5 hover:underline transition-all"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-5">
          {upcomingJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <JobCard {...job} />
            </Link>
          ))}
        </div>
      </div>

      {/* Notifications Preview */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[var(--shadow-md)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-semibold text-lg">Recent Notifications</h3>
          </div>
          <Link
            href="/notifications"
            className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50/80 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Payment Received</p>
              <p className="text-xs text-[var(--color-text-light)] mt-1">
                ₹850 credited to your wallet • 2h ago
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50/80 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">New Rating</p>
              <p className="text-xs text-[var(--color-text-light)] mt-1">
                Priya rated you 5 stars! • 4h ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

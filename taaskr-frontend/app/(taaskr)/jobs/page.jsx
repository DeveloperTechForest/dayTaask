// app/(taaskr)/jobs/page.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/taaskr/Header";
import { BottomNav } from "@/components/taaskr/BottomNav";
import { JobCard } from "@/components/taaskr/JobCard";
import { useToast } from "@/components/taaskr/ToastProvider";

// Mock data (same as your original)
const initialJobs = [
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
  {
    id: "3",
    serviceName: "Plumbing Repair",
    customerName: "Amit Kumar",
    location: "HSR Layout, Bangalore",
    distance: "2.5 km",
    dateTime: "Yesterday",
    earnings: 650,
    status: "completed",
  },
  {
    id: "4",
    serviceName: "Electrical Wiring",
    customerName: "Sneha Patel",
    location: "Whitefield, Bangalore",
    distance: "8.3 km",
    dateTime: "2 days ago",
    earnings: 1500,
    status: "completed",
  },
  {
    id: "5",
    serviceName: "Painting Work",
    customerName: "Vikram Singh",
    location: "JP Nagar, Bangalore",
    distance: "4.7 km",
    dateTime: "Now",
    earnings: 2200,
    status: "in-progress",
  },
];

const incomingJobData = {
  id: "6",
  serviceName: "Furniture Assembly",
  customerName: "Meera Reddy",
  location: "Electronic City, Bangalore",
  distance: "6.2 km",
  dateTime: "Today, 5:00 PM",
  earnings: 950,
  status: "incoming",
};

const tabs = ["Incoming", "Accepted", "In Progress", "Completed"];

export default function JobsPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("Incoming");
  const [jobs, setJobs] = useState(initialJobs);
  const [incomingJob, setIncomingJob] = useState(incomingJobData);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for incoming job
  useEffect(() => {
    if (!incomingJob || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIncomingJob(null);
          addToast("Job request expired!", { type: "warning", duration: 5000 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingJob, countdown, addToast]);

  const handleAcceptJob = () => {
    if (incomingJob) {
      setJobs([...jobs, { ...incomingJob, status: "accepted" }]);
      setIncomingJob(null);
      setCountdown(60);
      addToast("Job accepted!", {
        type: "success",
        description: "The job has been added to your accepted jobs",
      });
    }
  };

  const handleRejectJob = () => {
    setIncomingJob(null);
    setCountdown(60);
    addToast("Job rejected", {
      type: "info",
      description: "The job has been passed to another Taaskr",
    });
  };

  // Filter jobs based on active tab
  const filteredJobs = jobs.filter((job) => {
    switch (activeTab) {
      case "Incoming":
        return false; // Incoming is handled separately
      case "Accepted":
        return job.status === "accepted";
      case "In Progress":
        return job.status === "in-progress";
      case "Completed":
        return job.status === "completed";
      default:
        return true;
    }
  });

  // Count for each tab
  const getTabCount = (tab) => {
    switch (tab) {
      case "Incoming":
        return incomingJob ? 1 : 0;
      case "Accepted":
        return jobs.filter((j) => j.status === "accepted").length;
      case "In Progress":
        return jobs.filter((j) => j.status === "in-progress").length;
      case "Completed":
        return jobs.filter((j) => j.status === "completed").length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20 ">
      {/* Tabs – sticky below header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-14 z-30">
        <div className="container">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const count = getTabCount(tab);
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                    isActive
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6 md:px-10">
        {/* Incoming Job (shown only on Incoming tab) */}
        {activeTab === "Incoming" && incomingJob && (
          <div className="mb-6 animate-slide-in-right">
            <JobCard
              {...incomingJob}
              countdown={countdown}
              onAccept={handleAcceptJob}
              onReject={handleRejectJob}
            />
          </div>
        )}

        {/* Filtered Jobs */}
        {activeTab !== "Incoming" && filteredJobs.length > 0 ? (
          <div className="space-y-5">
            {filteredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <JobCard {...job} />
              </Link>
            ))}
          </div>
        ) : activeTab === "Incoming" && !incomingJob ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">📥</span>
            </div>
            <h3 className="font-semibold text-xl mb-3">No Incoming Requests</h3>
            <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
              Stay online to receive new job requests from customers
            </p>
          </div>
        ) : activeTab !== "Incoming" && filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="font-semibold text-xl mb-3">No {activeTab} Jobs</h3>
            <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
              You don't have any {activeTab.toLowerCase()} jobs at the moment
            </p>
          </div>
        ) : null}
      </main>

      <BottomNav />
    </div>
  );
}

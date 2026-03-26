// app/(taaskr)/jobs/page.jsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { JobCard } from "@/components/taaskr/JobCard";
import { useToast } from "@/components/taaskr/ToastProvider";
import { apiFetch } from "@/utils/api";

const tabs = ["Incoming", "Accepted", "In Progress", "Completed", "Rejected"];

export default function JobsPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("Incoming");
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [historyAssignments, setHistoryAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.results)) return value.results;
    return [];
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        apiFetch("/api/bookings/taaskr/pending-assignments/"),
        apiFetch("/api/bookings/taaskr/assignments-history/"),
      ]);

      setPendingAssignments(normalizeList(pendingRes));
      setHistoryAssignments(normalizeList(historyRes));
    } catch (err) {
      addToast("Failed to load jobs", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleAssignmentAction = async (assignmentId, action) => {
    try {
      await apiFetch(`/api/bookings/taaskr/assignments/${assignmentId}/action/`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });

      if (action === "accept") {
        addToast("Job accepted", { type: "success" });
      } else {
        addToast("Job rejected", { type: "info" });
      }

      loadAssignments();
    } catch (err) {
      addToast("Action failed", { type: "error" });
    }
  };

  const incomingAssignments = useMemo(() => {
    const byId = new Map();
    const pendingList = Array.isArray(pendingAssignments)
      ? pendingAssignments
      : [];
    const historyList = Array.isArray(historyAssignments)
      ? historyAssignments
      : [];
    pendingList
      .filter((a) => !["cancelled", "completed"].includes(a.booking_status))
      .forEach((a) => byId.set(a.id, a));
    historyList
      .filter(
        (a) =>
          a.status === "requested" &&
          !["cancelled", "completed"].includes(a.booking_status),
      )
      .forEach((a) => byId.set(a.id, a));
    return Array.from(byId.values());
  }, [pendingAssignments, historyAssignments]);

  const incomingJobs = useMemo(() => {
    return incomingAssignments.map((a) => ({
      id: a.id,
      bookingId: a.booking_id,
      serviceName: a.service_name,
      customerName: a.customer_name,
      location: a.location_short,
      distance: "-",
      dateTime: a.scheduled_at,
      taskLabel: `Task: ${a.service_name || "View details"}`,
      status: "incoming",
    }));
  }, [incomingAssignments]);

  const acceptedJobs = useMemo(() => {
    return historyAssignments
      .filter(
        (a) =>
          a.status === "accepted" &&
          ["pending", "confirmed"].includes(a.booking_status),
      )
      .map((a) => ({
        id: a.id,
        bookingId: a.booking_id,
        serviceName: a.service_name,
        customerName: a.customer_name,
        location: a.location_short,
        distance: "-",
        dateTime: a.scheduled_at,
        taskLabel: `Task: ${a.service_name || "View details"}`,
        status: "accepted",
      }));
  }, [historyAssignments]);

  const inProgressJobs = useMemo(() => {
    return historyAssignments
      .filter((a) => a.status === "accepted" && a.booking_status === "started")
      .map((a) => ({
        id: a.id,
        bookingId: a.booking_id,
        serviceName: a.service_name,
        customerName: a.customer_name,
        location: a.location_short,
        distance: "-",
        dateTime: a.scheduled_at,
        taskLabel: `Task: ${a.service_name || "View details"}`,
        status: "in-progress",
      }));
  }, [historyAssignments]);

  const completedJobs = useMemo(() => {
    return historyAssignments
      .filter((a) => a.status === "accepted" && a.booking_status === "completed")
      .map((a) => ({
        id: a.id,
        bookingId: a.booking_id,
        serviceName: a.service_name,
        customerName: a.customer_name,
        location: a.location_short,
        distance: "-",
        dateTime: a.scheduled_at,
        taskLabel: `Task: ${a.service_name || "View details"}`,
        status: "completed",
      }));
  }, [historyAssignments]);

  const rejectedJobs = useMemo(() => {
    return historyAssignments
      .filter((a) => ["rejected", "cancelled", "expired"].includes(a.status))
      .map((a) => ({
        id: a.id,
        bookingId: a.booking_id,
        serviceName: a.service_name,
        customerName: a.customer_name,
        location: a.location_short,
        distance: "-",
        dateTime: a.scheduled_at,
        taskLabel: `Task: ${a.service_name || "View details"}`,
        status: "rejected",
      }));
  }, [historyAssignments]);

  const filteredJobs = () => {
    switch (activeTab) {
      case "Incoming":
        return incomingJobs;
      case "Accepted":
        return acceptedJobs;
      case "In Progress":
        return inProgressJobs;
      case "Completed":
        return completedJobs;
      case "Rejected":
        return rejectedJobs;
      default:
        return [];
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case "Incoming":
        return incomingJobs.length;
      case "Accepted":
        return acceptedJobs.length;
      case "In Progress":
        return inProgressJobs.length;
      case "Completed":
        return completedJobs.length;
      case "Rejected":
        return rejectedJobs.length;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20 ">
      {/* Tabs */}
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
        {loading ? (
          <div className="text-center py-16 text-[var(--color-text-light)]">
            Loading jobs...
          </div>
        ) : (
          <>
            {activeTab === "Incoming" ? (
              incomingJobs.length > 0 ? (
                <div className="space-y-5">
                  {incomingJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      serviceName={job.serviceName}
                      customerName={job.customerName}
                      location={job.location}
                      distance={job.distance}
                      dateTime={new Date(job.dateTime).toLocaleString("en-IN")}
                      taskLabel={job.taskLabel}
                      status="incoming"
                      onAccept={() =>
                        handleAssignmentAction(job.id, "accept")
                      }
                      onReject={() =>
                        handleAssignmentAction(job.id, "reject")
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                    <span className="text-4xl">-</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    No Incoming Requests
                  </h3>
                  <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
                    Stay online to receive new job requests from customers
                  </p>
                </div>
              )
            ) : (
              <>
                {filteredJobs().length > 0 ? (
                  <div className="space-y-5">
                    {filteredJobs().map((job) => (
                      <Link key={job.id} href={`/jobs/${job.bookingId}`}>
                        <JobCard
                          serviceName={job.serviceName}
                          customerName={job.customerName}
                          location={job.location}
                          distance={job.distance}
                          dateTime={new Date(job.dateTime).toLocaleString(
                            "en-IN",
                          )}
                          taskLabel={job.taskLabel}
                          status={job.status}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                      <span className="text-4xl">-</span>
                    </div>
                    <h3 className="font-semibold text-xl mb-3">
                      No {activeTab} Jobs
                    </h3>
                    <p className="text-[var(--color-text-light)] max-w-xs mx-auto">
                      You do not have any {activeTab.toLowerCase()} jobs right now
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  ChevronDown,
  X,
  Loader2,
  CheckCircle2,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";

const getPriorityBadge = (priority) => {
  if (priority === "high")
    return { bg: "bg-red-100 text-red-700", icon: AlertTriangle };
  if (priority === "medium")
    return { bg: "bg-yellow-100 text-yellow-700", icon: AlertTriangle };
  return { bg: "bg-slate-100 text-slate-700", icon: null };
};

const getAssignmentStatusBadge = (status) => {
  const map = {
    unassigned: { bg: "bg-red-100 text-red-700", label: "Unassigned" },
    requested: { bg: "bg-yellow-100 text-yellow-700", label: "Requested" },
    partially_assigned: {
      bg: "bg-orange-100 text-orange-700",
      label: "Partially Assigned",
    },
    assigned: { bg: "bg-emerald-100 text-emerald-700", label: "Assigned" },
  };
  return (
    map[status] || {
      bg: "bg-slate-100 text-slate-700",
      label: status || "Unknown",
    }
  );
};

const getRequestStatusBadge = (status) => {
  const map = {
    requested: { bg: "bg-yellow-100 text-yellow-700", label: "Pending" },
    accepted: { bg: "bg-emerald-100 text-emerald-700", label: "Accepted" },
    rejected: { bg: "bg-red-100 text-red-700", label: "Rejected" },
    cancelled: { bg: "bg-orange-100 text-orange-700", label: "Cancelled" },
    expired: { bg: "bg-gray-100 text-gray-700", label: "Expired" },
  };
  return (
    map[status] || {
      bg: "bg-slate-100 text-slate-700",
      label: status || "Unknown",
    }
  );
};

export default function AssignmentsPage() {
  const [bookings, setBookings] = useState([]);
  const [taaskrs, setTaaskrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);

  // Server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const pageSize = 10;

  // Filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, unassigned, requested, partially_assigned, urgent

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTaaskrIds, setSelectedTaaskrIds] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Requests modal
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [currentRequests, setCurrentRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [selectedBookingForRequests, setSelectedBookingForRequests] =
    useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());

    if (search.trim()) params.set("search", search.trim());

    if (filter !== "all") {
      if (filter === "urgent") {
        params.set("is_urgent", "true");
      } else {
        params.set("assignment_status", filter);
      }
    }

    return params.toString();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const query = buildQuery();
      const bookingsUrl = query
        ? `/api/bookings/admin/needy-assignments/?${query}`
        : "/api/bookings/admin/needy-assignments/";

      const [bookingsRes, taaskrsRes] = await Promise.all([
        apiFetch(bookingsUrl),
        apiFetch("/api/taaskr/admin/taaskrs/"),
      ]);

      setBookings(bookingsRes.results || bookingsRes || []);
      setTotalCount(bookingsRes.count || 0);
      setNextUrl(bookingsRes.next || null);
      setPrevUrl(bookingsRes.previous || null);

      setTaaskrs(
        Array.isArray(taaskrsRes) ? taaskrsRes : taaskrsRes.results || [],
      );
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [search, filter]);

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedTaaskrIds([]);
    setShowAssignModal(true);
  };

  const assignTaaskrs = async () => {
    if (selectedTaaskrIds.length === 0) {
      setMessage({ type: "error", text: "Please select at least one taaskr" });
      return;
    }

    try {
      setAssignLoading(true);
      setMessage({ type: "", text: "" });

      await apiFetch("/api/bookings/admin/assign-taaskr/", {
        method: "POST",
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          taaskr_ids: selectedTaaskrIds,
        }),
      });

      setMessage({
        type: "success",
        text: "Assignment requests sent successfully!",
      });
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to send assignment requests" });
    } finally {
      setAssignLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // View & Cancel Requests
  // ────────────────────────────────────────────────
  const openRequestsModal = async (booking) => {
    setSelectedBookingForRequests(booking);
    setShowRequestsModal(true);
    setRequestsLoading(true);

    try {
      const res = await apiFetch(
        `/api/bookings/admin/assignment-logs/?booking=${booking.id}`,
      );
      setCurrentRequests(res.results || res || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load assignment requests" });
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleCancelRequest = async (logId) => {
    if (!confirm("Cancel this assignment request?")) return;

    try {
      await apiFetch(`/api/bookings/admin/assignment-logs/${logId}/cancel/`, {
        method: "PATCH",
      });

      setCurrentRequests((prev) =>
        prev.map((r) => (r.id === logId ? { ...r, status: "cancelled" } : r)),
      );

      fetchData(); // refresh main list

      setMessage({ type: "success", text: "Request cancelled successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to cancel request" });
    }
  };

  const stats = {
    pending: totalCount,
    highPriority: bookings.filter((b) => b.priority === "high").length,
    inQueue: bookings.filter((b) => b.assignment_status === "requested").length,
    totalNeedy: totalCount,
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePrev = () => {
    if (prevUrl && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (nextUrl) setCurrentPage((p) => p + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assignment Management
          </h1>
          <p className="text-slate-600 mt-1">
            Assign taaskrs to bookings that need attention
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition disabled:opacity-60"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <Link href="/bookings/allBookings">
            <button className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
              All Bookings
            </button>
          </Link>
          <Link href="/bookings/assignments/allAssignments">
            <button className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
              All Assignments
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Assignment</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.pending}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">High Priority</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.highPriority}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">In Request Queue</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.inQueue}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Available Taaskrs</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {taaskrs.length}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by booking code, customer, or service..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200/30 transition"
              />
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="unassigned">Unassigned</option>
                <option value="requested">Requested</option>
                <option value="partially_assigned">Partially Assigned</option>
                <option value="urgent">Urgent Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-slate-50/70 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Booking
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Scheduled
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Needed / Accepted
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Priority
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-16 text-slate-500 text-lg"
                  >
                    No bookings need assignment right now. Great job! 🎉
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const priority = getPriorityBadge(b.priority);
                  const status = getAssignmentStatusBadge(b.assignment_status);

                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-slate-50/70 transition-all duration-150 ${
                        b.is_urgent
                          ? "border-l-4 border-red-500 bg-red-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <p className="font-mono text-orange-600 font-semibold">
                          {b.booking_code}
                        </p>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {b.service_name}
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {b.customer_name}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {b.city || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {new Date(b.scheduled_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="font-bold text-slate-900">
                          {b.accepted_taaskrs || 0} / {b.required_taaskrs}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {priority.icon && (
                            <priority.icon className="w-4 h-4" />
                          )}
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${priority.bg}`}
                          >
                            {b.priority?.charAt(0).toUpperCase() +
                              b.priority?.slice(1) || "Low"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => openAssignModal(b)}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </button>

                        <button
                          onClick={() => openRequestsModal(b)}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                          title="View & manage sent requests"
                        >
                          <Eye className="w-4 h-4" />
                          Requests
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div>
            Showing <strong>{bookings.length}</strong> of{" "}
            <strong>{totalCount}</strong> bookings needing assignment
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={!prevUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-medium min-w-[3rem] text-center">
                {currentPage}
              </span>

              <button
                onClick={handleNext}
                disabled={!nextUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assign Taaskrs Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Assign Taaskrs — {selectedBooking.booking_code}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <strong>Service:</strong> {selectedBooking.service_name}
              </div>
              <div>
                <strong>Customer:</strong> {selectedBooking.customer_name}
              </div>
              <div>
                <strong>Required:</strong> {selectedBooking.required_taaskrs}
              </div>
              <div>
                <strong>Accepted:</strong>{" "}
                {selectedBooking.accepted_taaskrs || 0}
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Taaskrs (Hold Ctrl/Cmd for multiple)
            </label>
            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-xl">
              {taaskrs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No taaskrs available
                </div>
              ) : (
                <div className="grid gap-1">
                  {taaskrs.map((t) => {
                    const acceptanceRate =
                      t.total_jobs > 0
                        ? Math.round((t.accepted_count / t.total_jobs) * 100)
                        : 0;

                    return (
                      <label
                        key={t.id}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <input
                          type="checkbox"
                          value={t.id}
                          checked={selectedTaaskrIds.includes(t.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTaaskrIds([
                                ...selectedTaaskrIds,
                                t.id,
                              ]);
                            } else {
                              setSelectedTaaskrIds(
                                selectedTaaskrIds.filter((id) => id !== t.id),
                              );
                            }
                          }}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">
                              {t.full_name}
                            </span>
                            {t.verified && (
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            )}
                            {t.is_available ? (
                              <span className="text-xs text-emerald-600">
                                Available
                              </span>
                            ) : (
                              <span className="text-xs text-red-600">Busy</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            {t.phone} • Rating: {t.rating_avg.toFixed(1)}{" "}
                            <Star className="w-3 h-3 inline text-yellow-500" />{" "}
                            • Jobs: {t.total_jobs} • Accept: {acceptanceRate}%
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Skills: {t.skill_tags?.join(", ") || "None"}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={assignTaaskrs}
                disabled={assignLoading || selectedTaaskrIds.length === 0}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl font-medium transition flex items-center gap-2"
              >
                {assignLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Assignment Requests"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Management Modal */}
      {showRequestsModal && selectedBookingForRequests && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Assignment Requests — {selectedBookingForRequests.booking_code}
              </h2>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="p-6">
              {requestsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                </div>
              ) : currentRequests.length === 0 ? (
                <p className="text-center py-12 text-slate-500">
                  No assignment requests found for this booking.
                </p>
              ) : (
                <div className="space-y-4">
                  {currentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {req.taaskr_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {req.taaskr_phone} •{" "}
                          {req.method.charAt(0).toUpperCase() +
                            req.method.slice(1)}{" "}
                          • Sent: {new Date(req.created_at).toLocaleString()}
                        </p>
                        {req.expires_at && (
                          <p className="text-xs text-slate-500">
                            Expires: {new Date(req.expires_at).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getRequestStatusBadge(req.status).bg
                          }`}
                        >
                          {getRequestStatusBadge(req.status).label}
                        </span>

                        {req.status === "requested" && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
              <button
                onClick={() => setShowRequestsModal(false)}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

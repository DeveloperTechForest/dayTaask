// app/bookings/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Eye,
  Power,
  Clock,
  Shield,
  IndianRupee,
  ChevronDown,
  Loader2,
  X,
  Trash2,
  User,
  Calendar,
  AlertCircle,
  Save,
  ShieldAlert,
  MapPinned,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  BluetoothConnectedIcon,
  Rainbow,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import CreateBookingModal from "@/components/CreateBookingModal"; // New component
import EditBookingModal from "@/components/EditBookingModal"; // New component
import { formatDateTime, isUrgent } from "@/utils/dateUtils";
import Link from "next/link";

// ──────────────────────────────
// Status Badge Config (matches backend)
// ──────────────────────────────
const getStatusConfig = (status) => {
  const map = {
    completed: { badge: "bg-emerald-100 text-emerald-700", label: "Completed" },
    confirmed: { badge: "bg-blue-100 text-blue-700", label: "Confirmed" },
    pending: { badge: "bg-yellow-100 text-yellow-700", label: "Pending" },
    cancelled: { badge: "bg-red-100 text-red-700", label: "Cancelled" },
  };
  return (
    map[status?.toLowerCase()] || {
      badge: "bg-slate-100 text-slate-700",
      label: status || "Unknown",
    }
  );
};

// ──────────────────────────────
// Mock data for selects (replace with API fetches if needed)
// ──────────────────────────────
// Moved to respective components if needed, or keep shared here if used elsewhere.
// For now, assuming mocks are shared, but since only used in forms, better to move to components.

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dropdownRefs = useRef({});

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId !== null &&
        !Object.values(dropdownRefs.current).some(
          (ref) => ref && ref.contains(event.target),
        )
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  // ──────────────────────────────
  // Fetch Bookings with filters
  // ──────────────────────────────
  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = "/api/bookings/admin/bookings/";
      const params = new URLSearchParams();

      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (statusFilter !== "all") params.append("status", statusFilter);

      if (params.toString()) url += `?${params.toString()}`;

      const data = await apiFetch(url);
      const list = Array.isArray(data) ? data : data.results || [];
      setBookings(list);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Add loading state for details
  const [detailLoading, setDetailLoading] = useState(false);

  // Correct fetch function
  const fetchBookingDetail = async (bookingId) => {
    if (!bookingId) return;

    try {
      setDetailLoading(true);
      const url = `/api/bookings/admin/bookings/${bookingId}/`;
      const data = await apiFetch(url);

      setSelectedBooking(data);
    } catch (err) {
      console.error("Failed to fetch booking detail:", err);
      alert("Failed to load booking details");
      setShowDetails(false);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [searchTerm, statusFilter]);

  // ──────────────────────────────
  // Delete Booking
  // ──────────────────────────────
  const deleteBooking = async () => {
    try {
      setActionLoading(true);

      const res = await apiFetch(
        `/api/bookings/admin/bookings/${deleteConfirm.id}/`,
        {
          method: "DELETE",
        },
      );
      alert(res?.detail || "Booking deleted successfully");
      setShowDeleteConfirm(false);
      fetchBookings();
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert(err?.detail || "Failed to delete booking");
    } finally {
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  // ──────────────────────────────
  // Open details sidebar
  // ──────────────────────────────
  const openDetails = (bookingId) => {
    fetchBookingDetail(bookingId);
    setShowDetails(true);
    setOpenDropdownId(null);
  };

  // ──────────────────────────────
  // Open delete confirm
  // ──────────────────────────────
  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ id });
    setShowDeleteConfirm(true);
    setOpenDropdownId(null);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.booking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      b.booking_status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Bookings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and track all service bookings
          </p>
        </div>
        <Link href="/bookings/allBookings/createBooking">
          <button className="flex items-center gap-2.5 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
            <Plus className="w-5 h-5" />
            Create New Booking
          </button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code, customer, or service..."
              className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="w-[76vw] relative bg-white rounded-2xl shadow-sm border border-slate-200 mb-10 ">
        <div className="scrollbar overflow-x-auto overflow-y-visible">
          <table className=" w-full border-collapse ">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Scheduled At
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const statusConfig = getStatusConfig(b.status);
                  const urgent = isUrgent(b.is_urgent);
                  const accepted = b.accepted_taaskrs || 0;
                  const required = b.required_taaskrs || 1;
                  const needsAttention =
                    b.assignment_status === "unassigned" || accepted < required;
                  const isOpen = openDropdownId === b.id;

                  const rowClass = needsAttention
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "hover:bg-slate-50/70";

                  return (
                    <tr
                      key={b.id || b.booking_code}
                      className={`${rowClass} transition-all duration-150`}
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono text-orange-600 font-semibold">
                          {b.booking_code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900 truncate max-w-xs">
                          {b.customer_name || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-800 truncate max-w-xs">
                          {b.service_name || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-900">
                          {formatDateTime(b.scheduled_at)}
                          {urgent && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              URGENT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 capitalize text-sm text-slate-900">
                        {b.priority || "—"}
                      </td>
                      <td className="px-6 py-5 text-center text-sm">
                        <span className="font-medium">
                          {accepted}/{required} Assigned
                        </span>
                        {b.taaskr_name && (
                          <div className="text-xs text-slate-500">
                            {b.taaskr_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.badge}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-semibold text-slate-900">
                          <IndianRupee className="w-4 h-4" />
                          {Number(b.total_price || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="relative flex justify-end">
                          <button
                            onClick={(e) => toggleDropdown(b.id, e)}
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>

                          {isOpen && (
                            <div
                              ref={(el) => (dropdownRefs.current[b.id] = el)}
                              className="absolute right-0 top-10 w-60 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                            >
                              <button
                                onClick={() => openDetails(b.id)}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => openEdit(b)}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Booking
                              </button>
                              <hr className="border-slate-200" />
                              <button
                                onClick={() => openDeleteConfirm(b.id)}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Booking
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredBookings.length}</strong> bookings
          </p>
        </div>
      </div>

      {/* Edit Modal - Now a separate component */}
      <EditBookingModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchBookings}
        initialData={editBooking}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Delete Booking?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone. All data will be permanently
              removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteBooking}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {pendingAction.currentStatus === "pending"
                ? "Confirm"
                : "Set to Pending"}{" "}
              Booking?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {pendingAction.currentStatus === "pending"
                ? "This booking will be confirmed."
                : "This booking will be set to pending."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                className={`px-5 py-2.5 text-white rounded-lg disabled:opacity-70 flex items-center gap-2 ${
                  pendingAction.currentStatus === "pending"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    {pendingAction.currentStatus === "pending"
                      ? "Confirm"
                      : "Pending"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Sidebar */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                {detailLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    <span className="text-lg font-medium text-slate-600">
                      Loading details...
                    </span>
                  </div>
                ) : selectedBooking ? (
                  <>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl mb-1 font-bold text-slate-900">
                        {selectedBooking.booking_code}
                      </h2>
                      <p
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                          getStatusConfig(selectedBooking.status).badge
                        }`}
                      >
                        {getStatusConfig(selectedBooking.status).label}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-slate-700 mt-2">
                      Created At -{" "}
                      <span className="font-normal text-slate-500 ">
                        {" "}
                        {formatDateTime(selectedBooking.created_at)}
                      </span>
                    </p>
                  </>
                ) : (
                  <h2 className="text-2xl font-bold text-red-600">
                    Failed to load
                  </h2>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedBooking(null);
                }}
                className="p-3 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-10">
              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                  <p className="text-slate-600">Fetching booking details...</p>
                </div>
              ) : selectedBooking ? (
                <>
                  {/* Customer Section */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                      <User className="w-5 h-5 text-slate-600" />
                      Customer Information
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <p className="text-lg font-medium text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {selectedBooking.customer.full_name || "—"}
                      </p>
                      {selectedBooking.customer.phone && (
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedBooking.customer.phone}
                        </p>
                      )}
                      {selectedBooking.customer.email && (
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedBooking.customer.email}
                        </p>
                      )}
                      {selectedBooking.address && (
                        <div>
                          <p className="text-sm font-medium text-slate-800 mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedBooking.address.label} Address :
                          </p>
                          <p className="text-slate-600 ms-6">
                            {selectedBooking.address.street},
                            <br />
                            {selectedBooking.address.city},&nbsp;
                            {selectedBooking.address.state} -&nbsp;
                            {selectedBooking.address.pincode}
                          </p>
                        </div>
                      )}
                      {selectedBooking.location_notes && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                            <MapPinned className="w-4 h-4" />
                            Location Notes :
                          </p>
                          <p className="text-sm text-slate-600 ms-6">
                            {selectedBooking.location_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Service & Schedule */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                      <Calendar className="w-5 h-5 text-slate-600" />
                      Service & Schedule
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        <Rainbow className="w-4 h-4" />
                        {selectedBooking.service_name || "—"}
                      </p>
                      <p className="text-slate-600 flex items-center gap-2">
                        <span className="font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Scheduled At -{" "}
                        </span>
                        {formatDateTime(selectedBooking.scheduled_at)}
                      </p>
                      <p className="text-slate-600 flex items-center gap-2">
                        <span className="font-medium flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" />
                          Priority -{" "}
                        </span>
                        {selectedBooking.priority || "—"}
                      </p>

                      {isUrgent(selectedBooking.scheduled_at) && (
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          <AlertCircle className="w-4 h-4" />
                          URGENT: Less than 24 hours away
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Assignment Section */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                      <UserPlus className="w-5 h-5 text-slate-600" />
                      Taaskr Assignment
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-slate-600">Required</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {selectedBooking.required_taaskrs || 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Accepted</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            {selectedBooking.accepted_taaskrs || 0}
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          Assignment Status : &nbsp;
                          <span className="text-slate-900 font-semibold capitalize">
                            {selectedBooking.assignment_status || "—"}
                          </span>
                        </p>
                      </div>
                      {selectedBooking.assigned_taaskrs &&
                        selectedBooking.assigned_taaskrs.map((taaskr) => (
                          <div
                            key={taaskr.taaskr_id}
                            className="pt-3 border-t border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-700 m-0">
                                Assigned Taaskr :
                              </p>
                              <p className="text-slate-900 m-0">
                                {taaskr.taaskr_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-700 m-0">
                                Taaskr phone :
                              </p>
                              <p className="text-slate-900 m-0">
                                {taaskr.taaskr_phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-700 m-0">
                                Method :
                              </p>
                              <p className="text-slate-900 m-0">
                                {taaskr.method}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-700 m-0">
                                Assigned By :
                              </p>
                              <p className="text-slate-900 m-0">
                                {taaskr.assigned_by}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>

                  {/* Pricing */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                      <IndianRupee className="w-5 h-5 text-slate-600" />
                      Pricing
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-700">Total Amount</p>
                        <p className="text-3xl font-bold text-slate-900">
                          ₹{Number(selectedBooking.total_price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                  <p className="text-lg text-slate-700">
                    Unable to load booking details
                  </p>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedBooking(null);
                    }}
                    className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

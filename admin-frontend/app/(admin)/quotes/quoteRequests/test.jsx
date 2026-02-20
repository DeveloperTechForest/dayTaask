// app/quotes/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Download,
  Eye,
  Send,
  ChevronDown,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Calendar,
  Phone,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const getStatusConfig = (status) => {
  const map = {
    open: { badge: "bg-yellow-100 text-yellow-800", label: "Open" },
    quoted: { badge: "bg-blue-100 text-blue-800", label: "Quoted" },
    accepted: { badge: "bg-emerald-100 text-emerald-800", label: "Accepted" },
    converted: { badge: "bg-emerald-100 text-emerald-800", label: "Converted" },
    rejected: { badge: "bg-red-100 text-red-800", label: "Rejected" },
  };
  return (
    map[status?.toLowerCase()] || {
      badge: "bg-slate-100 text-slate-700",
      label: status || "Unknown",
    }
  );
};

export default function AdminQuoteRequestsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Image zoom
  const [zoomedImage, setZoomedImage] = useState(null);

  // Dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  // Custom Service Modal
  const [showCustomServiceModal, setShowCustomServiceModal] = useState(false);
  const [customServiceMode, setCustomServiceMode] = useState("create");
  const [customServiceForm, setCustomServiceForm] = useState({
    name: "",
    description: "",
    base_price: "",
    price_unit: "fixed",
    whats_included: "",
    duration_minutes: "",
    warranty_days: "",
    status: "sent",
    is_active: true,
  });
  const [customServiceLoading, setCustomServiceLoading] = useState(false);

  // ... (keep your buildQuery, fetchQuotes, fetchQuoteDetail, openDetails functions unchanged)
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);
    return params.toString();
  };

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const query = buildQuery();
      const url = query
        ? `/api/bookings/admin/quote-requests/?${query}`
        : `/api/bookings/admin/quote-requests/`;

      const data = await apiFetch(url);

      setQuotes(data.results || []);
      setTotalCount(data.count || 0);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
    } catch (err) {
      console.error("Failed to load quote requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchQuotes();
  }, [searchTerm, statusFilter]);

  const fetchQuoteDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await apiFetch(`/api/bookings/admin/quote-requests/${id}/`);
      setSelectedQuote(data);
    } catch (err) {
      console.error("Failed to load quote detail:", err);
      setShowDetails(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const openDetails = (quote) => {
    fetchQuoteDetail(quote.id);
    setShowDetails(true);
    setOpenDropdownId(null);
  };

  const openCustomServiceModal = () => {
    if (!selectedQuote) return;

    const isEdit = !!selectedQuote.custom_service;
    setCustomServiceMode(isEdit ? "edit" : "create");

    setCustomServiceForm({
      name: selectedQuote.service_name || "",
      description: selectedQuote.problem_description || "",
      base_price: "",
      price_unit: "fixed",
      whats_included: "",
      duration_minutes: "60",
      warranty_days: "10",
      status: "sent",
      is_active: true,
    });

    setShowCustomServiceModal(true);
  };

  const handleCustomServiceSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!customServiceForm.name.trim() || !customServiceForm.base_price) {
      alert("Service name and base price are required.");
      return;
    }

    setCustomServiceLoading(true);

    let whatsIncludedArray = [];
    try {
      if (customServiceForm.whats_included.trim()) {
        whatsIncludedArray = JSON.parse(customServiceForm.whats_included);
        if (!Array.isArray(whatsIncludedArray)) throw new Error();
      }
    } catch {
      alert(
        'Invalid format for \'What\'s Included\'. Use JSON array like ["Item1", "Item2"]',
      );
      setCustomServiceLoading(false);
      return;
    }

    const payload = {
      name: customServiceForm.name.trim(),
      description: customServiceForm.description.trim(),
      base_price: customServiceForm.base_price,
      price_unit: customServiceForm.price_unit,
      whats_included: whatsIncludedArray,
      duration_minutes: Number(customServiceForm.duration_minutes) || 60,
      warranty_days: Number(customServiceForm.warranty_days) || 10,
      status: customServiceForm.status,
      is_active: customServiceForm.is_active,
    };

    try {
      if (customServiceMode === "create") {
        await apiFetch("/api/bookings/admin/custom-services/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        alert("Custom service created successfully!");
      } else {
        await apiFetch(
          `/api/bookings/admin/custom-services/${selectedQuote.custom_service}/`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );
        alert("Custom service updated successfully!");
      }

      setShowCustomServiceModal(false);
      fetchQuoteDetail(selectedQuote.id); // Refresh sidebar
    } catch (err) {
      alert(err?.detail || "Failed to save custom service");
    } finally {
      setCustomServiceLoading(false);
    }
  };

  // ... (keep handleDeleteQuote, toggleDropdown, useEffect for outside click, formatDate, formatOnlyDate unchanged)
  const handleDeleteQuote = async (quoteId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this quote request?\nThis action cannot be undone.",
      )
    ) {
      setOpenDropdownId(null);
      return;
    }

    setDeletingId(quoteId);

    // Optimistic update: remove from UI immediately
    const oldQuotes = [...quotes];
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    setTotalCount((prev) => prev - 1);

    try {
      await apiFetch(`/api/bookings/admin/quote-requests/${quoteId}/`, {
        method: "DELETE",
      });

      alert("Quote request deleted successfully!");
      // Optional: refresh full list to be safe
      fetchQuotes();
    } catch (err) {
      alert(err?.detail || "Failed to delete quote request");
      // Rollback optimistic update on error
      setQuotes(oldQuotes);
      setTotalCount(oldQuotes.length);
    } finally {
      setDeletingId(null);
      setOpenDropdownId(null);
    }
  };

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

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatOnlyDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && currentPage === 1 && quotes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote Requests</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and respond to customer quote & consultation requests
          </p>
        </div>
        <Link
          href="/quotes/create"
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Quote Request
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
              placeholder="Search by code, customer, service..."
              className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Quote Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Custom Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Base Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Preferred Date & Time
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-500">
                    No quote requests found.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const statusConfig = getStatusConfig(q.status);
                  const isOpen = openDropdownId === q.id;
                  const isDeleting = deletingId === q.id;

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50/70 transition-all duration-150"
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono font-semibold text-orange-600">
                          {q.quote_code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {q.customer_name || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-slate-800 truncate max-w-xs">
                        {q.service_name || "—"}
                      </td>
                      <td className="px-6 py-5 text-slate-800 truncate max-w-xs">
                        {q.base_service_name || "—"}
                      </td>
                      <td className="px-6 py-5 text-slate-700 truncate max-w-xs">
                        {q.category_name || "—"}
                      </td>
                      <td className="px-6 py-5 text-slate-700">
                        {formatOnlyDate(q.preferred_date)},{" "}
                        {q.preferred_time_slot || "—"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.badge}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-700">
                        {formatDate(q.created_at)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="relative flex justify-end">
                          <button
                            onClick={(e) => toggleDropdown(q.id, e)}
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                            ) : (
                              <MoreVertical className="w-5 h-5 text-slate-600" />
                            )}
                          </button>

                          {isOpen && !isDeleting && (
                            <div
                              ref={(el) => (dropdownRefs.current[q.id] = el)}
                              className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-2"
                            >
                              <button
                                onClick={() => openDetails(q)}
                                className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-50 text-sm text-slate-700"
                              >
                                <Eye className="w-4 h-4" /> View Details
                              </button>

                              <hr className="my-1 border-slate-200" />

                              <button
                                onClick={() => handleEditQuote(q)}
                                className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-50 text-sm text-slate-700"
                              >
                                <Edit className="w-4 h-4" /> Edit Quote Request
                              </button>

                              <button
                                onClick={() => handleDeleteQuote(q.id)}
                                className="flex w-full items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-red-600"
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-4 h-4" /> Delete Quote
                                Request
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div>
            Showing <strong>{quotes.length}</strong> of{" "}
            <strong>{totalCount}</strong> quote requests
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!prevUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-medium min-w-[3rem] text-center">
                {currentPage}
              </span>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!nextUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sidebar */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                {detailLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    <span className="text-lg font-medium text-slate-600">
                      Loading...
                    </span>
                  </div>
                ) : selectedQuote ? (
                  <>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedQuote.quote_code}
                      </h2>
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                          getStatusConfig(selectedQuote.status).badge
                        }`}
                      >
                        {getStatusConfig(selectedQuote.status).label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Created {formatDate(selectedQuote.created_at)}
                    </p>
                  </>
                ) : (
                  <h2 className="text-xl font-bold text-red-600">
                    Failed to load
                  </h2>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedQuote(null);
                  setZoomedImage(null);
                }}
                className="p-3 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-10">
              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
                  <p className="text-slate-600">Fetching quote details...</p>
                </div>
              ) : selectedQuote ? (
                <>
                  {/* Customer section - unchanged */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-slate-600" />
                      Customer Information
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <p className="font-medium text-slate-900">
                        {selectedQuote.customer_name || "—"}
                      </p>
                      {selectedQuote.customer_phone && (
                        <p className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          {selectedQuote.customer_phone}
                        </p>
                      )}
                      <p className="text-sm text-slate-500">
                        Customer ID: {selectedQuote.customer}
                      </p>
                    </div>
                  </section>

                  {/* Request Details */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Quote Request Details
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Service
                          </p>
                          <p className="font-medium">
                            {selectedQuote.service_name}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Service ID: {selectedQuote.service}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Category
                          </p>
                          <p>{selectedQuote.category_name || "—"}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Category ID: {selectedQuote.service_category}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Problem / Description
                        </p>
                        <p className="text-slate-700 whitespace-pre-line">
                          {selectedQuote.problem_description ||
                            "No description provided."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Preferred Date
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatOnlyDate(selectedQuote.preferred_date) ||
                              "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Preferred Time Slot
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {selectedQuote.preferred_time_slot || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Images */}
                  {selectedQuote.images?.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                        Attachments ({selectedQuote.images.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedQuote.images.map((img, idx) => (
                          <div
                            key={img.id}
                            className="cursor-pointer group"
                            onClick={() => setZoomedImage(img.image)}
                          >
                            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                              <img
                                src={img.image}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              <p>
                                Uploaded by: <strong>{img.uploaded_by}</strong>
                              </p>
                              <p>{formatDate(img.created_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Additional Info */}
                  <section>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      Additional Information
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Base Service
                          </p>
                          <p className="font-medium">
                            {selectedQuote.base_service_name || "—"}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Base Service ID: {selectedQuote.service || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">
                            Category
                          </p>
                          <p>{selectedQuote.category_name || "—"}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Category ID: {selectedQuote.service_category || "—"}
                          </p>
                        </div>
                      </div>

                      <p>
                        <strong>Custom Service:</strong>{" "}
                        {selectedQuote.custom_service
                          ? `ID: ${selectedQuote.custom_service}`
                          : "Not created yet"}
                      </p>
                      <p>
                        <strong>Booking:</strong>{" "}
                        {selectedQuote.booking
                          ? `ID: ${selectedQuote.booking}`
                          : "Not converted yet"}
                      </p>
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    {selectedQuote.status === "open" && (
                      <button
                        onClick={openCustomServiceModal}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                        {selectedQuote.custom_service
                          ? "Edit Custom Service"
                          : "Create Custom Service"}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-slate-600">
                  Failed to load quote details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white p-3 hover:bg-white/10 rounded-full transition"
            onClick={() => setZoomedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed attachment"
              className="max-w-full max-h-[85vh] object-contain transition-transform duration-200 hover:scale-150 cursor-zoom-in"
            />
          </div>
        </div>
      )}

      {/* Custom Service Modal */}
      {showCustomServiceModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {customServiceMode === "create"
                  ? "Create Custom Service"
                  : "Edit Custom Service"}
              </h2>
              <button
                onClick={() => setShowCustomServiceModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form
              onSubmit={handleCustomServiceSubmit}
              className="p-6 space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={customServiceForm.name}
                  onChange={(e) =>
                    setCustomServiceForm({
                      ...customServiceForm,
                      name: e.target.value,
                    })
                  }
                  required
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={customServiceForm.description}
                  onChange={(e) =>
                    setCustomServiceForm({
                      ...customServiceForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Base Price & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customServiceForm.base_price}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        base_price: e.target.value,
                      })
                    }
                    required
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price Unit
                  </label>
                  <select
                    value={customServiceForm.price_unit}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        price_unit: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                    <option value="per_unit">Per Unit</option>
                  </select>
                </div>
              </div>

              {/* Duration & Warranty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={customServiceForm.duration_minutes}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        duration_minutes: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Warranty (days)
                  </label>
                  <input
                    type="number"
                    value={customServiceForm.warranty_days}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        warranty_days: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* What's Included */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What's Included (comma-separated or JSON array)
                </label>
                <textarea
                  value={customServiceForm.whats_included}
                  onChange={(e) =>
                    setCustomServiceForm({
                      ...customServiceForm,
                      whats_included: e.target.value,
                    })
                  }
                  placeholder='e.g. ["Installation", "2 Cameras", "Wiring"]'
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Status & Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={customServiceForm.status}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    checked={customServiceForm.is_active}
                    onChange={(e) =>
                      setCustomServiceForm({
                        ...customServiceForm,
                        is_active: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-slate-700">
                    Is Active
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCustomServiceModal(false)}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium"
                  disabled={customServiceLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={customServiceLoading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-60 shadow-sm"
                >
                  {customServiceLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : null}
                  {customServiceMode === "create"
                    ? "Create Custom Service"
                    : "Update Custom Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

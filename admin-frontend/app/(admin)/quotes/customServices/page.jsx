// app/custom-services/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

const getStatusConfig = (status) => {
  const map = {
    draft: { badge: "bg-gray-100 text-gray-800", label: "Draft" },
    sent: { badge: "bg-blue-100 text-blue-800", label: "Sent" },
    accepted: { badge: "bg-emerald-100 text-emerald-800", label: "Accepted" },
    rejected: { badge: "bg-red-100 text-red-800", label: "Rejected" },
  };
  return (
    map[status?.toLowerCase()] || {
      badge: "bg-slate-100 text-slate-700",
      label: status || "Unknown",
    }
  );
};

export default function AdminCustomServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal for create/edit
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
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

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);
    return params.toString();
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const query = buildQuery();
      const url = query
        ? `/api/bookings/admin/custom-services/?${query}`
        : `/api/bookings/admin/custom-services/`;

      const data = await apiFetch(url);
      setServices(data.results || []);
      setTotalCount(data.count || 0);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
    } catch (err) {
      console.error("Failed to load custom services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchServices();
  }, [searchTerm, statusFilter]);

  // Open modal for create or edit
  const openModal = (service = null) => {
    setModalMode(service ? "edit" : "create");
    setSelectedService(service);

    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        base_price: service.base_price || "",
        price_unit: service.price_unit || "fixed",
        whats_included: service.whats_included
          ? JSON.stringify(service.whats_included)
          : "",
        duration_minutes: service.duration_minutes || "",
        warranty_days: service.warranty_days || "",
        status: service.status || "sent",
        is_active: service.is_active ?? true,
      });
    } else {
      setFormData({
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
    }

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    if (!formData.name.trim() || !formData.base_price) {
      alert("Name and base price are required.");
      setModalLoading(false);
      return;
    }

    let whatsIncluded = [];
    if (formData.whats_included.trim()) {
      try {
        const parsed = JSON.parse(formData.whats_included);
        if (Array.isArray(parsed)) {
          whatsIncluded = parsed;
        } else {
          whatsIncluded = formData.whats_included
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);
        }
      } catch {
        alert(
          "Invalid 'What's Included' format. Use JSON array or comma-separated values.",
        );
        setModalLoading(false);
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      base_price: formData.base_price,
      price_unit: formData.price_unit,
      whats_included: whatsIncluded,
      duration_minutes: Number(formData.duration_minutes) || 60,
      warranty_days: Number(formData.warranty_days) || 10,
      status: formData.status,
      is_active: formData.is_active,
    };

    try {
      if (modalMode === "create") {
        await apiFetch("/api/bookings/admin/custom-services/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        alert("Custom service created!");
      } else {
        await apiFetch(
          `/api/bookings/admin/custom-services/${selectedService.id}/`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );
        alert("Custom service updated!");
      }

      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert(err?.detail || "Failed to save custom service");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this custom service?")) return;

    try {
      // Optional: fetch first to check if booking exists
      const service = await apiFetch(
        `/api/bookings/admin/custom-services/${id}/`,
      );
      if (service.booking) {
        alert("Cannot delete — this custom service is attached to a booking.");
        return;
      }

      await apiFetch(`/api/bookings/admin/custom-services/${id}/`, {
        method: "DELETE",
      });
      alert("Deleted successfully!");
      fetchServices();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && services.length === 0) {
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
          <h1 className="text-2xl font-bold text-slate-900">Custom Services</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage all custom services created for customers
          </p>
        </div>
        <button
          disabled
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 disabled:opacity-80 cursor-not-allowed text-white font-medium rounded-xl transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Custom Service (From Quote Only)
        </button>
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
              placeholder="Search by name, status..."
              className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Quote Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Last Updated
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
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    No custom services found.
                  </td>
                </tr>
              ) : (
                services.map((s) => {
                  const statusConfig = getStatusConfig(s.status);
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 transition-all duration-150"
                    >
                      <td className="px-6 py-5 font-medium">{s.id}</td>
                      <td className="px-6 py-5">{s.name}</td>
                      <td className="px-6 py-5">{s.quote_code || "—"}</td>
                      <td className="px-6 py-5">{s.customer_name || "—"}</td>
                      <td className="px-6 py-5">
                        ₹{s.base_price}{" "}
                        <span className="text-xs text-slate-500">
                          ({s.price_unit})
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.badge}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-600">
                        {new Date(s.updated_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5 text-slate-700">
                        {new Date(s.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(s)}
                            className="p-2 hover:bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
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
            Showing <strong>{services.length}</strong> of{" "}
            <strong>{totalCount}</strong>
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!prevUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium min-w-[3rem] text-center">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!nextUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {modalMode === "create"
                  ? "Create Custom Service"
                  : "Edit Custom Service"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: e.target.value })
                    }
                    required
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price Unit
                  </label>
                  <select
                    value={formData.price_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, price_unit: e.target.value })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="hourly">Hourly</option>
                    <option value="per_unit">Per Unit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Warranty (days)
                  </label>
                  <input
                    type="number"
                    value={formData.warranty_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warranty_days: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What's Included (JSON array)
                </label>
                <textarea
                  value={formData.whats_included}
                  onChange={(e) =>
                    setFormData({ ...formData, whats_included: e.target.value })
                  }
                  placeholder='["Installation", "2 Cameras", "Wiring"]'
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="h-5 w-5 text-orange-600 rounded"
                  />
                  <label className="text-sm font-medium text-slate-700">
                    Is Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium"
                  disabled={modalLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-60 shadow-sm"
                >
                  {modalLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : null}
                  {modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// app/services/addons/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  IndianRupee,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

export default function AddonsPage() {
  const [addons, setAddons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editAddon, setEditAddon] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [pendingToggleStatus, setPendingToggleStatus] = useState(null);
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
          (ref) => ref && ref.contains(event.target)
        )
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [addonsRes, servicesRes] = await Promise.all([
        apiFetch("/api/services/admin/addons/"),
        apiFetch("/api/services/admin/services/"),
      ]);

      setAddons(Array.isArray(addonsRes) ? addonsRes : addonsRes.results || []);
      setServices(
        Array.isArray(servicesRes) ? servicesRes : servicesRes.results || []
      );
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load add-ons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAddon = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      service: parseInt(formData.get("service")),
      is_active: formData.get("is_active") === "on",
    };

    try {
      if (editAddon) {
        await apiFetch(`/api/services/admin/addons/${editAddon.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/services/admin/addons/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      setEditAddon(null);
      fetchData();
    } catch (err) {
      alert("Failed to save add-on: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/services/admin/addons/${pendingId}/`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete add-on");
    } finally {
      setShowDeleteConfirm(false);
      setPendingId(null);
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/services/admin/addons/${pendingId}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !pendingToggleStatus }),
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setShowToggleConfirm(false);
      setPendingId(null);
      setActionLoading(false);
    }
  };

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch =
      addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      serviceFilter === "all" || addon.service.toString() === serviceFilter;
    return matchesSearch && matchesService;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add-ons</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage service add-ons and extras
          </p>
        </div>
        <button
          onClick={() => {
            setEditAddon(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2.5 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Add-on
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search add-ons..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-20">
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Add-on
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAddons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No add-ons found.
                  </td>
                </tr>
              ) : (
                filteredAddons.map((addon) => {
                  const isOpen = openDropdownId === addon.id;
                  const serviceName =
                    services.find((s) => s.id === addon.service)?.name ||
                    "Unknown";

                  return (
                    <tr
                      key={addon.id}
                      className="hover:bg-slate-50/70 transition-all duration-150"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {addon.name}
                          </p>
                          <p className="text-xs font-mono text-slate-500 mt-1">
                            ID: {addon.id}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-slate-700">
                          {serviceName}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <IndianRupee className="w-4 h-4" />
                          {parseFloat(addon.price).toLocaleString("en-IN")}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {addon.description || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {addon.is_active ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="relative flex justify-end">
                          <button
                            onClick={(e) => toggleDropdown(addon.id, e)}
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>

                          {isOpen && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[addon.id] = el)
                              }
                              className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                            >
                              <button
                                onClick={() => {
                                  setEditAddon(addon);
                                  setShowModal(true);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Add-on
                              </button>
                              <hr className="border-slate-200" />
                              <button
                                onClick={() => {
                                  setPendingId(addon.id);
                                  setPendingToggleStatus(addon.is_active);
                                  setShowToggleConfirm(true);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition ${
                                  addon.is_active
                                    ? "hover:bg-orange-50 text-orange-600"
                                    : "hover:bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                <Power className="w-4 h-4" />
                                {addon.is_active ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => {
                                  setPendingId(addon.id);
                                  setShowDeleteConfirm(true);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Add-on
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

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredAddons.length}</strong> add-ons
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {editAddon ? "Edit Add-on" : "Add New Add-on"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditAddon(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSaveAddon} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Add-on Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editAddon?.name || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Parent Service
                  </label>
                  <select
                    name="service"
                    defaultValue={editAddon?.service || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editAddon?.price || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editAddon?.description || ""}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={editAddon ? editAddon.is_active : true}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Publish add-on immediately
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditAddon(null);
                    }}
                    className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : editAddon ? (
                      "Update Add-on"
                    ) : (
                      "Create Add-on"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Delete Add-on?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

      {/* Toggle Confirmation */}
      {showToggleConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {pendingToggleStatus ? "Deactivate" : "Activate"} Add-on?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {pendingToggleStatus
                ? "This add-on will no longer be available."
                : "This add-on will become available again."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowToggleConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleActive}
                disabled={actionLoading}
                className={`px-5 py-2.5 text-white rounded-lg disabled:opacity-70 flex items-center gap-2 ${
                  pendingToggleStatus
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    {pendingToggleStatus ? "Deactivate" : "Activate"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

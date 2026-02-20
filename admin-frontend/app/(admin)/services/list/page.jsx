// app/services/page.jsx
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
  Image as ImageIcon,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const fetchServices = async () => {
    try {
      const data = await apiFetch("/api/services/admin/services/");
      const list = Array.isArray(data) ? data : data.results || [];
      setServices(list);
    } catch (err) {
      console.error("Fetch services error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch("/api/services/admin/categories/");
      const list = Array.isArray(data) ? data : data.results || [];
      setCategories(list);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSaveService = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = new FormData();
    payload.append("name", formData.get("name"));
    payload.append("short_description", formData.get("short_description"));
    payload.append("description", formData.get("description"));
    payload.append("category", formData.get("category"));
    payload.append("base_price", formData.get("base_price"));
    payload.append("price_unit", formData.get("price_unit"));
    payload.append("duration_minutes", formData.get("duration_minutes"));
    payload.append("warranty_days", formData.get("warranty_days"));
    payload.append("slug", formData.get("slug"));
    payload.append("is_active", formData.get("is_active") === "on");

    // whats_included: comma-separated → array
    const whatsIncluded = formData.get("whats_included") || "";
    whatsIncluded
      .split(",")
      .filter((item) => item.trim())
      .forEach((item) => {
        payload.append("whats_included", item.trim());
      });

    // Image upload
    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      if (editService) {
        await apiFetch(`/api/services/admin/services/${editService.id}/`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiFetch("/api/services/admin/services/", {
          method: "POST",
          body: payload,
        });
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setEditService(null);
      setImageFile(null);
      setImagePreview(null);
      fetchServices();
    } catch (err) {
      alert("Failed to save service: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteService = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/services/admin/services/${pendingAction.id}/`, {
        method: "DELETE",
      });
      fetchServices();
    } catch (err) {
      alert("Failed to delete service");
    } finally {
      setShowDeleteConfirm(false);
      setPendingAction(null);
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    const { id, currentStatus } = pendingAction;
    try {
      await apiFetch(`/api/services/admin/services/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchServices();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setShowToggleConfirm(false);
      setPendingAction(null);
      setActionLoading(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setPendingAction({ id });
    setShowDeleteConfirm(true);
    setOpenDropdownId(null);
  };

  const openToggleConfirm = (id, currentStatus) => {
    setPendingAction({ id, currentStatus });
    setShowToggleConfirm(true);
    setOpenDropdownId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${
      mins > 0 ? `${mins}m` : ""
    }`.trim();
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || s.category.toString() === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.is_active) ||
      (statusFilter === "inactive" && !s.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
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
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your service offerings
          </p>
        </div>
        <button
          onClick={() => {
            setEditService(null);
            setImageFile(null);
            setImagePreview(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2.5 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4  flex-1">
            <div className="relative  flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-30">
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Warranty
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
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const isOpen = openDropdownId === service.id;

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/70 transition-all duration-150"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                <ImageIcon className="w-7 h-7 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {service.name}
                            </p>
                            <p className="text-xs font-mono text-slate-500 mt-1">
                              {service.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">
                          {service.category_name}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <IndianRupee className="w-4 h-4" />
                          {parseFloat(service.base_price).toLocaleString(
                            "en-IN"
                          )}
                          <span className="text-xs text-slate-500 font-normal">
                            /{service.price_unit}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-700">
                          <Clock className="w-4 h-4" />
                          {formatDuration(service.duration_minutes)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-700">
                          <Shield className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">
                            {service.warranty_days} days
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        {service.is_active ? (
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
                            onClick={(e) => toggleDropdown(service.id, e)}
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>

                          {isOpen && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[service.id] = el)
                              }
                              className="absolute right-0 top-10 w-60 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                            >
                              <button
                                onClick={() => {
                                  setEditService(service);
                                  setImagePreview(service.image || null);
                                  setShowEditModal(true);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Service
                              </button>
                              <Link
                                href={`/services/list/${service.id}`}
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition block"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                <Eye className="w-4 h-4" />
                                Preview Service
                              </Link>
                              <hr className="border-slate-200" />
                              <button
                                onClick={() =>
                                  openToggleConfirm(
                                    service.id,
                                    service.is_active
                                  )
                                }
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition ${
                                  service.is_active
                                    ? "hover:bg-orange-50 text-orange-600"
                                    : "hover:bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                <Power className="w-4 h-4" />
                                {service.is_active ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(service.id)}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Service
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
            Showing <strong>{filteredServices.length}</strong> services
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {editService ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditService(null);
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSaveService} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={editService?.name || ""}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Slug
                    </label>
                    <input
                      name="slug"
                      type="text"
                      defaultValue={editService?.slug || ""}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editService?.category || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Short Description
                  </label>
                  <input
                    name="short_description"
                    type="text"
                    defaultValue={editService?.short_description || ""}
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={editService?.description || ""}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Service Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                  {(imagePreview || editService?.image) && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2">Preview:</p>
                      <img
                        src={imagePreview || editService?.image}
                        alt="Service preview"
                        className="w-64 h-48 object-cover rounded-lg border border-slate-300"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base Price
                    </label>
                    <input
                      name="base_price"
                      type="number"
                      step="0.01"
                      defaultValue={editService?.base_price || ""}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price Unit
                    </label>
                    <select
                      name="price_unit"
                      defaultValue={editService?.price_unit || "fixed"}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    >
                      <option value="Fixed Price">Fixed Price</option>
                      <option value="Hourly Rate">Hourly Rate</option>
                      <option value="Starting From">Starting From</option>
                      <option value="Custom Price">Custom Price</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      name="duration_minutes"
                      type="number"
                      defaultValue={editService?.duration_minutes || ""}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Warranty (days)
                  </label>
                  <input
                    name="warranty_days"
                    type="number"
                    defaultValue={editService?.warranty_days || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What's Included (comma separated)
                  </label>
                  <textarea
                    name="whats_included"
                    rows={3}
                    placeholder="e.g., Tools, Materials, Cleanup"
                    defaultValue={editService?.whats_included?.join(", ") || ""}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={editService ? editService.is_active : true}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Publish service immediately
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditService(null);
                      setImageFile(null);
                      setImagePreview(null);
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
                    ) : editService ? (
                      "Update Service"
                    ) : (
                      "Create Service"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Delete Service?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone. All bookings and data will be
              permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
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

      {/* Toggle Active Confirmation Modal */}
      {showToggleConfirm && pendingAction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {pendingAction.currentStatus ? "Deactivate" : "Activate"} Service?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {pendingAction.currentStatus
                ? "This service will no longer be available for booking."
                : "This service will become available for booking again."}
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
                  pendingAction.currentStatus
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    {pendingAction.currentStatus ? "Deactivate" : "Activate"}
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

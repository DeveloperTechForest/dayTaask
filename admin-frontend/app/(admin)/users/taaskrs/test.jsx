// app/users/taaskrs/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  MessageSquare,
  Wallet,
  Edit,
  Trash2,
  Loader2,
  ShieldCheck,
  Phone,
  Star,
  Plus,
  X,
  ChevronDown,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";

export default function TaaskrsPage() {
  const { user, loading: authLoading, hasPermission } = useAuth();

  const [taaskrs, setTaaskrs] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedTaaskr, setSelectedTaaskr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [minRatingFilter, setMinRatingFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnverifyConfirm, setShowUnverifyConfirm] = useState(false);
  const [pendingUnverifyId, setPendingUnverifyId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [availLoading, setAvailLoading] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const dropdownRefs = useRef({});

  const DAYS_ORDER = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

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

  const fetchTaaskrs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch("/api/taaskr/admin/taaskrcrud/");
      const list = Array.isArray(data) ? data : data?.results || [];
      setTaaskrs(list);
    } catch (err) {
      console.error("Fetch Taaskrs error:", err);
      setError(err.message || "Failed to load Taaskrs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (taaskrId) => {
    try {
      setAvailLoading(true);
      const data = await apiFetch("/api/taaskr/admin/availability/");
      const filtered = data.filter((a) => a.taaskr === taaskrId);
      setAvailability(filtered);
    } catch (err) {
      console.error("Fetch availability error:", err);
      setAvailability([]);
    } finally {
      setAvailLoading(false);
    }
  };

  const openAvailabilityModal = async (taaskr) => {
    setSelectedTaaskr(taaskr);
    setEditingDay(null);
    await fetchAvailability(taaskr.id);
    setShowAvailabilityModal(true);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTaaskrs();
    }
  }, [authLoading]);

  // ADD TAASKR
  const handleAddTaaskr = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      profile: {
        bio: formData.get("bio") || "",
        skill_tags: formData
          .get("skill_tags")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        certification: formData
          .get("certification")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      },
    };

    try {
      await apiFetch("/api/taaskr/admin/taaskrcrud/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setShowAddModal(false);
      fetchTaaskrs();
    } catch (err) {
      alert("Failed to add Taaskr: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT TAASKR
  const handleEditTaaskr = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      profile: {
        bio: formData.get("bio") || "",
        skill_tags:
          formData
            .get("skill_tags")
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) || [],
        certification:
          formData
            .get("certification")
            ?.split(",")
            .map((c) => c.trim())
            .filter(Boolean) || [],
      },
    };

    try {
      await apiFetch(`/api/taaskr/admin/taaskrcrud/${selectedTaaskr.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      // ✅ Re-fetch updated data
      const refreshed = await apiFetch(
        `/api/taaskr/admin/taaskrcrud/${selectedTaaskr.id}/`
      );

      setTaaskrs((prev) =>
        prev.map((t) => (t.id === selectedTaaskr.id ? refreshed : t))
      );

      setShowEditModal(false);
      alert("Taaskr updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update Taaskr: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE
  const handleDeleteTaaskr = async () => {
    setActionLoading(true);
    try {
      await apiFetch(`/api/taaskr/admin/taaskrcrud/${deleteId}/`, {
        method: "DELETE",
      });
      setShowDeleteConfirm(false);
      fetchTaaskrs();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // VIEW PROFILE
  const handleViewTaaskr = async (id) => {
    setActionLoading(true);
    try {
      const data = await apiFetch(`/api/taaskr/admin/taaskrcrud/${id}/`);
      setSelectedTaaskr(data);
      setShowViewModal(true);
    } catch (err) {
      alert("Failed to load profile: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // VERIFY / UNVERIFY TAASKR
  const handleVerifyTaaskr = async (taaskrId) => {
    setActionLoading(true);
    try {
      const res = await apiFetch(
        `/api/taaskr/admin/taaskrcrud/${taaskrId}/verify/`,
        { method: "PATCH" }
      );

      // instant UI update
      setTaaskrs((prev) =>
        prev.map((t) =>
          t.id === taaskrId ? { ...t, verified: res.verified } : t
        )
      );

      // also update selected taaskr if open
      if (selectedTaaskr?.id === taaskrId) {
        setSelectedTaaskr((prev) => ({
          ...prev,
          verified: res.verified,
        }));
      }
    } catch (err) {
      alert("Failed to update verification status");
    } finally {
      setActionLoading(false);
    }
  };

  const getDayAvailability = (dayKey) => {
    return availability.find((a) => a.day_of_week === dayKey) || null;
  };

  const handleSaveDay = async (dayKey, start, end, available) => {
    const existing = getDayAvailability(dayKey);
    const payload = {
      day_of_week: dayKey,
      start_time: start,
      end_time: end,
      is_available: available,
    };

    try {
      if (existing) {
        await apiFetch(`/api/taaskr/admin/availability/${existing.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        payload.taaskr = selectedTaaskr.id;
        await apiFetch("/api/taaskr/admin/availability/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await fetchAvailability(selectedTaaskr.id);
      setEditingDay(null);
    } catch (err) {
      alert("Failed to save availability");
    }
  };

  const handleDeleteDay = async (dayKey) => {
    if (!window.confirm("Remove availability for this day?")) return;
    const existing = getDayAvailability(dayKey);
    if (!existing) return;

    try {
      await apiFetch(`/api/taaskr/admin/availability/${existing.id}/`, {
        method: "DELETE",
      });
      await fetchAvailability(selectedTaaskr.id);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const filteredTaaskrs = taaskrs.filter((t) => {
    const user = t.user || {};
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery) ||
      t.skill_tags?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      t.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "yes" ? t.verified : !t.verified);

    const matchesRating =
      minRatingFilter === "all" || t.rating_avg >= parseFloat(minRatingFilter);

    return matchesSearch && matchesVerified && matchesRating;
  });

  if (authLoading || loading) {
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
        <button
          onClick={fetchTaaskrs}
          className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto p-4">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Taaskrs</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and monitor service providers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <option value="all">All Verified</option>
              <option value="yes">Verified</option>
              <option value="no">Not Verified</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, skill, bio..."
              className="w-full h-14 pl-14 pr-5 rounded-2xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>
        </div>
        {hasPermission("taaskr.create") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="h-14 px-6 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold rounded-2xl shadow-md hover:bg-orange-600 hover:shadow-lg active:scale-95 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Taaskr
          </button>
        )}
      </div>

      {/* Taaskr Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredTaaskrs.length === 0 ? (
          <p className="col-span-full text-center py-16 text-slate-500">
            No Taaskrs found.
          </p>
        ) : (
          filteredTaaskrs.map((t) => {
            const user = t.user || {};
            const isOpen = openDropdownId === t.id;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                          {user.full_name
                            ? user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "TK"}
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {user.full_name || "Unnamed Taaskr"}
                          </p>
                          <p className="text-xs opacity-90">
                            TK-{String(t.id).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                      {t.verified && (
                        <ShieldCheck className="w-6 h-6 text-white/90" />
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {t.bio && (
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {t.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {user.phone || "No phone"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.skill_tags?.length > 0 ? (
                        t.skill_tags.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No skills
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between px-5 pb-4">
                    <div className="flex items-center gap-2">
                      <Star
                        className={`w-5 h-5 ${
                          t.rating_avg > 0
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-slate-300"
                        }`}
                      />
                      <span className="font-semibold">
                        {t.rating_avg > 0 ? t.rating_avg.toFixed(1) : "N/A"}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 font-semibold text-sm rounded-full">
                      {t.total_jobs || 0} Jobs
                    </span>
                  </div>

                  <div className="relative p-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="flex justify-end gap-2">
                      {hasPermission("taaskr.availability.view") && (
                        <button
                          onClick={() => openAvailabilityModal(t)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition"
                        >
                          <Calendar className="w-5 h-5" />
                          View Availability
                        </button>
                      )}
                      <button
                        onClick={(e) => toggleDropdown(t.id, e)}
                        className="p-2.5 rounded-lg hover:bg-slate-200 transition"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>

                    {isOpen && (
                      <div
                        ref={(el) => (dropdownRefs.current[t.id] = el)}
                        className="absolute right-4 bottom-16 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                      >
                        {hasPermission("taaskr.profile.view") && (
                          <button
                            onClick={() => {
                              handleViewTaaskr(t.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                        )}
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </button>
                        {hasPermission("payment.view") && (
                          <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                            <Wallet className="w-4 h-4" />
                            View Wallet
                          </button>
                        )}
                        <hr className="border-slate-200" />
                        {hasPermission("taaskr.update") && (
                          <button
                            onClick={() => {
                              setSelectedTaaskr(t);
                              setShowEditModal(true);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Taaskr
                          </button>
                        )}
                        <hr className="border-slate-200" />
                        {hasPermission("taaskr.verify") && (
                          <button
                            onClick={() => {
                              if (t.verified) {
                                // unverify → show confirmation
                                setPendingUnverifyId(t.id);
                                setShowUnverifyConfirm(true);
                              } else {
                                // verify → instant
                                handleVerifyTaaskr(t.id);
                              }
                              setOpenDropdownId(null);
                            }}
                            disabled={actionLoading}
                            className={`w-full flex items-center gap-3 rounded-lg cursor-pointer px-5 py-3.5 text-sm font-medium transition ${
                              t.verified
                                ? "text-orange-600 hover:bg-orange-50 "
                                : "text-green-600 hover:bg-green-50 "
                            }`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            {t.verified ? "Unverify Taaskr" : "Verify Taaskr"}
                          </button>
                        )}
                        {hasPermission("taaskr.delete") && (
                          <>
                            <hr className="border-slate-200" />
                            <button
                              onClick={() => {
                                setDeleteId(t.id);
                                setShowDeleteConfirm(true);
                                setOpenDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Taaskr
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && selectedTaaskr && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Weekly Availability
                </h2>
                <p className="text-sm text-slate-600">
                  {selectedTaaskr.user?.full_name || "Taaskr"} (TK-
                  {selectedTaaskr.id})
                </p>
              </div>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {availLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {DAYS_ORDER.map((day) => {
                    const avail = getDayAvailability(day.key);
                    const isEditing = editingDay === day.key;
                    const [startTime, setStartTime] = useState(
                      avail?.start_time?.slice(0, 5) || "09:00"
                    );
                    const [endTime, setEndTime] = useState(
                      avail?.end_time?.slice(0, 5) || "18:00"
                    );

                    return (
                      <div
                        key={day.key}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg text-slate-900">
                            {day.label}
                          </h3>
                          {avail?.is_available ? (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                          ) : avail ? (
                            <AlertCircle className="w-6 h-6 text-orange-500" />
                          ) : (
                            <div className="w-6 h-6" />
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const start = startTime + ":00";
                                  const end = endTime + ":00";
                                  handleSaveDay(day.key, start, end, true);
                                }}
                                className="flex-1 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDay(null)}
                                className="px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : avail ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <span className="font-medium">
                                {avail.start_time.slice(0, 5)} -{" "}
                                {avail.end_time.slice(0, 5)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingDay(day.key)}
                                className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                              >
                                Edit Time
                              </button>
                              <button
                                onClick={() => handleDeleteDay(day.key)}
                                className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingDay(day.key)}
                            className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                          >
                            + Set Availability
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Add New Taaskr</h2>
              <button
                className="cursor-pointer"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddTaaskr} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma separated)
                </label>
                <input
                  name="skill_tags"
                  placeholder="e.g. Plumbing, Cleaning, Electrical"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Certifications (comma separated URLs)
                </label>
                <input
                  name="certification"
                  placeholder="e.g. https://example.com/cert1.pdf"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Add Taaskr"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTaaskr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Edit Taaskr</h2>
              <button
                className="cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditTaaskr} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  defaultValue={selectedTaaskr.user?.full_name || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={selectedTaaskr.user?.email || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  defaultValue={selectedTaaskr.user?.phone || ""}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  defaultValue={selectedTaaskr.bio || ""}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma separated)
                </label>
                <input
                  name="skill_tags"
                  defaultValue={selectedTaaskr.skill_tags?.join(", ") || ""}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Certifications (comma separated URLs)
                </label>
                <input
                  name="certification"
                  defaultValue={selectedTaaskr.certification?.join(", ") || ""}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Update Taaskr"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this Taaskr?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDeleteTaaskr}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Unverify Confirmation */}
      {showUnverifyConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Unverify Taaskr?
            </h2>

            <p className="text-sm text-slate-600 mb-4">
              This Taaskr may currently be assigned to active services or jobs.
              Unverifying can:
            </p>

            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-6">
              <li>Hide the Taaskr from verified listings</li>
              <li>Impact customer trust</li>
              <li>Restrict assignment to new services</li>
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUnverifyConfirm(false);
                  setPendingUnverifyId(null);
                }}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleVerifyTaaskr(pendingUnverifyId);
                  setShowUnverifyConfirm(false);
                  setPendingUnverifyId(null);
                }}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Yes, Unverify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showViewModal && selectedTaaskr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Taaskr Profile</h2>
              <button
                className="cursor-pointer"
                onClick={() => setShowViewModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p>
                <strong>Name:</strong> {selectedTaaskr.user?.full_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedTaaskr.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedTaaskr.user?.phone}
              </p>
              <p>
                <strong>Bio:</strong> {selectedTaaskr.bio || "—"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {selectedTaaskr.skill_tags?.join(", ") || "—"}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                {selectedTaaskr.rating_avg?.toFixed(1) || "N/A"}
              </p>
              <p>
                <strong>Total Jobs:</strong> {selectedTaaskr.total_jobs || 0}
              </p>
              <p>
                <strong>Verified:</strong>{" "}
                {selectedTaaskr.verified ? "Yes" : "No"}
              </p>
              <div>
                <strong>Certifications:</strong>
                {selectedTaaskr.certification?.length > 0 ? (
                  <ul className="list-disc pl-6 mt-2">
                    {selectedTaaskr.certification.map((cert, i) => (
                      <li key={i}>
                        <a
                          href={cert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {cert}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-slate-500">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

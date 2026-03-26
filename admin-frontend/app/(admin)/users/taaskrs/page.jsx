// app/users/taaskrs/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Loader2,
  ShieldCheck,
  Phone,
  Star,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";

export default function TaaskrsPage() {
  const { user, loading: authLoading, hasPermission } = useAuth();

  const [taaskrs, setTaaskrs] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedTaaskr, setSelectedTaaskr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [minRatingFilter, setMinRatingFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyForm, setVerifyForm] = useState({
    verified: false,
    verification_status: "pending",
    verification_note: "",
    documents_verified: false,
    bank_verified: false,
  });
  const dropdownRefs = useRef({});
  const toAbsoluteUrl = (value) => {
    if (!value) return null;
    if (value.startsWith("http")) return value;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${base}${value.startsWith("/") ? value : `/${value}`}`;
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

  useEffect(() => {
    if (!authLoading) {
      fetchTaaskrs();
      fetchServices();
    }
  }, [authLoading]);

  const fetchServices = async () => {
    try {
      const data = await apiFetch("/api/services/all-services/?page_size=200");
      const list = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
      setServices(list);
    } catch (err) {
      setServices([]);
    }
  };

  const getSkillLabel = (skill) => {
    const value = String(skill);
    const isNumeric = /^\d+$/.test(value);
    if (!isNumeric) return value;
    const match = services.find((s) => String(s.id) === value);
    return match?.name || value;
  };

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

  // VERIFY TAASKR (review modal)
  const openVerifyModal = async (taaskrId) => {
    setActionLoading(true);
    setVerifyError("");
    try {
      const data = await apiFetch(`/api/taaskr/admin/taaskrcrud/${taaskrId}/`);
      setSelectedTaaskr(data);
      setVerifyForm({
        verified: Boolean(data?.verified),
        verification_status: data?.verification_status || "pending",
        verification_note: data?.verification_note || "",
        documents_verified: Boolean(data?.documents_verified),
        bank_verified: Boolean(data?.bank_verified),
      });
      setShowVerifyModal(true);
    } catch (err) {
      alert("Failed to load verification data");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveVerification = async () => {
    if (!selectedTaaskr) return;
    setVerifyError("");

    const status = verifyForm.verification_status || "pending";
    const note = (verifyForm.verification_note || "").trim();

    if (status === "declined" && !note) {
      setVerifyError("Please add a reason when declining verification.");
      return;
    }

    let nextVerified = Boolean(verifyForm.verified);
    if (status === "approved") nextVerified = true;
    if (status === "declined") nextVerified = false;

    setActionLoading(true);
    try {
      const payload = {
        verified: nextVerified,
        verification_status: status,
        verification_note: note,
        documents_verified: Boolean(verifyForm.documents_verified),
        bank_verified: Boolean(verifyForm.bank_verified),
      };
      const updated = await apiFetch(
        `/api/taaskr/admin/taaskrcrud/${selectedTaaskr.id}/verify/`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      setTaaskrs((prev) =>
        prev.map((t) => (t.id === selectedTaaskr.id ? updated : t))
      );
      setSelectedTaaskr(updated);
      setShowVerifyModal(false);
    } catch (err) {
      setVerifyError(err.message || "Failed to save verification");
    } finally {
      setActionLoading(false);
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

  const selectedDocUrls = selectedTaaskr
    ? {
        government_id_image: toAbsoluteUrl(
          selectedTaaskr.government_id_image
        ),
        address_proof_image: toAbsoluteUrl(
          selectedTaaskr.address_proof_image
        ),
        profile_photo_image: toAbsoluteUrl(
          selectedTaaskr.profile_photo_image || selectedTaaskr.user?.profile_image
        ),
      }
    : {};

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
                className="relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
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
                        <div className="absolute top-3 -right-2 z-10">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white text-xs font-bold px-4 py-1 rotate-12 rounded shadow-lg">
                            ✓ VERIFIED
                          </div>
                        </div>
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
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.onboarding_completed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Onboarding {t.onboarding_completed ? "Completed" : "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.verification_status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : t.verification_status === "declined"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Verification {t.verification_status || "pending"}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.documents_verified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Docs {t.documents_verified ? "Verified" : "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          t.bank_verified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Bank {t.bank_verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.skill_tags?.length > 0 ? (
                        t.skill_tags.map((skill) => (
                          <span
                            key={String(skill)}
                            className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full"
                          >
                            {getSkillLabel(skill)}
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
                      {hasPermission("taaskr.profile.view") && (
                        <button
                          onClick={() => handleViewTaaskr(t.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                          View Profile
                        </button>
                      )}
                      <button
                        onClick={(e) => toggleDropdown(t.id, e)}
                        className="p-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition cursor-pointer"
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
                              openVerifyModal(t.id);
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
                            Review & Verify
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

      {/* Verify Modal */}
      {showVerifyModal && selectedTaaskr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold">Review & Verify</h2>
                <p className="text-sm text-slate-600">
                  {selectedTaaskr.user?.full_name || "Taaskr"} (TK-
                  {selectedTaaskr.id})
                </p>
              </div>
              <button
                className="cursor-pointer"
                onClick={() => setShowVerifyModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {verifyError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  {verifyError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">
                    {selectedTaaskr.user?.email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">
                    {selectedTaaskr.user?.phone || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">DOB:</span>
                  <span className="ml-2">{selectedTaaskr.dob || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium">Onboarding:</span>
                  <span className="ml-2">
                    {selectedTaaskr.onboarding_completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Service Areas
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTaaskr.service_areas?.length ? (
                    selectedTaaskr.service_areas.map((area) => (
                      <span
                        key={area.id}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700"
                      >
                        {area.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  {[
                    {
                      key: "government_id_image",
                      label: "Government ID",
                      url: selectedDocUrls.government_id_image,
                    },
                    {
                      key: "address_proof_image",
                      label: "Address Proof",
                      url: selectedDocUrls.address_proof_image,
                    },
                    {
                      key: "profile_photo_image",
                      label: "Profile Photo",
                      url: selectedDocUrls.profile_photo_image,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="border border-slate-200 rounded-xl p-3 bg-slate-50"
                    >
                      <p className="text-xs font-medium text-slate-700 mb-2">
                        {doc.label}
                      </p>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={doc.url}
                            alt={doc.label}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        </a>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-xs text-slate-500 border border-dashed rounded-lg">
                          Not provided
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Bank Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700 mt-2">
                  <div>
                    <span className="font-medium">Account Holder:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_account_holder_name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_account_number || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">IFSC:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_ifsc_code || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Bank Name:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Verification
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={verifyForm.verified}
                      onChange={(e) =>
                        setVerifyForm((prev) => ({
                          ...prev,
                          verified: e.target.checked,
                          verification_status: e.target.checked
                            ? "approved"
                            : prev.verification_status === "approved"
                              ? "pending"
                              : prev.verification_status,
                        }))
                      }
                      className="accent-orange-500"
                    />
                    Mark as Verified
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={verifyForm.documents_verified}
                      onChange={(e) =>
                        setVerifyForm((prev) => ({
                          ...prev,
                          documents_verified: e.target.checked,
                        }))
                      }
                      className="accent-orange-500"
                    />
                    Documents Verified
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={verifyForm.bank_verified}
                      onChange={(e) =>
                        setVerifyForm((prev) => ({
                          ...prev,
                          bank_verified: e.target.checked,
                        }))
                      }
                      className="accent-orange-500"
                    />
                    Bank Verified
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Verification Status
                    </label>
                    <select
                      value={verifyForm.verification_status}
                      onChange={(e) => {
                        const value = e.target.value;
                        setVerifyForm((prev) => ({
                          ...prev,
                          verification_status: value,
                          verified: value === "approved" ? true : value === "declined" ? false : prev.verified,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Verification Note (required if declined)
                  </label>
                  <textarea
                    rows={3}
                    value={verifyForm.verification_note}
                    onChange={(e) =>
                      setVerifyForm((prev) => ({
                        ...prev,
                        verification_note: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Explain what is missing or incorrect"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-white">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVerification}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Save Verification
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
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                  {selectedDocUrls.profile_photo_image ? (
                    <img
                      src={selectedDocUrls.profile_photo_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {selectedTaaskr.user?.full_name
                          ? selectedTaaskr.user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "TK"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {selectedTaaskr.user?.full_name || "Unnamed Taaskr"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedTaaskr.user?.email || "N/A"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedTaaskr.user?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <div>
                  <span className="font-medium">DOB:</span>
                  <span className="ml-2">{selectedTaaskr.dob || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium">Onboarding:</span>
                  <span className="ml-2">
                    {selectedTaaskr.onboarding_completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Verification Status:</span>
                  <span className="ml-2">
                    {selectedTaaskr.verification_status || "pending"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Verified:</span>
                  <span className="ml-2">
                    {selectedTaaskr.verified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Documents Verified:</span>
                  <span className="ml-2">
                    {selectedTaaskr.documents_verified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Bank Verified:</span>
                  <span className="ml-2">
                    {selectedTaaskr.bank_verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              {selectedTaaskr.verification_note && (
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Verification Note:</span>
                  <span className="ml-2">{selectedTaaskr.verification_note}</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bio</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedTaaskr.bio || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTaaskr.skill_tags?.length ? (
                    selectedTaaskr.skill_tags.map((skill) => (
                      <span
                        key={String(skill)}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-700"
                      >
                        {getSkillLabel(skill)}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Service Areas</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTaaskr.service_areas?.length ? (
                    selectedTaaskr.service_areas.map((area) => (
                      <span
                        key={area.id}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700"
                      >
                        {area.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bank Details</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700 mt-2">
                  <div>
                    <span className="font-medium">Account Holder:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_account_holder_name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span>
                    <span className="ml-2">
                      {selectedTaaskr.bank_account_number || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">IFSC:</span>
                    <span className="ml-2">{selectedTaaskr.bank_ifsc_code || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Bank Name:</span>
                    <span className="ml-2">{selectedTaaskr.bank_name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-medium">UPI ID:</span>
                    <span className="ml-2">{selectedTaaskr.bank_upi_id || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  {[
                    {
                      key: "government_id_image",
                      label: "Government ID",
                      url: selectedDocUrls.government_id_image,
                    },
                    {
                      key: "address_proof_image",
                      label: "Address Proof",
                      url: selectedDocUrls.address_proof_image,
                    },
                    {
                      key: "profile_photo_image",
                      label: "Profile Photo",
                      url: selectedDocUrls.profile_photo_image,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="border border-slate-200 rounded-xl p-3 bg-slate-50"
                    >
                      <p className="text-xs font-medium text-slate-700 mb-2">
                        {doc.label}
                      </p>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={doc.url}
                            alt={doc.label}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        </a>
                      ) : (
                        <div className="h-24 flex items-center justify-center text-xs text-slate-500 border border-dashed rounded-lg">
                          Not provided
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Certifications</h3>
                {selectedTaaskr.certification?.length > 0 ? (
                  <ul className="list-disc pl-6 mt-2 text-sm">
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
                  <p className="text-sm text-slate-500 mt-1">???</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

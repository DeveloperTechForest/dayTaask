// app/services/categories/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  GripVertical,
  Image as ImageIcon,
  X,
  CheckCircle,
  Circle,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const [iconFile, setIconFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showViewCategoryModal, setShowViewCategoryModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);

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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch("/api/services/admin/categories/");
      const list = Array.isArray(data) ? data : data.results || [];
      setCategories(list);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const formData = new FormData(e.target);

    const payload = new FormData();
    payload.append("name", formData.get("name"));
    payload.append("description", formData.get("description"));
    payload.append("is_active", formData.get("is_active") === "on");

    if (iconFile) {
      payload.append("icon", iconFile);
    }

    try {
      if (editCategory) {
        await apiFetch(`/api/services/admin/categories/${editCategory.id}/`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiFetch("/api/services/admin/categories/", {
          method: "POST",
          body: payload,
        });
      }
      setDialogOpen(false);
      setEditCategory(null);
      setIconFile(null);
      setPreview(null);
      fetchCategories();
    } catch (err) {
      alert("Failed to save category: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setActionLoading(true);
    try {
      await apiFetch(`/api/services/admin/categories/${id}/`, {
        method: "DELETE",
      });
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const fd = new FormData();
      fd.append("is_active", (!currentStatus).toString());

      await apiFetch(`/api/services/admin/categories/${id}/`, {
        method: "PATCH",
        body: fd,
      });

      fetchCategories();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleViewCategory = (cat) => {
    setViewCategory(cat);
    setShowViewCategoryModal(true);
    setOpenDropdownId(null);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
        <button
          onClick={fetchCategories}
          className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Service Categories
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Organize your services into categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditCategory(null);
            setIconFile(null);
            setPreview(null);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2.5 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-20">
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Id & Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Icon
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Description
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
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const isOpen = openDropdownId === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-50/70 transition-all duration-150"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg font-mono text-xs">
                            {cat.id}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {cat.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300">
                          {cat.icon ? (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {cat.description || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            handleToggleActive(cat.id, cat.is_active)
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition"
                        >
                          {cat.is_active ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700">Active</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600">Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {new Date(cat.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="relative flex justify-end">
                          <button
                            onClick={(e) => toggleDropdown(cat.id, e)}
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>

                          {isOpen && (
                            <div
                              ref={(el) => (dropdownRefs.current[cat.id] = el)}
                              className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                            >
                              <button
                                onClick={() => handleViewCategory(cat)}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Eye className="w-4 h-4" />
                                View Category
                              </button>
                              <button
                                onClick={() => {
                                  setEditCategory(cat);
                                  setPreview(cat.icon || null);
                                  setDialogOpen(true);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Category
                              </button>
                              <hr className="border-slate-200" />
                              <button
                                onClick={() => {
                                  handleDeleteCategory(cat.id);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Category
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
            Showing <strong>{filteredCategories.length}</strong> of{" "}
            <strong>{categories.length}</strong> categories
          </p>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {editCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => {
                  setDialogOpen(false);
                  setEditCategory(null);
                  setIconFile(null);
                  setPreview(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editCategory?.name || ""}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Icon (Recommended: 128x128 PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                  {(preview || editCategory?.icon) && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2">
                        Current Icon:
                      </p>
                      <img
                        src={preview || editCategory?.icon}
                        alt="Icon preview"
                        className="w-32 h-32 object-contain rounded-lg border border-slate-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={editCategory?.description || ""}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={
                      editCategory ? editCategory.is_active : true
                    }
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Publish category immediately
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditCategory(null);
                      setIconFile(null);
                      setPreview(null);
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
                    ) : editCategory ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewCategoryModal && viewCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Category Details – {viewCategory.name}
              </h2>
              <button
                onClick={() => setShowViewCategoryModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Icon
                  </p>
                  {viewCategory.icon ? (
                    <img
                      src={viewCategory.icon}
                      alt={viewCategory.name}
                      className="w-32 h-32 object-contain rounded-xl border border-slate-300"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Name
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {viewCategory.name}
                  </p>

                  <p className="text-sm font-medium text-slate-600 mt-4 mb-2">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      viewCategory.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {viewCategory.is_active ? "Active" : "Inactive"}
                  </span>

                  <p className="text-sm font-medium text-slate-600 mt-4 mb-2">
                    Created
                  </p>
                  <p className="text-slate-700">
                    {new Date(viewCategory.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Description
                </p>
                <p className="text-slate-700">
                  {viewCategory.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

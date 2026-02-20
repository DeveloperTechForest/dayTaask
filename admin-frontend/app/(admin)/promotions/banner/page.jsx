"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  MoreVertical,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  GripVertical,
  XCircle,
  CheckCircle,
  Edit,
  Copy,
  EyeOff,
  Eye as EyeIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

const mockBanners = [
  {
    id: "BNR-001",
    title: "Summer Sale - 30% Off",
    imageUrl:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format",
    link: "/promotions/summer",
    position: "home_hero",
    priority: 1,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    isActive: false, // expired example
    clicks: 1234,
    impressions: 45000,
  },
  {
    id: "BNR-002",
    title: "Monsoon Cleaning Special",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731545-6d0a9e2d8e4a?w=1200&auto=format",
    link: "/categories/cleaning",
    position: "category_top",
    priority: 2,
    startDate: "2025-06-01",
    endDate: "2025-09-30",
    isActive: true,
    clicks: 920,
    impressions: 28500,
  },
  {
    id: "BNR-003",
    title: "New User Welcome Bonus",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format",
    link: "/signup",
    position: "home_hero",
    priority: 3,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    isActive: true,
    clicks: 1450,
    impressions: 98000,
  },
  // Add more as needed
];

function getPositionLabel(pos) {
  const map = {
    home_hero: "Home Hero",
    home_middle: "Home Middle",
    category_top: "Category Top",
    checkout: "Checkout",
  };
  return map[pos] || pos;
}

function getStatusConfig(isActive, endDate) {
  const expired = new Date(endDate) < new Date();
  if (expired) return { bg: "slate", text: "slate", label: "Expired" };
  if (isActive) return { bg: "emerald", text: "emerald", label: "Active" };
  return { bg: "yellow", text: "yellow", label: "Paused" };
}

function calculateCTR(clicks, impressions) {
  return impressions > 0
    ? ((clicks / impressions) * 100).toFixed(2) + "%"
    : "0.00%";
}

export default function BannerAdsPage() {
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [previewBanner, setPreviewBanner] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // for dropdown control

  const filteredBanners = mockBanners.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesPosition =
      positionFilter === "all" || b.position === positionFilter;
    const expired = new Date(b.endDate) < new Date();
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "active") matchesStatus = b.isActive && !expired;
    if (statusFilter === "paused") matchesStatus = !b.isActive && !expired;
    if (statusFilter === "expired") matchesStatus = expired;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const stats = {
    active: mockBanners.filter(
      (b) => b.isActive && new Date(b.endDate) >= new Date()
    ).length,
    impressions: mockBanners.reduce((sum, b) => sum + b.impressions, 0),
    clicks: mockBanners.reduce((sum, b) => sum + b.clicks, 0),
  };
  stats.ctr =
    stats.impressions > 0
      ? ((stats.clicks / stats.impressions) * 100).toFixed(2) + "%"
      : "0.00%";

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Banner Ads
          </h1>
          <p className="text-slate-600 mt-1">
            Manage promotional visuals • {filteredBanners.length} banners
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Active Banners</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {stats.active}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Impressions</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.impressions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Clicks</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats.clicks.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Average CTR</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.ctr}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center">
          <div className="flex flex-1 gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search banners..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="h-11 px-4 pr-10 border border-slate-200 rounded-xl text-sm min-w-[160px]"
            >
              <option value="all">All Positions</option>
              <option value="home_hero">Home Hero</option>
              <option value="home_middle">Home Middle</option>
              <option value="category_top">Category Top</option>
              <option value="checkout">Checkout</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 pr-10 border border-slate-200 rounded-xl text-sm min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${
                  viewMode === "grid"
                    ? "bg-orange-50 text-orange-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 border-l border-slate-200 ${
                  viewMode === "list"
                    ? "bg-orange-50 text-orange-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm"
            >
              <Plus size={18} />
              New Banner
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner) => {
            const status = getStatusConfig(banner.isActive, banner.endDate);

            return (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow transition-shadow group relative"
              >
                <div className="relative aspect-[5/2] bg-slate-50">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Preview overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setPreviewBanner(banner)}
                      className="px-6 py-3 bg-white/95 hover:bg-white rounded-lg text-sm font-medium shadow flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-${status.bg}-100 text-${status.text}-700`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Three-dot menu */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(banner.id);
                      }}
                      className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={18} className="text-slate-700" />
                    </button>

                    {openMenuId === banner.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                            <Edit size={16} />
                            Edit
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                            <Copy size={16} />
                            Duplicate
                          </button>

                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                            {banner.isActive ? (
                              <>
                                <EyeOff size={16} />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <EyeIcon size={16} />
                                Activate
                              </>
                            )}
                          </button>

                          <hr className="border-slate-200" />

                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                            <ArrowUp size={16} />
                            Move Up
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                            <ArrowDown size={16} />
                            Move Down
                          </button>

                          <hr className="border-slate-200" />

                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm">
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">
                    {banner.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5">
                    {getPositionLabel(banner.position)} • Priority{" "}
                    {banner.priority}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>
                      {new Date(banner.startDate).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(banner.endDate).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-semibold">
                        {banner.impressions.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">Impressions</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {banner.clicks.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">Clicks</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-emerald-600">
                        {calculateCTR(banner.clicks, banner.impressions)}
                      </p>
                      <p className="text-xs text-slate-500">CTR</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          List view coming soon...
        </div>
      )}

      {/* Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Banner Preview</h2>
              <button onClick={() => setPreviewBanner(null)}>
                <XCircle
                  size={24}
                  className="text-slate-500 hover:text-slate-700"
                />
              </button>
            </div>
            <div className="p-6">
              <img
                src={previewBanner.imageUrl}
                alt={previewBanner.title}
                className="w-full rounded-xl shadow-sm"
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="text-slate-500">Title</p>
                  <p className="font-medium mt-1">{previewBanner.title}</p>
                </div>
                <div>
                  <p className="text-slate-500">Position</p>
                  <p className="font-medium mt-1">
                    {getPositionLabel(previewBanner.position)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <p className="font-medium mt-1">{previewBanner.priority}</p>
                </div>
                <div>
                  <p className="text-slate-500">CTR</p>
                  <p className="font-medium text-emerald-600 mt-1">
                    {calculateCTR(
                      previewBanner.clicks,
                      previewBanner.impressions
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal - placeholder */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Banner</h2>
              <button onClick={() => setCreateOpen(false)}>
                <XCircle
                  size={24}
                  className="text-slate-500 hover:text-slate-700"
                />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="e.g. Diwali Special Offer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <p className="text-slate-600">Click or drag to upload</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-6 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center gap-2">
                <CheckCircle size={18} />
                Create Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// app/promotions/coupons/page.jsx
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Copy,
  Pause,
  Play,
  Sparkles,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Tag,
  ChevronDown,
  XCircle,
} from "lucide-react";

const coupons = [
  {
    id: "CPN-001",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    maxDiscount: 50,
    minCartValue: 100,
    usageLimit: 1000,
    usedCount: 456,
    usageLimitPerUser: 1,
    validFrom: "2024-01-01",
    validTo: "2024-03-31",
    applicableServices: ["All Services"],
    applicableCategories: ["All Categories"],
    status: "active",
    createdAt: "2024-01-01T10:00:00",
  },
  {
    id: "CPN-002",
    code: "FLAT50",
    type: "flat",
    value: 50,
    maxDiscount: null,
    minCartValue: 200,
    usageLimit: 500,
    usedCount: 234,
    usageLimitPerUser: 2,
    validFrom: "2024-01-15",
    validTo: "2024-02-28",
    applicableServices: ["Deep Cleaning", "AC Service"],
    applicableCategories: ["Home Services"],
    status: "active",
    createdAt: "2024-01-15T14:30:00",
  },
  {
    id: "CPN-003",
    code: "SUMMER30",
    type: "percentage",
    value: 30,
    maxDiscount: 100,
    minCartValue: 150,
    usageLimit: 2000,
    usedCount: 1890,
    usageLimitPerUser: 1,
    validFrom: "2023-06-01",
    validTo: "2023-08-31",
    applicableServices: ["All Services"],
    applicableCategories: ["All Categories"],
    status: "expired",
    createdAt: "2023-06-01T09:00:00",
  },
  {
    id: "CPN-004",
    code: "VIP25",
    type: "percentage",
    value: 25,
    maxDiscount: 75,
    minCartValue: 100,
    usageLimit: 100,
    usedCount: 45,
    usageLimitPerUser: 5,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    applicableServices: ["Premium Cleaning"],
    applicableCategories: ["Premium Services"],
    status: "paused",
    createdAt: "2024-01-01T12:00:00",
  },
  {
    id: "CPN-005",
    code: "NEWYEAR10",
    type: "flat",
    value: 10,
    maxDiscount: null,
    minCartValue: 50,
    usageLimit: 5000,
    usedCount: 3421,
    usageLimitPerUser: 3,
    validFrom: "2024-01-01",
    validTo: "2024-01-31",
    applicableServices: ["All Services"],
    applicableCategories: ["All Categories"],
    status: "expired",
    createdAt: "2023-12-25T08:00:00",
  },
];

const getStatusConfig = (status) => {
  const map = {
    active: { bg: "emerald", text: "emerald" },
    paused: { bg: "yellow", text: "yellow" },
    expired: { bg: "slate", text: "slate" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

const generateCouponCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const formatDate = (dateString, formatType) => {
  const date = new Date(dateString);
  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (formatType === "MMM d") {
    return `${monthNamesShort[date.getMonth()]} ${date.getDate()}`;
  } else if (formatType === "MMM d, yyyy") {
    return `${monthNamesShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  return date.toLocaleDateString();
};

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const totalActive = coupons.filter((c) => c.status === "active").length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0);
  const totalDiscounts = 12450; // Mocked
  const avgDiscount = 18; // Mocked

  const filtered = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage discount coupons and promotional codes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Tag className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{totalActive}</p>
              <p className="text-sm text-slate-600">Active Coupons</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {totalRedemptions.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total Redemptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <DollarSign className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                ${totalDiscounts.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Discounts Given</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Percent className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {avgDiscount}%
              </p>
              <p className="text-sm text-slate-600">Avg Discount Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coupons..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-5 h-5" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Type & Value
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Usage
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Min Cart
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Validity
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Applicable To
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
              {filtered.map((c) => {
                const status = getStatusConfig(c.status);
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Tag className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-mono text-orange-600 font-semibold">
                            {c.code}
                          </p>
                          <p className="text-xs text-slate-500">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {c.type === "percentage" ? (
                          <Percent className="w-4 h-4 text-blue-600" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        )}
                        <div>
                          <p className="font-medium text-slate-700">
                            {c.type === "percentage"
                              ? `${c.value}%`
                              : `$${c.value}`}
                          </p>
                          {c.maxDiscount && (
                            <p className="text-xs text-slate-500">
                              Max: ${c.maxDiscount}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <div className="flex items-center gap-1 text-sm text-slate-700">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span className="font-medium">{c.usedCount}</span>
                          <span className="text-slate-500">
                            / {c.usageLimit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-orange-500 h-1.5 rounded-full"
                            style={{
                              width: `${(c.usedCount / c.usageLimit) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.usageLimitPerUser}/user
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      ${c.minCartValue}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-sm text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(c.validFrom, "MMM d")}</span>
                        <span className="text-slate-500">-</span>
                        <span>{formatDate(c.validTo, "MMM d, yyyy")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-[150px]">
                        <p className="text-sm text-slate-700 truncate">
                          {c.applicableServices.join(", ")}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {c.applicableCategories.join(", ")}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === c.id ? null : c.id)
                          }
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>
                        {dropdownOpen === c.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setDropdownOpen(null)}
                            />
                            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </button>
                              {c.status === "active" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-yellow-50 text-yellow-600 text-sm font-medium transition">
                                  <Pause className="w-4 h-4" />
                                  Pause
                                </button>
                              )}
                              {c.status === "paused" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 text-emerald-600 text-sm font-medium transition">
                                  <Play className="w-4 h-4" />
                                  Activate
                                </button>
                              )}
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                <Download className="w-4 h-4" />
                                Export Usage
                              </button>
                              <hr className="border-slate-200" />
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <p className="text-sm text-slate-600">
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{coupons.length}</strong> coupons
          </p>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Create New Coupon
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Coupon Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., SUMMER20"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition font-mono"
                    />
                    <button
                      onClick={() => setCouponCode(generateCouponCode())}
                      className="flex items-center justify-center w-12 h-12 border border-slate-300 hover:bg-slate-50 rounded-xl transition"
                    >
                      <Sparkles className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Discount Type
                  </p>
                  <div className="relative">
                    <select
                      defaultValue="percentage"
                      className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount ($)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Discount Value
                  </p>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Max Discount ($)
                  </p>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Min Cart Value ($)
                  </p>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Valid From
                  </p>
                  <input
                    type="date"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Valid To</p>
                  <input
                    type="date"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Total Usage Limit
                  </p>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Per User Limit
                  </p>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Applicable Services
                  </p>
                  <div className="relative">
                    <select
                      defaultValue="all"
                      className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full"
                    >
                      <option value="all">All Services</option>
                      <option value="cleaning">Cleaning Services</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Applicable Categories
                  </p>
                  <div className="relative">
                    <select
                      defaultValue="all"
                      className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full"
                    >
                      <option value="all">All Categories</option>
                      <option value="home">Home Services</option>
                      <option value="premium">Premium Services</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Description (Optional)
                </p>
                <textarea
                  placeholder="Describe the coupon promotion..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Active Status
                  </p>
                  <p className="text-xs text-slate-500">
                    Enable to make coupon active immediately
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// app/dashboard/page.jsx
"use client";

import {
  Plus,
  TrendingUp,
  Download,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  UserPlus,
  AlertTriangle,
  CreditCard,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [actionOpen, setActionOpen] = useState(false);

  const stats = [
    {
      label: "Total Customers",
      value: "12,847",
      change: "+12.5% from last month",
      positive: true,
      icon: Users,
    },
    {
      label: "Active Taaskrs",
      value: "1,234",
      change: "+8.2% from last month",
      positive: true,
      icon: UserCheck,
    },
    {
      label: "Active Bookings",
      value: "156",
      change: "23 in progress",
      neutral: true,
      icon: Calendar,
    },
    {
      label: "Revenue (7d)",
      value: "₹4,52,340",
      change: "+18.3% from last week",
      positive: true,
      icon: DollarSign,
    },
  ];

  const secondary = [
    { label: "New Signups (24h)", value: "48", icon: UserPlus },
    {
      label: "Pending KYC",
      value: "23",
      change: "Requires action",
      warning: true,
      icon: AlertTriangle,
    },
    {
      label: "Open Disputes",
      value: "7",
      change: "3 high priority",
      warning: true,
      icon: AlertTriangle,
    },
    {
      label: "Pending Payouts",
      value: "₹1,24,500",
      change: "12 taaskrs",
      icon: CreditCard,
    },
  ];

  const topServices = [
    { name: "Home Cleaning", value: 245 },
    { name: "Plumbing", value: 189 },
    { name: "Electrical", value: 156 },
    { name: "AC Service", value: 134 },
    { name: "Painting", value: 98 },
  ];

  const activity = [
    { text: "New booking #BK-4521 created", time: "2 min ago" },
    { text: "John Doe registered as customer", time: "5 min ago" },
    { text: "Payment received for #BK-4518", time: "12 min ago" },
    { text: "Mike Smith completed job #BK-4515", time: "18 min ago" },
    { text: "New booking #BK-4520 created", time: "25 min ago" },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time snapshot of platform health
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Actions */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition shadow-sm">
            <Plus className="w-4 h-4" />
            Create Service
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition">
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>

          {/* Date Range + Export */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition">
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Action Dropdown - Exactly like DayTaask */}
          <div className="relative">
            <button
              onClick={() => setActionOpen(!actionOpen)}
              className="p-2.5 rounded-lg hover:bg-slate-100 transition"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>

            {actionOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                  Refresh Data
                </button>
                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                  Schedule Report
                </button>
                <button className="w-full text-left px-5 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                  Export as PDF
                </button>
                <hr className="border-slate-200" />
                <button className="w-full text-left px-5 py-3 hover:bg-red-50 text-sm font-medium text-red-600 transition">
                  Clear Cache
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                  <p
                    className={`text-sm flex items-center gap-1.5 font-medium ${
                      s.positive ? "text-emerald-600" : "text-slate-500"
                    }`}
                  >
                    {s.positive && <TrendingUp className="w-4 h-4" />}
                    {s.change}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {secondary.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  {s.warning && (
                    <p className="text-sm font-semibold text-orange-600">
                      {s.change}
                    </p>
                  )}
                  {!s.warning && s.change && (
                    <p className="text-xs text-slate-500">{s.change}</p>
                  )}
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    s.warning ? "bg-orange-50" : "bg-orange-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      s.warning ? "text-orange-600" : "text-orange-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bookings & Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Bookings & Revenue
            </h3>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-slate-600">Bookings</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-slate-600">Revenue</span>
              </span>
            </div>
          </div>
          <div className="h-72 bg-gradient-to-br from-orange-50/70 via-transparent to-transparent rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent bottom-0"></div>
            <svg className="w-full h-full" viewBox="0 0 900 280">
              <path
                d="M0 240 Q120 160 280 150 Q450 130 620 160 Q750 140 900 180"
                fill="none"
                stroke="url(#revenue)"
                strokeWidth="4"
                className="drop-shadow-sm"
              />
              <path
                d="M0 240 Q120 160 280 150 Q450 130 620 160 Q750 140 900 180 L900 280 L0 280 Z"
                fill="url(#revenue-fill)"
                opacity="0.12"
              />
              <defs>
                <linearGradient id="revenue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FF8B60" />
                </linearGradient>
                <linearGradient id="revenue-fill">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.2" />
                  <stop offset="100%" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-5 left-8 right-8 flex justify-between text-sm text-slate-500 font-medium">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-5">
            Payment Methods
          </h3>
          <div className="flex justify-center">
            <div
              className="w-52 h-52 rounded-full relative shadow-lg"
              style={{
                background: `conic-gradient(#FF6B35 0% 45%, #3B82F6 45% 80%, #10B981 80% 95%, #8B5CF6 95% 100%)`,
              }}
            >
              <div className="absolute inset-8 bg-white rounded-full shadow-inner"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">68%</span>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {[
              { name: "Card", pct: "45%", color: "bg-orange-500" },
              { name: "UPI", pct: "35%", color: "bg-blue-500" },
              { name: "Wallet", pct: "15%", color: "bg-emerald-500" },
              { name: "Cash", pct: "5%", color: "bg-purple-500" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-slate-600 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-slate-900">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-5">
            Top Services
          </h3>
          <div className="space-y-4">
            {topServices.map((s, i) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {s.name}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {s.value}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700"
                      style={{ width: `${(s.value / 245) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h3>
            <button className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition">
              View all →
            </button>
          </div>
          <div className="space-y-5">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{a.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

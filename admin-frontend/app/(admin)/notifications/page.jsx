// app/notifications/page.jsx
"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Send,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

const pushTemplates = [
  {
    id: "PT-001",
    name: "Booking Confirmed",
    trigger: "booking_confirmed",
    title: "Booking Confirmed! 🎉",
    body: "Your booking #{booking_id} is confirmed for {date}",
    active: true,
  },
  {
    id: "PT-002",
    name: "Taaskr Assigned",
    trigger: "taaskr_assigned",
    title: "Taaskr on the way!",
    body: "{taaskr_name} will arrive at {time}",
    active: true,
  },
  {
    id: "PT-003",
    name: "Service Completed",
    trigger: "service_completed",
    title: "Service Complete ✅",
    body: "How was your experience? Rate now!",
    active: true,
  },
  {
    id: "PT-004",
    name: "Payment Reminder",
    trigger: "payment_pending",
    title: "Payment Pending",
    body: "Complete payment for booking #{booking_id}",
    active: false,
  },
];

const emailTemplates = [
  {
    id: "ET-001",
    name: "Welcome Email",
    trigger: "user_signup",
    subject: "Welcome to DayTaask!",
    active: true,
    lastEdited: "2024-01-15",
  },
  {
    id: "ET-002",
    name: "Booking Confirmation",
    trigger: "booking_confirmed",
    subject: "Your Booking is Confirmed",
    active: true,
    lastEdited: "2024-01-10",
  },
  {
    id: "ET-003",
    name: "Invoice",
    trigger: "payment_success",
    subject: "Invoice for Booking #{booking_id}",
    active: true,
    lastEdited: "2024-01-08",
  },
  {
    id: "ET-004",
    name: "Password Reset",
    trigger: "password_reset",
    subject: "Reset Your Password",
    active: true,
    lastEdited: "2024-01-05",
  },
  {
    id: "ET-005",
    name: "Review Request",
    trigger: "service_completed",
    subject: "How was your experience?",
    active: false,
    lastEdited: "2024-01-01",
  },
];

const notificationHistory = [
  {
    id: "NH-001",
    type: "push",
    recipient: "john@example.com",
    title: "Booking Confirmed",
    status: "delivered",
    sentAt: "2024-01-16T10:30:00",
  },
  {
    id: "NH-002",
    type: "email",
    recipient: "jane@example.com",
    title: "Welcome to DayTaask!",
    status: "delivered",
    sentAt: "2024-01-16T10:15:00",
  },
  {
    id: "NH-003",
    type: "push",
    recipient: "mike@example.com",
    title: "Taaskr on the way!",
    status: "delivered",
    sentAt: "2024-01-16T09:45:00",
  },
  {
    id: "NH-004",
    type: "email",
    recipient: "sarah@example.com",
    title: "Invoice for Booking #1234",
    status: "failed",
    sentAt: "2024-01-16T09:30:00",
  },
  {
    id: "NH-005",
    type: "push",
    recipient: "alex@example.com",
    title: "Service Complete",
    status: "delivered",
    sentAt: "2024-01-16T09:00:00",
  },
  {
    id: "NH-006",
    type: "email",
    recipient: "emma@example.com",
    title: "Your Booking is Confirmed",
    status: "pending",
    sentAt: "2024-01-16T08:45:00",
  },
];

const getStatusConfig = (status) => {
  const map = {
    delivered: { bg: "emerald", text: "emerald" },
    failed: { bg: "red", text: "red" },
    pending: { bg: "yellow", text: "yellow" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
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
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("push");
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const filteredHistory = notificationHistory.filter((n) => {
    const matchesSearch =
      n.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      historyFilter === "all" ||
      n.type === historyFilter ||
      n.status === historyFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage notification templates and view delivery history
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Send className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">12,450</p>
              <p className="text-sm text-slate-600">Sent Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">98.5%</p>
              <p className="text-sm text-slate-600">Delivery Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Smartphone className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {pushTemplates.filter((t) => t.active).length}
              </p>
              <p className="text-sm text-slate-600">Active Push</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Mail className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {emailTemplates.filter((t) => t.active).length}
              </p>
              <p className="text-sm text-slate-600">Active Email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70">
          <button
            onClick={() => setActiveTab("push")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider ${
              activeTab === "push"
                ? "bg-white border-t-2 border-orange-500"
                : "hover:bg-slate-100"
            } transition`}
          >
            <Smartphone className="w-4 h-4" /> Push Templates
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider ${
              activeTab === "email"
                ? "bg-white border-t-2 border-orange-500"
                : "hover:bg-slate-100"
            } transition`}
          >
            <Mail className="w-4 h-4" /> Email Templates
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider ${
              activeTab === "history"
                ? "bg-white border-t-2 border-orange-500"
                : "hover:bg-slate-100"
            } transition`}
          >
            <Clock className="w-4 h-4" /> History
          </button>
        </div>

        {/* Push Templates Content */}
        {activeTab === "push" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <button
                onClick={() => setPushModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
              >
                <Plus className="w-5 h-5" /> New Template
              </button>
            </div>
            <div className="space-y-4">
              {pushTemplates.map((template) => {
                const status = template.active
                  ? getStatusConfig("delivered")
                  : getStatusConfig("failed");
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <Smartphone className="w-7 h-7 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {template.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                            >
                              {template.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Trigger: {template.trigger}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="font-medium text-slate-900">
                            {template.title}
                          </p>
                          <p className="text-sm text-slate-600 truncate max-w-xs">
                            {template.body}
                          </p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === template.id
                                  ? null
                                  : template.id,
                              )
                            }
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>
                          {dropdownOpen === template.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(null)}
                              />
                              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Copy className="w-4 h-4" /> Duplicate
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Send className="w-4 h-4" /> Test Send
                                </button>
                                <hr className="border-slate-200" />
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Email Templates Content */}
        {activeTab === "email" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <button
                onClick={() => setEmailModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
              >
                <Plus className="w-5 h-5" /> New Template
              </button>
            </div>
            <div className="space-y-4">
              {emailTemplates.map((template) => {
                const status = template.active
                  ? getStatusConfig("delivered")
                  : getStatusConfig("failed");
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <Mail className="w-7 h-7 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {template.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                            >
                              {template.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            Trigger: {template.trigger}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="font-medium text-slate-900">
                            {template.subject}
                          </p>
                          <p className="text-sm text-slate-600">
                            Last edited: {template.lastEdited}
                          </p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === template.id
                                  ? null
                                  : template.id,
                              )
                            }
                            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>
                          {dropdownOpen === template.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(null)}
                              />
                              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Copy className="w-4 h-4" /> Duplicate
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <Send className="w-4 h-4" /> Test Send
                                </button>
                                <hr className="border-slate-200" />
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Content */}
        {activeTab === "history" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="relative flex-1">
                <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by recipient or title..."
                  className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="relative w-40">
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full"
                >
                  <option value="all">All</option>
                  <option value="push">Push Only</option>
                  <option value="email">Email Only</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="scrollbar overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((n) => {
                    const status = getStatusConfig(n.status);
                    return (
                      <tr
                        key={n.id}
                        className="hover:bg-slate-50/70 transition-all duration-150"
                      >
                        <td className="px-6 py-5">
                          {n.type === "push" ? (
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Smartphone className="w-4 h-4 text-purple-600" />
                              Push
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail className="w-4 h-4 text-orange-600" />
                              Email
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-700">
                          {n.recipient}
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700">
                          {n.title}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                          >
                            {n.status.charAt(0).toUpperCase() +
                              n.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(n.sentAt)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                              <Eye className="w-5 h-5 text-slate-600" />
                            </button>
                            {n.status === "failed" && (
                              <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                                <Send className="w-5 h-5 text-slate-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Push Modal */}
      {pushModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Push Template
              </h2>
              <button
                onClick={() => setPushModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Template Name
                </p>
                <input
                  type="text"
                  placeholder="e.g., Booking Reminder"
                  className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Trigger Event
                </p>
                <div className="relative">
                  <select className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full">
                    <option value="">Select trigger</option>
                    <option value="booking_confirmed">Booking Confirmed</option>
                    <option value="taaskr_assigned">Taaskr Assigned</option>
                    <option value="service_completed">Service Completed</option>
                    <option value="payment_pending">Payment Pending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Notification Title
                </p>
                <input
                  type="text"
                  placeholder="e.g., Your booking is confirmed!"
                  className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Notification Body
                </p>
                <textarea
                  placeholder="Use {variable} for dynamic content"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Active</p>
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
                onClick={() => setPushModalOpen(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Email Template
              </h2>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Template Name
                  </p>
                  <input
                    type="text"
                    placeholder="e.g., Welcome Email"
                    className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Trigger Event
                  </p>
                  <div className="relative">
                    <select className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-full">
                      <option value="">Select trigger</option>
                      <option value="user_signup">User Signup</option>
                      <option value="booking_confirmed">
                        Booking Confirmed
                      </option>
                      <option value="payment_success">Payment Success</option>
                      <option value="password_reset">Password Reset</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Email Subject
                </p>
                <input
                  type="text"
                  placeholder="e.g., Welcome to DayTaask!"
                  className="w-full h-12 px-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Email Body (HTML)
                </p>
                <textarea
                  placeholder="Enter HTML email content..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition font-mono text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Active</p>
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
                onClick={() => setEmailModalOpen(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

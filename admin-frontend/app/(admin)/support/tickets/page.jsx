// app/support/tickets/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  UserPlus,
  MessageSquare,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

const tickets = [
  {
    id: "TKT-001",
    customer: { name: "John Smith", email: "john@example.com" },
    subject: "Unable to book a service",
    priority: "high",
    status: "open",
    assignedAgent: null,
    createdAt: "2024-01-15T10:30:00",
    lastReply: "2024-01-15T10:30:00",
    slaDeadline: "2024-01-15T14:30:00",
    isBreached: false,
  },
  {
    id: "TKT-002",
    customer: { name: "Sarah Wilson", email: "sarah@example.com" },
    subject: "Payment not reflecting in account",
    priority: "urgent",
    status: "in_progress",
    assignedAgent: "Support Agent 1",
    createdAt: "2024-01-14T14:20:00",
    lastReply: "2024-01-15T09:00:00",
    slaDeadline: "2024-01-14T16:20:00",
    isBreached: true,
  },
  {
    id: "TKT-003",
    customer: { name: "Robert Brown", email: "robert@example.com" },
    subject: "How to reschedule my booking?",
    priority: "low",
    status: "waiting",
    assignedAgent: "Support Agent 2",
    createdAt: "2024-01-13T09:15:00",
    lastReply: "2024-01-14T11:00:00",
    slaDeadline: "2024-01-14T09:15:00",
    isBreached: true,
  },
  {
    id: "TKT-004",
    customer: { name: "Lisa Anderson", email: "lisa@example.com" },
    subject: "Feedback on recent service",
    priority: "medium",
    status: "resolved",
    assignedAgent: "Support Agent 1",
    createdAt: "2024-01-12T16:45:00",
    lastReply: "2024-01-13T10:30:00",
    slaDeadline: "2024-01-13T16:45:00",
    isBreached: false,
  },
  {
    id: "TKT-005",
    customer: { name: "Michael Chen", email: "michael@example.com" },
    subject: "Request for invoice copy",
    priority: "low",
    status: "closed",
    assignedAgent: "Support Agent 3",
    createdAt: "2024-01-11T08:00:00",
    lastReply: "2024-01-11T14:00:00",
    slaDeadline: "2024-01-12T08:00:00",
    isBreached: false,
  },
];

const getPriorityConfig = (priority) => {
  const map = {
    urgent: { bg: "red", text: "red" },
    high: { bg: "orange", text: "orange" },
    medium: { bg: "yellow", text: "yellow" },
    low: { bg: "emerald", text: "emerald" },
  };
  return map[priority] || { bg: "slate", text: "slate" };
};

const getStatusConfig = (status) => {
  const map = {
    open: { bg: "yellow", text: "yellow" },
    in_progress: { bg: "blue", text: "blue" },
    waiting: { bg: "slate", text: "slate" },
    resolved: { bg: "emerald", text: "emerald" },
    closed: { bg: "slate", text: "slate" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

export default function TicketsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalOpen = tickets.filter((t) => t.status === "open").length;
  const totalInProgress = tickets.filter(
    (t) => t.status === "in_progress",
  ).length;
  const totalBreached = tickets.filter((t) => t.isBreached).length;
  const totalResolved = tickets.filter((t) => t.status === "resolved").length;

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getSLAStatus = (ticket) => {
    if (ticket.status === "closed" || ticket.status === "resolved") {
      return ticket.isBreached ? (
        <span className="text-xs text-red-600">Breached</span>
      ) : (
        <span className="text-xs text-emerald-600">Met</span>
      );
    }

    const deadline = new Date(ticket.slaDeadline);
    const now = new Date();
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (ticket.isBreached || hoursLeft < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs">Breached</span>
        </div>
      );
    }

    if (hoursLeft < 2) {
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{Math.round(hoursLeft * 60)}m left</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-slate-500">
        <Clock className="w-3 h-3" />
        <span className="text-xs">{Math.round(hoursLeft)}h left</span>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage customer support requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-7 h-7 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Open Tickets</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{totalOpen}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalInProgress}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">SLA Breached</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {totalBreached}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Resolved Today</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {totalResolved}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting">Waiting</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button
              onClick={() => router.push("/support/templates")}
              className="flex items-center gap-2.5 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm"
            >
              Quick Replies
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  SLA
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Last Reply
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const priority = getPriorityConfig(t.priority);
                const status = getStatusConfig(t.status);

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <p className="font-mono text-orange-600 font-semibold">
                        {t.id}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">
                          {t.customer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700 max-w-xs truncate">
                        {t.subject}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${priority.bg}-100 text-${priority.text}-700`}
                      >
                        {t.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {t.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700">
                        {t.assignedAgent || "Unassigned"}
                      </p>
                    </td>
                    <td className="px-6 py-5">{getSLAStatus(t)}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700">
                        {new Date(t.lastReply).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            router.push(`/support/tickets/${t.id}`)
                          }
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                        >
                          <Eye className="w-5 h-5 text-slate-600" />
                        </button>
                        <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                          <UserPlus className="w-5 h-5 text-slate-600" />
                        </button>
                        <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                          <MessageSquare className="w-5 h-5 text-slate-600" />
                        </button>
                        <button className="p-2.5 rounded-lg hover:bg-slate-100 transition">
                          <XCircle className="w-5 h-5 text-slate-600" />
                        </button>
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
            <strong>{tickets.length}</strong> tickets
          </p>
        </div>
      </div>
    </div>
  );
}

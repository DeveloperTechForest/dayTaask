// app/disputes/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  UserPlus,
  ArrowUpCircle,
  CheckCircle,
  DollarSign,
  MessageSquare,
  FileText,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";

const mockDisputes = [
  {
    id: "DSP-001",
    bookingId: "BK-1001",
    customer: { name: "John Smith", email: "john@example.com" },
    taaskr: { name: "Mike Johnson" },
    type: "service",
    status: "open",
    priority: "high",
    assignedTo: null,
    createdAt: "2024-01-15T10:30:00",
    description:
      "Service was not completed as described. Several areas were missed.",
    timeline: [
      {
        id: "1",
        type: "created",
        description: "Dispute created by customer",
        user: "John Smith",
        timestamp: "2024-01-15T10:30:00",
      },
    ],
    evidence: [
      { name: "photo1.jpg", type: "image" },
      { name: "receipt.pdf", type: "document" },
    ],
  },
  {
    id: "DSP-002",
    bookingId: "BK-1002",
    customer: { name: "Sarah Wilson", email: "sarah@example.com" },
    taaskr: { name: "Emily Davis" },
    type: "payment",
    status: "under_review",
    priority: "medium",
    assignedTo: "Admin User",
    createdAt: "2024-01-14T14:20:00",
    description:
      "Charged twice for the same service. Need refund for duplicate payment.",
    timeline: [
      {
        id: "1",
        type: "created",
        description: "Dispute created by customer",
        user: "Sarah Wilson",
        timestamp: "2024-01-14T14:20:00",
      },
      {
        id: "2",
        type: "assigned",
        description: "Assigned to Admin User",
        user: "System",
        timestamp: "2024-01-14T15:00:00",
      },
      {
        id: "3",
        type: "note",
        description: "Verified duplicate charge in payment gateway",
        user: "Admin User",
        timestamp: "2024-01-14T16:30:00",
      },
    ],
    evidence: [{ name: "bank_statement.pdf", type: "document" }],
  },
  {
    id: "DSP-003",
    bookingId: "BK-1003",
    customer: { name: "Robert Brown", email: "robert@example.com" },
    taaskr: { name: "Chris Lee" },
    type: "service",
    status: "escalated",
    priority: "urgent",
    assignedTo: "Senior Admin",
    createdAt: "2024-01-13T09:15:00",
    description: "Property damage during service. Requesting compensation.",
    timeline: [
      {
        id: "1",
        type: "created",
        description: "Dispute created by customer",
        user: "Robert Brown",
        timestamp: "2024-01-13T09:15:00",
      },
      {
        id: "2",
        type: "assigned",
        description: "Assigned to Admin User",
        user: "System",
        timestamp: "2024-01-13T10:00:00",
      },
      {
        id: "3",
        type: "escalated",
        description: "Escalated to Senior Admin due to damage claim",
        user: "Admin User",
        timestamp: "2024-01-13T11:30:00",
      },
    ],
    evidence: [
      { name: "damage_photo1.jpg", type: "image" },
      { name: "damage_photo2.jpg", type: "image" },
      { name: "repair_quote.pdf", type: "document" },
    ],
  },
  {
    id: "DSP-004",
    bookingId: "BK-1004",
    customer: { name: "Lisa Anderson", email: "lisa@example.com" },
    taaskr: { name: "Alex Turner" },
    type: "payment",
    status: "resolved",
    priority: "low",
    assignedTo: "Admin User",
    createdAt: "2024-01-12T16:45:00",
    description: "Promo code was not applied correctly.",
    timeline: [
      {
        id: "1",
        type: "created",
        description: "Dispute created by customer",
        user: "Lisa Anderson",
        timestamp: "2024-01-12T16:45:00",
      },
      {
        id: "2",
        type: "assigned",
        description: "Assigned to Admin User",
        user: "System",
        timestamp: "2024-01-12T17:00:00",
      },
      {
        id: "3",
        type: "note",
        description: "Promo code issue confirmed. Processing partial refund.",
        user: "Admin User",
        timestamp: "2024-01-12T17:30:00",
      },
      {
        id: "4",
        type: "resolved",
        description: "Refund of $25 processed successfully",
        user: "Admin User",
        timestamp: "2024-01-12T18:00:00",
      },
    ],
    evidence: [],
  },
];

export default function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dispute.status === statusFilter;
    const matchesType = typeFilter === "all" || dispute.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || dispute.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getPriorityConfig = (priority) => {
    const map = {
      urgent: { bg: "red", text: "red" },
      high: { bg: "orange", text: "orange" },
      medium: { bg: "yellow", text: "yellow" },
      low: { bg: "emerald", text: "emerald" },
    };
    return map[priority] || { bg: "emerald", text: "emerald" };
  };

  const getStatusConfig = (status) => {
    const map = {
      open: { bg: "yellow", text: "yellow" },
      under_review: { bg: "blue", text: "blue" },
      resolved: { bg: "emerald", text: "emerald" },
      escalated: { bg: "red", text: "red" },
    };
    return map[status] || { bg: "slate", text: "slate" };
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case "created":
        return <FileText className="h-4 w-4" />;
      case "assigned":
        return <UserPlus className="h-4 w-4" />;
      case "note":
        return <MessageSquare className="h-4 w-4" />;
      case "escalated":
        return <ArrowUpCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Disputes</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage and resolve customer disputes
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disputes..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-28"
              >
                <option value="all">All Types</option>
                <option value="service">Service</option>
                <option value="payment">Payment</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-32"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-28"
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Dispute ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Assigned To
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
              {filteredDisputes.map((dispute) => {
                const statusConf = getStatusConfig(dispute.status);
                const priorityConf = getPriorityConfig(dispute.priority);

                return (
                  <tr
                    key={dispute.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-orange-600 font-semibold">
                        {dispute.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm text-slate-500">
                        {dispute.bookingId}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-slate-700">
                          {dispute.customer.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {dispute.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {dispute.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${statusConf.bg}-100 text-${statusConf.text}-700`}
                      >
                        {dispute.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${priorityConf.bg}-100 text-${priorityConf.text}-700 uppercase`}
                      >
                        {dispute.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {dispute.assignedTo || (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowDetailSheet(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <UserPlus className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <ArrowUpCircle className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <CheckCircle className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <DollarSign className="w-4 h-4 text-slate-600" />
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
            Showing <strong>{filteredDisputes.length}</strong> of{" "}
            <strong>{mockDisputes.length}</strong> disputes
          </p>
        </div>
      </div>

      {/* Dispute Detail Modal */}
      {showDetailSheet && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-8 flex-shrink-0">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Dispute Details
                </h2>
                <button
                  onClick={() => setShowDetailSheet(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="px-8 pb-8 overflow-y-auto flex-grow">
              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg text-orange-600 font-semibold">
                    {selectedDispute.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${
                        getPriorityConfig(selectedDispute.priority).bg
                      }-100 text-${
                        getPriorityConfig(selectedDispute.priority).text
                      }-700 uppercase`}
                    >
                      {selectedDispute.priority}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${
                        getStatusConfig(selectedDispute.status).bg
                      }-100 text-${
                        getStatusConfig(selectedDispute.status).text
                      }-700`}
                    >
                      {selectedDispute.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Customer</p>
                    <p className="font-medium text-slate-900">
                      {selectedDispute.customer.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedDispute.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Taaskr</p>
                    <p className="font-medium text-slate-900">
                      {selectedDispute.taaskr.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Type</p>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize mt-1">
                      {selectedDispute.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Assigned To</p>
                    <p className="font-medium text-slate-900">
                      {selectedDispute.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </div>
                <hr className="border-slate-200" />
                {/* Description */}
                <div>
                  <p className="text-sm text-slate-600 mb-2">Description</p>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg text-slate-700">
                    {selectedDispute.description}
                  </p>
                </div>
                {/* Evidence */}
                {selectedDispute.evidence.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">
                      Evidence ({selectedDispute.evidence.length})
                    </p>
                    <div className="space-y-2">
                      {selectedDispute.evidence.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-700">
                              {file.name}
                            </span>
                          </div>
                          <button className="text-sm text-orange-500 hover:text-orange-600 transition">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <hr className="border-slate-200" />
                {/* Timeline */}
                <div>
                  <p className="text-sm text-slate-600 mb-3">Timeline</p>
                  <div className="space-y-4">
                    {selectedDispute.timeline.map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1 p-1.5 bg-slate-100 rounded-full">
                          {getTimelineIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">
                            {event.description}
                          </p>
                          <p className="text-xs text-slate-500">
                            by {event.user} •{" "}
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="border-slate-200" />
                {/* Add Resolution Note */}
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    Add Resolution Note
                  </p>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter resolution notes..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                  />
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
                    <ArrowUpCircle className="w-4 h-4" />
                    Escalate
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
                    <DollarSign className="w-4 h-4" />
                    Refund
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition font-medium shadow-sm">
                    <CheckCircle className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

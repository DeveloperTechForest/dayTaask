// app/payments/refunds/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

const refunds = [
  {
    id: "REF-001",
    booking: "BK-1007",
    customer: "Jennifer Martinez",
    original: 8500,
    refund: 8500,
    reason: "Service not completed",
    status: "Approved",
    requested: "2024-01-14 02:00 PM",
    processed: "2024-01-14 04:30 PM",
    type: "Full",
  },
  {
    id: "REF-002",
    booking: "BK-1015",
    customer: "David Miller",
    original: 15000,
    refund: 15000,
    reason: "Taaskr no-show",
    status: "Pending",
    requested: "2024-01-20 11:00 AM",
    processed: null,
    type: "Full",
  },
  {
    id: "REF-003",
    booking: "BK-1018",
    customer: "Emma Thompson",
    original: 20000,
    refund: 10000,
    reason: "Partial service - customer cancelled",
    status: "Pending",
    requested: "2024-01-21 09:30 AM",
    processed: null,
    type: "Partial",
  },
  {
    id: "REF-004",
    booking: "BK-1012",
    customer: "Ryan Clark",
    original: 9500,
    refund: 9500,
    reason: "Quality issues",
    status: "Rejected",
    requested: "2024-01-19 03:00 PM",
    processed: "2024-01-19 05:00 PM",
    type: "Full",
  },
  {
    id: "REF-005",
    booking: "BK-1020",
    customer: "Sophie Adams",
    original: 18000,
    refund: 18000,
    reason: "Booking cancelled by system",
    status: "Processing",
    requested: "2024-01-22 10:00 AM",
    processed: null,
    type: "Full",
  },
  {
    id: "REF-006",
    booking: "BK-1008",
    customer: "William Garcia",
    original: 5500,
    refund: 2750,
    reason: "Delayed service",
    status: "Approved",
    requested: "2024-01-20 01:00 PM",
    processed: "2024-01-20 03:00 PM",
    type: "Partial",
  },
];

const getStatusConfig = (status) => {
  const map = {
    Approved: { bg: "emerald", text: "emerald" },
    Processing: { bg: "blue", text: "blue" },
    Pending: { bg: "yellow", text: "yellow" },
    Rejected: { bg: "red", text: "red" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

export default function RefundsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [action, setAction] = useState("approve"); // approve or reject
  const [partialAmount, setPartialAmount] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const pendingTotal = refunds
    .filter((r) => r.status === "Pending")
    .reduce((s, r) => s + r.refund, 0);
  const approvedTotal = refunds
    .filter((r) => r.status === "Approved")
    .reduce((s, r) => s + r.refund, 0);

  const filtered = refunds.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.booking.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openModal = (refund, type) => {
    setSelectedRefund(refund);
    setAction(type);
    setPartialAmount((refund.refund / 100).toFixed(2));
    setRejectReason("");
    setModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Refunds</h1>
          <p className="text-sm text-slate-600 mt-1">
            Process and manage refund requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Pending Refunds</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {refunds.filter((r) => r.status === "Pending").length}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            ₹{(pendingTotal / 100).toFixed(2)} total
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 rounded-xl mb-3">
              <RotateCcw className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Processing</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {refunds.filter((r) => r.status === "Processing").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Approved (This Month)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            ₹{(approvedTotal / 100).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-50 rounded-xl mb-3">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {refunds.filter((r) => r.status === "Rejected").length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, booking, or customer..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Refund
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Original
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Refund
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Reason
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Requested
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                const status = getStatusConfig(r.status);

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <p className="font-mono text-orange-600 font-semibold">
                        {r.id}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-mono text-sm text-slate-600">
                        {r.booking}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">{r.customer}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-600">
                        <IndianRupee className="w-4 h-4" />
                        {(r.original / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-bold text-red-600">
                        <IndianRupee className="w-4 h-4" />
                        {(r.refund / 100).toFixed(2)}
                        {r.type === "Partial" && (
                          <span className="ml-2 text-xs text-slate-500 font-normal">
                            (Partial)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700 max-w-xs truncate">
                        {r.reason}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">{r.requested}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === r.id ? null : r.id)
                          }
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>

                        {dropdownOpen === r.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setDropdownOpen(null)}
                            />
                            <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {r.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => openModal(r, "approve")}
                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 text-emerald-600 text-sm font-medium transition"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve Refund
                                  </button>
                                  <hr className="border-slate-200" />
                                  <button
                                    onClick={() => openModal(r, "reject")}
                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject Refund
                                  </button>
                                </>
                              )}
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
            <strong>{refunds.length}</strong> refund requests
          </p>
        </div>
      </div>

      {/* Process Refund Modal */}
      {modalOpen && selectedRefund && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {action === "approve" ? "Approve Refund" : "Reject Refund"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-5 mb-8">
              <div className="flex justify-between">
                <span className="text-slate-600">Refund ID</span>
                <span className="font-mono font-semibold text-orange-600">
                  {selectedRefund.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Booking</span>
                <span className="font-mono">{selectedRefund.booking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customer</span>
                <span className="font-medium">{selectedRefund.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Original Amount</span>
                <span className="text-lg font-medium">
                  ₹{(selectedRefund.original / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Reason</span>
                <span className="text-sm text-right max-w-xs">
                  {selectedRefund.reason}
                </span>
              </div>
            </div>

            {action === "approve" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Refund Amount
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      step="0.01"
                      className="flex-1 h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                    <button
                      onClick={() =>
                        setPartialAmount(
                          (selectedRefund.original / 100).toFixed(2),
                        )
                      }
                      className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
                    >
                      Full Refund
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Requested: ₹{(selectedRefund.refund / 100).toFixed(2)} •
                    Original: ₹{(selectedRefund.original / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this refund is being rejected..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
                />
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              {action === "approve" ? (
                <button
                  onClick={() => {
                    alert("Refund Approved!");
                    setModalOpen(false);
                  }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Refund
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert("Refund Rejected");
                    setModalOpen(false);
                  }}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

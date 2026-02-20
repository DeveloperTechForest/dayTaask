// app/payments/payouts/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Wallet,
  TrendingUp,
  Clock,
  AlertCircle,
  Eye,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

const payouts = [
  {
    id: "PAY-001",
    name: "Mike Johnson",
    taaskrId: "T-101",
    gross: 85000,
    commission: 8500,
    net: 76500,
    status: "Pending",
    date: "2024-01-25",
    bank: "HDFC **** 4521",
    jobs: 12,
  },
  {
    id: "PAY-002",
    name: "Tom Brown",
    taaskrId: "T-102",
    gross: 62000,
    commission: 6200,
    net: 55800,
    status: "Initiated",
    date: "2024-01-25",
    bank: "SBI **** 7832",
    jobs: 8,
  },
  {
    id: "PAY-003",
    name: "David Lee",
    taaskrId: "T-103",
    gross: 125000,
    commission: 12500,
    net: 112500,
    status: "Paid",
    date: "2024-01-18",
    bank: "ICICI **** 2156",
    jobs: 15,
  },
  {
    id: "PAY-004",
    name: "James Wilson",
    taaskrId: "T-104",
    gross: 48000,
    commission: 4800,
    net: 43200,
    status: "Failed",
    date: "2024-01-20",
    bank: "Axis **** 9087",
    jobs: 6,
  },
  {
    id: "PAY-005",
    name: "Chris Evans",
    taaskrId: "T-105",
    gross: 92000,
    commission: 9200,
    net: 82800,
    status: "Pending",
    date: "2024-01-25",
    bank: "HDFC **** 3345",
    jobs: 11,
  },
  {
    id: "PAY-006",
    name: "Sarah Parker",
    taaskrId: "T-106",
    gross: 75000,
    commission: 7500,
    net: 67500,
    status: "Paid",
    date: "2024-01-18",
    bank: "Kotak **** 5567",
    jobs: 9,
  },
];

const getStatusConfig = (status) => {
  const map = {
    Paid: { bg: "emerald", text: "emerald" },
    Initiated: { bg: "blue", text: "blue" },
    Pending: { bg: "yellow", text: "yellow" },
    Failed: { bg: "red", text: "red" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

export default function PayoutsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [notes, setNotes] = useState("");

  const totalPending = payouts
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + p.net, 0);
  const totalPaid = payouts
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.net, 0);
  const totalCommission = payouts.reduce((s, p) => s + p.commission, 0);

  const filtered = payouts.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openApproveModal = (payout) => {
    setSelectedPayout(payout);
    setNotes("");
    setModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage Taaskr earnings and payouts
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
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-sm text-slate-600">Pending Payouts</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            ₹{(totalPending / 100).toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {payouts.filter((p) => p.status === "Pending").length} pending
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Wallet className="w-7 h-7 text-emerald-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600">Total Paid (This Month)</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            ₹{(totalPaid / 100).toFixed(2)}
          </p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +8.2% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-50 rounded-xl mb-3">
              <IndianRupee className="w-7 h-7 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Commission Earned</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            ₹{(totalCommission / 100).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Failed Payouts</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {payouts.filter((p) => p.status === "Failed").length}
          </p>
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
                placeholder="Search by ID or Taaskr..."
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
                <option>Initiated</option>
                <option>Paid</option>
                <option>Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm">
              <CheckCircle className="w-5 h-5" />
              Approve Selected
            </button>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Payout
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Gross
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Commission
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Bank
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Scheduled
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
              {filtered.map((p) => {
                const status = getStatusConfig(p.status);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-mono text-orange-600 font-semibold">
                          {p.id}
                        </p>
                        <p className="text-sm text-slate-700 font-medium mt-1">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-500">{p.taaskrId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <IndianRupee className="w-4 h-4" />
                        {(p.gross / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-red-600">
                        <IndianRupee className="w-4 h-4" />-
                        {(p.commission / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-bold text-emerald-600">
                        <IndianRupee className="w-4 h-4" />
                        {(p.net / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
                        {p.jobs} jobs
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-mono text-sm text-slate-600">
                        {p.bank}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700">{p.date}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === p.id ? null : p.id)
                          }
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>

                        {dropdownOpen === p.id && (
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
                              {p.status === "Pending" && (
                                <button
                                  onClick={() => openApproveModal(p)}
                                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 text-emerald-600 text-sm font-medium transition"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve Payout
                                </button>
                              )}
                              {p.status === "Initiated" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-50 text-emerald-600 text-sm font-medium transition">
                                  <CheckCircle className="w-4 h-4" />
                                  Mark as Paid
                                </button>
                              )}
                              {p.status === "Failed" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <RefreshCw className="w-4 h-4" />
                                  Retry Payout
                                </button>
                              )}
                              <hr className="border-slate-200" />
                              <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 text-sm font-medium transition">
                                <XCircle className="w-4 h-4" />
                                Cancel Payout
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
            <strong>{payouts.length}</strong> payouts
          </p>
        </div>
      </div>

      {/* Approve Payout Modal */}
      {modalOpen && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Approve Payout
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Taaskr</span>
                <span className="font-semibold text-slate-900">
                  {selectedPayout.name} ({selectedPayout.taaskrId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Gross Earnings</span>
                <span className="text-lg font-medium text-slate-900">
                  ₹{(selectedPayout.gross / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Commission (10%)</span>
                <span className="text-lg font-medium text-red-600">
                  -₹{(selectedPayout.commission / 100).toFixed(2)}
                </span>
              </div>
              <hr className="border-slate-300" />
              <div className="flex justify-between">
                <span className="text-lg font-bold text-slate-900">
                  Net Payout
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{(selectedPayout.net / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Bank Details
              </p>
              <p className="font-mono text-slate-700 bg-slate-50 px-4 py-3 rounded-xl">
                {selectedPayout.bank}
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any internal notes..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Payout Approved & Initiated!");
                  setModalOpen(false);
                }}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve & Initiate Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// app/payments/transactions/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  CheckCircle2,
  Eye,
  RefreshCw,
  RotateCcw,
  Download,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Smartphone,
  Wallet as WalletIcon,
  ChevronDown,
} from "lucide-react";

const transactions = [
  {
    id: "TXN-10001",
    booking: "BK-1001",
    customer: "John Smith",
    amount: 14999,
    method: "Card",
    providerId: "pi_3MqTk2PK...xyz",
    status: "Success",
    date: "2024-01-15 10:32 AM",
  },
  {
    id: "TXN-10002",
    booking: "BK-1002",
    customer: "Sarah Wilson",
    amount: 8999,
    method: "UPI",
    providerId: "upi_abc123...def",
    status: "Success",
    date: "2024-01-16 02:15 PM",
  },
  {
    id: "TXN-10003",
    booking: "BK-1004",
    customer: "Michael Brown",
    amount: 12000,
    method: "Card",
    providerId: "pi_4NrUl3QM...abc",
    status: "Success",
    date: "2024-01-17 11:20 AM",
  },
  {
    id: "TXN-10004",
    booking: "BK-1005",
    customer: "Lisa Anderson",
    amount: 9999,
    method: "Wallet",
    providerId: "wlt_xyz789...ghi",
    status: "Success",
    date: "2024-01-18 03:45 PM",
  },
  {
    id: "TXN-10005",
    booking: "BK-1007",
    customer: "Jennifer Martinez",
    amount: 8500,
    method: "Card",
    providerId: "pi_5OsVm4RN...jkl",
    status: "Refunded",
    date: "2024-01-14 01:30 PM",
  },
  {
    id: "TXN-10006",
    booking: "BK-1008",
    customer: "William Garcia",
    amount: 5500,
    method: "UPI",
    providerId: "upi_mno456...pqr",
    status: "Success",
    date: "2024-01-20 09:50 AM",
  },
  {
    id: "TXN-10007",
    booking: "BK-1009",
    customer: "Amanda White",
    amount: 17500,
    method: "Card",
    providerId: "pi_6PtWn5SO...stu",
    status: "Failed",
    date: "2024-01-20 02:10 PM",
  },
  {
    id: "TXN-10008",
    booking: "BK-1010",
    customer: "Kevin Brown",
    amount: 25000,
    method: "Card",
    providerId: "pi_7QuXo6TP...vwx",
    status: "Pending",
    date: "2024-01-21 11:05 AM",
  },
];

const getMethodIcon = (method) => {
  switch (method) {
    case "Card":
      return <CreditCard className="w-4 h-4" />;
    case "UPI":
      return <Smartphone className="w-4 h-4" />;
    case "Wallet":
      return <WalletIcon className="w-4 h-4" />;
    default:
      return <DollarSign className="w-4 h-4" />;
  }
};

const getStatusConfig = (status) => {
  const map = {
    Success: { bg: "emerald", text: "emerald" },
    Pending: { bg: "yellow", text: "yellow" },
    Failed: { bg: "red", text: "red" },
    Refunded: { bg: "slate", text: "slate" },
  };
  return map[status] || { bg: "slate", text: "slate" };
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const totalRevenue = transactions
    .filter((t) => t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.booking.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesMethod = methodFilter === "all" || t.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-600 mt-1">
            View and manage all payment transactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-50 rounded-xl">
              <DollarSign className="w-7 h-7 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            ₹{(totalRevenue / 100).toFixed(2)}
          </p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +12.5% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="p-3 bg-emerald-50 rounded-xl mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600">Successful</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {transactions.filter((t) => t.status === "Success").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="p-3 bg-yellow-50 rounded-xl mb-4">
            <AlertCircle className="w-7 h-7 text-yellow-600" />
          </div>
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {transactions.filter((t) => t.status === "Pending").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="p-3 bg-red-50 rounded-xl mb-4">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <p className="text-sm text-slate-600">Failed / Refunded</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {
              transactions.filter((t) =>
                ["Failed", "Refunded"].includes(t.status),
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative  flex-1">
              <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Wallet</option>
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

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Provider ID
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
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
                      <p className="font-mono text-sm text-slate-600">
                        {t.booking}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">{t.customer}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-bold text-slate-900">
                        ₹{(t.amount / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(t.method)}
                        <span className="text-sm font-medium text-slate-700">
                          {t.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-mono text-xs text-slate-500 truncate max-w-xs">
                        {t.providerId}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-${status.bg}-100 text-${status.text}-700`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">{t.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setDropdownOpen(dropdownOpen === t.id ? null : t.id)
                          }
                          className="p-2.5 rounded-lg hover:bg-slate-100 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </button>

                        {dropdownOpen === t.id && (
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
                              {t.status === "Failed" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                                  <RefreshCw className="w-4 h-4" />
                                  Retry Payment
                                </button>
                              )}
                              {t.status === "Success" && (
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50 text-orange-600 text-sm font-medium transition">
                                  <RotateCcw className="w-4 h-4" />
                                  Issue Refund
                                </button>
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
            <strong>{transactions.length}</strong> transactions
          </p>
        </div>
      </div>
    </div>
  );
}

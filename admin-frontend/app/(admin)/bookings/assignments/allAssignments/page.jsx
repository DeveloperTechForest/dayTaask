"use client";

import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  CheckCircle2,
  XCircle,
  ToolCase,
  Zap,
  ChevronDown,
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const getStatusBadge = (status) => {
  const map = {
    accepted: {
      bg: "bg-emerald-100 text-emerald-700",
      label: "Accepted",
      icon: CheckCircle2,
    },
    rejected: {
      bg: "bg-red-100 text-red-700",
      label: "Rejected",
      icon: XCircle,
    },
    requested: {
      bg: "bg-yellow-100 text-yellow-700",
      label: "Requested",
      icon: null,
    },
    expired: {
      bg: "bg-gray-100 text-gray-700",
      label: "Expired",
      icon: null,
    },
    cancelled: {
      bg: "bg-orange-100 text-orange-700",
      label: "Cancelled",
      icon: null,
    },
  };

  return (
    map[status] || {
      bg: "bg-slate-100 text-slate-700",
      label: status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown",
      icon: null,
    }
  );
};

const getMethodBadge = (method) => {
  const map = {
    manual: {
      bg: "bg-blue-100 text-blue-700",
      label: "Manual",
      icon: ToolCase,
    },
    auto: {
      bg: "bg-purple-100 text-purple-700",
      label: "Auto",
      icon: Zap,
    },
  };

  return (
    map[method] || {
      bg: "bg-slate-100 text-slate-700",
      label: method
        ? method.charAt(0).toUpperCase() + method.slice(1)
        : "Unknown",
      icon: null,
    }
  );
};

export default function AssignmentLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportAll, setExportAll] = useState(false);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const pageSize = 10; // should match your backend's PAGE_SIZE setting

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (methodFilter !== "all") params.set("method", methodFilter);
    return params.toString();
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const query = buildQuery();
      const url = query
        ? `/api/bookings/admin/assignment-logs/?${query}`
        : "/api/bookings/admin/assignment-logs/";

      const response = await apiFetch(url);

      setLogs(response.results || []);
      setTotalCount(response.count || 0);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage({ type: "error", text: "Failed to load assignment logs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, search, statusFilter, methodFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, methodFilter]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePrev = () => {
    if (prevUrl && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (nextUrl) {
      setCurrentPage((p) => p + 1);
    }
  };

  const stats = {
    total: totalCount,
    // These are only for current page – full stats would require separate endpoint or aggregation
    accepted: logs.filter((l) => l.status === "accepted").length,
    rejected: logs.filter((l) => l.status === "rejected").length,
    manual: logs.filter((l) => l.method === "manual").length,
    auto: logs.filter((l) => l.method === "auto").length,
  };

  const getExportData = () => {
    // For simplicity exporting current page + filters
    // For full export you should create a separate endpoint without pagination
    return logs;
  };

  const generateFilename = (format) => {
    const date = new Date().toISOString().split("T")[0];
    const prefix = exportAll ? "all" : "filtered";
    return `${prefix}_assignment_logs_${date}.${format}`;
  };

  const exportCSV = () => {
    const data = getExportData();
    if (!data.length) return;

    const headers = [
      "ID",
      "Booking Code",
      "Service Name",
      "Customer Name",
      "Taaskr Name",
      "Assigned By",
      "Status",
      "Method",
      "Expires At",
      "Created At",
    ];

    const rows = [
      headers.join(","),
      ...data.map((log) =>
        [
          log.id,
          `"${(log.booking_code || "").replace(/"/g, '""')}"`,
          `"${(log.service_name || "").replace(/"/g, '""')}"`,
          `"${(log.customer_name || "").replace(/"/g, '""')}"`,
          `"${(log.taaskr_name || "").replace(/"/g, '""')}"`,
          `"${(log.assigned_by || "").replace(/"/g, '""')}"`,
          log.status || "",
          log.method || "",
          log.expires_at || "",
          log.created_at || "",
        ].join(","),
      ),
    ];

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, generateFilename("csv"));
  };

  const exportExcel = () => {
    const data = getExportData();
    if (!data.length) return;

    const wsData = data.map((log) => ({
      ID: log.id,
      "Booking Code": log.booking_code,
      "Service Name": log.service_name,
      "Customer Name": log.customer_name,
      "Taaskr Name": log.taaskr_name,
      "Assigned By": log.assigned_by,
      Status: log.status,
      Method: log.method,
      "Expires At": log.expires_at,
      "Created At": log.created_at,
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, generateFilename("xlsx"));
  };

  const exportJSON = () => {
    const data = getExportData();
    if (!data.length) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, generateFilename("json"));
  };

  const handleExport = async (type) => {
    if (exporting) return;
    setExporting(true);

    try {
      if (type === "csv") exportCSV();
      else if (type === "xlsx") exportExcel();
      else if (type === "json") exportJSON();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Export failed" });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-7 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignment Logs</h1>
          <p className="text-slate-600 mt-1">
            View and filter historical assignment records
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchLogs}
            disabled={exporting || loading}
            className="flex items-center gap-2 px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition disabled:opacity-60"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>

          <div className="relative group">
            <button
              disabled={exporting || totalCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition disabled:opacity-60 shadow-sm"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export {exportAll ? "All" : totalCount} records
                </>
              )}
            </button>

            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500 uppercase">
                Export Options
              </div>

              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                CSV File
              </button>

              <button
                onClick={() => handleExport("xlsx")}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Excel (.xlsx)
              </button>

              <button
                onClick={() => handleExport("json")}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-sm"
              >
                <FileJson className="w-4 h-4 text-blue-600" />
                JSON (raw)
              </button>

              <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                <label className="flex items-center gap-2 text-sm py-1.5 cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1">
                  <input
                    type="checkbox"
                    checked={exportAll}
                    onChange={(e) => setExportAll(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded border-slate-300"
                  />
                  <span className="text-slate-700">
                    Export all (current filters)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <Link href="/bookings/allBookings">
            <button className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
              All Bookings
            </button>
          </Link>
          <Link href="/bookings/assignments">
            <button className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
              Back
            </button>
          </Link>
        </div>
      </div>

      {/* Stats – note: currently based on current page only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Logs</p>
              <p className="text-3xl font-bold text-slate-700 mt-1">
                {totalCount}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <Users className="w-8 h-8 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Accepted</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {stats.accepted}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {stats.rejected}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Manual</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.manual}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <ToolCase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Auto</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {stats.auto}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search booking, customer, service, taaskr..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200/30 transition"
              />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="manual">Manual</option>
                <option value="auto">Auto</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.type === "error" ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="scrollbar overflow-x-auto">
          <table className="w-full min-w-[1200px] whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Booking
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Taaskr
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Assigned By
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Expires At
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-20 text-slate-500 text-lg"
                  >
                    No assignment logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const status = getStatusBadge(log.status);
                  const method = getMethodBadge(log.method);

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      <td className="px-6 py-5 text-slate-600 text-sm">
                        {log.id}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono font-semibold text-orange-600">
                          {log.booking_code}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {log.service_name}
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {log.customer_name}
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-900">
                        {log.taaskr_name}
                      </td>
                      <td className="px-6 py-5 text-slate-700">
                        {log.assigned_by}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2">
                          {status.icon && <status.icon className="w-4 h-4" />}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2">
                          {method.icon && <method.icon className="w-4 h-4" />}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${method.bg}`}
                          >
                            {method.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {log.expires_at
                          ? new Date(log.expires_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div>
            Showing <strong>{logs.length}</strong> of{" "}
            <strong>{totalCount}</strong> logs
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={!prevUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-medium min-w-[3rem] text-center">
                {currentPage}
              </span>

              <button
                onClick={handleNext}
                disabled={!nextUrl || loading}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

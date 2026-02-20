// app/quotes/create/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, X } from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateQuoteRequestPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    service_category: "",
    service: "",
    service_name: "",
    problem_description: "",
    preferred_date: "",
    preferred_time_slot: "",
    status: "open",
  });

  const [images, setImages] = useState([]); // File[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load dropdown data with search
  const loadCustomers = async (search = "") => {
    try {
      const res = await apiFetch(`/api/users/customers/?search=${search}`);
      setCustomers(res.results || res);
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const loadCategories = async (search = "") => {
    try {
      const res = await apiFetch(
        `/api/services/admin/categories/?search=${search}`,
      );
      setCategories(res.results || res);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadServices = async (search = "") => {
    try {
      const res = await apiFetch(
        `/api/services/admin/services/?search=${search}`,
      );
      setServices(res.results || res);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadCategories();
    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData();

    fd.append("customer", formData.customer);
    fd.append("service_category", formData.service_category);
    fd.append("service", formData.service);
    fd.append("service_name", formData.service_name);
    fd.append("problem_description", formData.problem_description);
    fd.append("preferred_date", formData.preferred_date);
    fd.append("preferred_time_slot", formData.preferred_time_slot);
    fd.append("status", formData.status);

    images.forEach((file) => {
      fd.append("images", file);
    });

    try {
      await apiFetch("/api/bookings/admin/quote-requests/", {
        method: "POST",
        body: fd,
      });

      alert("Quote request created successfully!");
      router.push("/quotes/quoteRequests");
      router.refresh();
    } catch (err) {
      setError(err?.detail || "Failed to create quote request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Quote Request
          </h1>
          <Link
            href="/quotes/quoteRequests"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition"
          >
            <ChevronLeft size={20} /> Back to List
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex gap-3 items-center shadow-sm">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Quote Request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer *
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  loadCustomers(e.target.value);
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — {c.full_name} | {c.email}{" "}
                    {c.phone && `| ${c.phone}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Category *
              </label>
              <input
                type="text"
                placeholder="Search category..."
                value={categorySearch}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  loadCategories(e.target.value);
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="service_category"
                value={formData.service_category}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Service */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service *
              </label>
              <input
                type="text"
                placeholder="Search service..."
                value={serviceSearch}
                onChange={(e) => {
                  setServiceSearch(e.target.value);
                  loadServices(e.target.value);
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleChange}
                required
                placeholder="e.g., CCTV Installation"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Problem Description
              </label>
              <textarea
                name="problem_description"
                value={formData.problem_description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
              />
            </div>

            {/* Preferred Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Time Slot *
                </label>
                <select
                  name="preferred_time_slot"
                  value={formData.preferred_time_slot}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                >
                  <option value="">Select slot</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="open">Open</option>
                <option value="quoted">Quoted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {images.length > 0 && (
                <div className="mt-3 text-sm text-slate-600">
                  Selected: {images.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-slate-200">
              <Link
                href="/quotes/quoteRequests"
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium rounded-xl transition shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Quote Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

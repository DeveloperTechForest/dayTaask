// app/quotes/edit/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, X } from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { formatOnlyDate } from "@/utils/dateUtils";

export default function EditQuoteRequestPage() {
  const router = useRouter();
  const { id } = useParams();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

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

  const [newImages, setNewImages] = useState([]); // File[]
  const [removeImageIds, setRemoveImageIds] = useState([]); // number[]

  // Load quote + dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load quote detail
        const quoteData = await apiFetch(
          `/api/bookings/admin/quote-requests/${id}/`,
        );
        setQuote(quoteData);

        setFormData({
          customer: quoteData.customer?.toString() || "",
          service_category: quoteData.service_category?.toString() || "",
          service: quoteData.service?.toString() || "",
          service_name: quoteData.service_name || "",
          problem_description: quoteData.problem_description || "",
          preferred_date: quoteData.preferred_date || "",
          preferred_time_slot: quoteData.preferred_time_slot || "",
          status: quoteData.status || "open",
        });

        setCustomerSearch(quoteData.customer_name || "");

        // Load dropdown options (with initial empty search)
        const [custRes, catRes, servRes] = await Promise.all([
          apiFetch("/api/users/customers/"),
          apiFetch("/api/services/admin/categories/"),
          apiFetch("/api/services/admin/services/"),
        ]);

        setCustomers(custRes.results || custRes);
        setCategories(catRes.results || catRes);
        setServices(servRes.results || servRes);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Search handlers
  const handleCustomerSearch = async (e) => {
    const val = e.target.value;
    setCustomerSearch(val);
    try {
      const res = await apiFetch(`/api/users/customers/?search=${val}`);
      setCustomers(res.results || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorySearch = async (e) => {
    const val = e.target.value;
    setCategorySearch(val);
    try {
      const res = await apiFetch(
        `/api/services/admin/categories/?search=${val}`,
      );
      setCategories(res.results || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceSearch = async (e) => {
    const val = e.target.value;
    setServiceSearch(val);
    try {
      const res = await apiFetch(`/api/services/admin/services/?search=${val}`);
      setServices(res.results || res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewFileChange = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const toggleRemove = (imageId) => {
    setRemoveImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((x) => x !== imageId)
        : [...prev, imageId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);

    const fd = new FormData();

    fd.append("service_name", formData.service_name);
    fd.append("problem_description", formData.problem_description);
    fd.append("preferred_date", formData.preferred_date);
    fd.append("preferred_time_slot", formData.preferred_time_slot);
    fd.append("status", formData.status);

    // Optional: if backend allows changing service/category/customer in edit
    if (formData.service) fd.append("service", formData.service);
    if (formData.service_category)
      fd.append("service_category", formData.service_category);
    // customer usually shouldn't change — omit unless backend supports it

    newImages.forEach((file) => fd.append("new_images", file));

    removeImageIds.forEach((imgId) => fd.append("remove_image_ids", imgId));

    try {
      await apiFetch(`/api/bookings/admin/quote-requests/${id}/`, {
        method: "PATCH",
        body: fd,
      });

      alert("Quote request updated successfully!");
      router.push("/quotes/quoteRequests");
      router.refresh();
    } catch (err) {
      setError(err?.detail || "Failed to update quote request");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Quote Request
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

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900">
              Edit Quote Request #{quote?.quote_code}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={customerSearch}
                onChange={handleCustomerSearch}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
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
                Service Category
              </label>
              <input
                type="text"
                placeholder="Search category..."
                value={categorySearch}
                onChange={handleCategorySearch}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="service_category"
                value={formData.service_category}
                onChange={handleChange}
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
                Base Service
              </label>
              <input
                type="text"
                placeholder="Search service..."
                value={serviceSearch}
                onChange={handleServiceSearch}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition mb-3"
              />
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
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
                className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
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
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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
                  className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
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
                className="w-full h-12 px-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              >
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Existing Images */}
            {quote?.images?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Existing Images (check to remove)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {quote.images.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.image}
                        alt=""
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <label className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow cursor-pointer">
                        <input
                          type="checkbox"
                          checked={removeImageIds.includes(img.id)}
                          onChange={() => toggleRemove(img.id)}
                          className="h-5 w-5 text-red-600 rounded"
                        />
                      </label>
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        {img.uploaded_by} • {formatOnlyDate(img.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Add New Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {newImages.length > 0 && (
                <div className="mt-3 text-sm text-slate-600">
                  Selected: {newImages.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t">
              <Link
                href="/quotes/quoteRequests"
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitLoading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-60 shadow-sm"
              >
                {submitLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                Update Quote Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

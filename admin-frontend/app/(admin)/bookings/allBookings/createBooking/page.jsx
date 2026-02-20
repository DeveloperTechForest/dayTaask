"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, X } from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ← ADD THIS IMPORT

export default function CreateBookingPage() {
  const router = useRouter(); // ← DECLARE ROUTER

  /* -------------------- STATE -------------------- */
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    service: "",
    address: "",
    date: "",
    time: "",
    priority: "medium",
    total_price: "",
    location_notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* -------------------- LOADERS -------------------- */
  const loadCustomers = async (search = "") => {
    const res = await apiFetch(`/api/users/customers/?search=${search}`);
    setCustomers(res.results || []);
  };

  const loadServices = async (search = "") => {
    const res = await apiFetch(
      `/api/services/admin/services/?search=${search}`
    );
    setServices(res.results || []);
  };

  const loadAddresses = async (customerId) => {
    if (!customerId) {
      setAddresses([]);
      return;
    }
    const res = await apiFetch(`/api/users/customers/${customerId}/addresses/`);
    setAddresses(Array.isArray(res) ? res : res.results || []);
  };

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    loadCustomers();
    loadServices();
  }, []);

  useEffect(() => {
    loadAddresses(formData.customer);
  }, [formData.customer]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const createBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      setLoading(true);

      const payload = {
        customer: Number(formData.customer),
        service: Number(formData.service),
        address: Number(formData.address),
        scheduled_at: `${formData.date}T${formData.time}:00`,
        priority: formData.priority,
        total_price: Number(formData.total_price) || 0,
        location_notes: formData.location_notes || "",
      };

      await apiFetch("/api/bookings/admin/bookings/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(true);

      // Reset form + redirect after success
      setTimeout(() => {
        setFormData({
          customer: "",
          service: "",
          address: "",
          date: "",
          time: "",
          priority: "medium",
          total_price: "",
          location_notes: "",
        });
        setCustomerSearch("");
        setServiceSearch("");

        router.push("/bookings/allBookings");
        router.refresh(); // ← This ensures fresh data on list page
      }, 1500);
    } catch (err) {
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create Booking</h1>
          <Link
            href="/bookings/allBookings"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition"
          >
            <ChevronLeft size={20} /> Back
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex gap-3 items-center shadow-sm">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl shadow-sm">
            Booking created successfully! Redirecting...
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900">
              Add New Booking
            </h2>
          </div>

          <form onSubmit={createBooking} className="p-8 space-y-8">
            {/* Customer & Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address *
              </label>
              <select
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="">Select Address</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {a.street}, {a.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
            </div>

            {/* Priority & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total Price (₹)
                </label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
            </div>

            {/* Location Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location Notes
              </label>
              <textarea
                name="location_notes"
                value={formData.location_notes}
                onChange={handleChange}
                rows={3}
                placeholder="Gate code, floor number, special instructions..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-slate-200">
              <Link
                href="/bookings/allBookings"
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
                  "Create Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

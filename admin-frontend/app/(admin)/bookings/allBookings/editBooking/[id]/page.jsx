"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

export default function EditBookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    service: "",
    address: "",
    scheduled_at: "",
    status: "pending",
    required_taaskrs: 1,
    priority: "medium",
    total_price: "",
    location_notes: "",
  });

  // For displaying customer name (read-only)
  const [customerName, setCustomerName] = useState("");

  const loadAddresses = async (customerId) => {
    if (!customerId) {
      setAddresses([]);
      return;
    }
    const res = await apiFetch(`/api/users/customers/${customerId}/addresses/`);
    setAddresses(Array.isArray(res) ? res : res.results || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid booking ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [bookingRes, customerRes, serviceRes] = await Promise.all([
          apiFetch(`/api/bookings/admin/bookings/${id}/`),
          apiFetch("/api/users/customers/"),
          apiFetch("/api/services/admin/services/"),
        ]);

        setCustomers(customerRes.results || []);
        setServices(serviceRes.results || []);

        const getId = (field) =>
          field
            ? typeof field === "object"
              ? String(field.id)
              : String(field)
            : "";

        const customerId = getId(bookingRes.customer);
        const serviceId = getId(bookingRes.service);
        const addressId = getId(bookingRes.address);

        let scheduledAt = "";
        if (bookingRes.scheduled_at) {
          scheduledAt = bookingRes.scheduled_at
            .replace(/\.\d{3}Z$/, "Z")
            .slice(0, 16);
        }

        setFormData({
          customer: customerId,
          service: serviceId,
          address: addressId,
          scheduled_at: scheduledAt,
          status: bookingRes.status || "pending",
          required_taaskrs: bookingRes.required_taaskrs || 1,
          priority: bookingRes.priority || "medium",
          total_price:
            bookingRes.total_price != null
              ? String(bookingRes.total_price)
              : "",
          location_notes: bookingRes.location_notes || "",
        });

        // Store customer name for display (since not editable)
        setCustomerName(bookingRes.customer?.full_name || "—");

        if (customerId) await loadAddresses(customerId);
      } catch (err) {
        console.error(err);
        setError("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (formData.customer) loadAddresses(formData.customer);
  }, [formData.customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const updateBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        service: Number(formData.service),
        address: Number(formData.address),
        scheduled_at: formData.scheduled_at
          ? `${formData.scheduled_at}:00`
          : null,
        status: formData.status,
        required_taaskrs: Number(formData.required_taaskrs),
        priority: formData.priority,
        total_price: Number(formData.total_price) || 0,
        location_notes: formData.location_notes || "",
      };

      await apiFetch(`/api/bookings/admin/bookings/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/bookings/allBookings");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("Failed to update booking");
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Booking</h1>
          <Link
            href="/bookings/allBookings"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition"
          >
            <ChevronLeft size={20} /> Back
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex gap-3 items-center shadow-sm">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl shadow-sm">
            Booking updated successfully! Redirecting...
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900">
              Edit Booking Details
            </h2>
          </div>

          <form onSubmit={updateBooking} className="p-8 space-y-8">
            {/* Read-only Customer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer
              </label>
              <div className="w-full h-12 px-4 bg-slate-100 rounded-xl flex items-center text-slate-900 font-medium">
                {customerName}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service *
              </label>
              <input
                type="text"
                placeholder="Search service..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
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
                {filteredServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
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

            {/* Scheduled At */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scheduled At *
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            {/* Status & Required Taaskrs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Required Taaskrs *
                </label>
                <input
                  type="number"
                  name="required_taaskrs"
                  value={formData.required_taaskrs}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
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

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t border-slate-200">
              <Link
                href="/bookings/allBookings"
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || success}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium rounded-xl transition shadow-sm flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

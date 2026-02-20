// components/CreateBookingModal.jsx
"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { apiFetch } from "@/utils/api";

// Mock data (replace with API fetches if needed)
const mockCustomers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

const mockServices = [
  { id: 3, name: "Plumbing" },
  { id: 4, name: "Electrical" },
];

const mockAddresses = [
  { id: 5, label: "123 Main St" },
  { id: 6, label: "456 Elm St" },
];

const mockTaaskrs = [
  { id: 7, name: "Taaskr A" },
  { id: 8, name: "Taaskr B" },
  { id: 9, name: "Taaskr C" },
];

const mockPriorities = ["low", "medium", "high"];

export default function CreateBookingModal({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customer: "",
    service: "",
    address: "",
    scheduled_at: "",
    priority: "medium",
    total_price: "",
    location_notes: "",
    taaskr_ids: [],
  });
  const [actionLoading, setActionLoading] = useState(false);

  if (!show) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, taaskr_ids: options }));
  };

  const resetForm = () => {
    setFormData({
      customer: "",
      service: "",
      address: "",
      scheduled_at: "",
      priority: "medium",
      total_price: "",
      location_notes: "",
      taaskr_ids: [],
    });
  };

  const createBooking = async () => {
    try {
      setActionLoading(true);
      const payload = {
        customer: Number(formData.customer),
        service: Number(formData.service),
        address: Number(formData.address),
        scheduled_at: formData.scheduled_at + ":00Z",
        priority: formData.priority,
        total_price: Number(formData.total_price),
        location_notes: formData.location_notes,
        taaskr_ids: formData.taaskr_ids.map(Number),
      };
      await apiFetch("/api/bookings/admin/bookings/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("Booking created successfully");
      onClose();
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert("Failed to create booking");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Add New Booking</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer
                </label>
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                >
                  <option value="">Select Customer</option>
                  {mockCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                >
                  <option value="">Select Service</option>
                  {mockServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <select
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                <option value="">Select Address</option>
                {mockAddresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scheduled At
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              >
                {mockPriorities.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total Price
              </label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location Notes
              </label>
              <textarea
                name="location_notes"
                value={formData.location_notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assign Taaskrs
              </label>
              <select
                multiple
                name="taaskr_ids"
                value={formData.taaskr_ids}
                onChange={handleMultiSelect}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition h-32"
              >
                {mockTaaskrs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createBooking}
                disabled={actionLoading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

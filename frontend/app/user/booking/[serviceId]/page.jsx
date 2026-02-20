"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Calendar,
  Home,
  MessageSquare,
  Plus,
  Minus,
  CheckCircle,
  Info,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

export default function BookingDetails() {
  const router = useRouter();
  const Params = useParams();
  const serviceId = Params?.serviceId;

  const [service, setService] = useState(null);
  const [addons, setAddons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const timeSlots = ["09:00", "11:30", "14:00", "16:30"];

  // ────────────────────────────────────────────────
  // Load data on mount
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!serviceId) {
      router.replace("/");
      return;
    }

    async function fetchAllData() {
      setLoading(true);
      setError("");

      try {
        // Service
        const serviceRes = await apiFetch(
          `/api/services/admin/services/${serviceId}/`,
        );
        if (serviceRes?.error === "TOKEN_EXPIRED") return router.push("/login");
        if (serviceRes?.error || !serviceRes?.id)
          throw new Error("Service not found");
        setService(serviceRes);

        // Addons
        const addonsRes = await apiFetch(`/api/services/${serviceId}/addons/`);
        if (addonsRes?.error === "TOKEN_EXPIRED") return router.push("/login");
        if (!Array.isArray(addonsRes))
          throw new Error("Invalid addons response");

        const mappedAddons = addonsRes
          .filter((a) => a.is_active)
          .map((a) => ({
            id: a.id,
            name: a.name,
            price: Number.parseFloat(a.price) || 0,
            description: a.description || "",
            is_quantity_based:
              a.description?.toLowerCase().includes("per meter") || false,
            quantity: 0,
            checked: false,
          }));
        setAddons(mappedAddons);

        // Addresses
        await refreshAddresses();
      } catch (err) {
        console.error(err);
        setError("Failed to load booking information.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [serviceId, router]);

  // Helper to refresh addresses and select primary/last
  const refreshAddresses = async () => {
    try {
      const addrRes = await apiFetch("/api/users/customer/addresses/");
      if (addrRes?.error === "TOKEN_EXPIRED") return router.push("/login");
      const addrList = Array.isArray(addrRes)
        ? addrRes
        : addrRes?.results || [];
      setAddresses(addrList);

      const primary = addrList.find((a) => a.is_primary);
      if (primary) {
        setSelectedAddress(primary.id);
      } else if (addrList.length > 0) {
        setSelectedAddress(addrList[addrList.length - 1].id);
      }
    } catch (err) {
      console.error("Refresh addresses failed", err);
    }
  };

  // ────────────────────────────────────────────────
  // Add new address + re-fetch
  // ────────────────────────────────────────────────
  const handleAddAddress = async () => {
    if (!newAddress.label?.trim() || !newAddress.street?.trim()) {
      alert("Label and Street are required.");
      return;
    }

    try {
      const created = await apiFetch("/api/users/customer/addresses/", {
        method: "POST",
        body: JSON.stringify(newAddress),
      });

      if (created?.error === "TOKEN_EXPIRED") return router.push("/login");
      if (created?.error) throw new Error("Address creation failed");

      // Re-fetch to ensure consistent shape & newest selection
      await refreshAddresses();

      setShowAddressForm(false);
      setNewAddress({
        label: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err) {
      alert("Could not save address. Please try again.");
    }
  };

  // ────────────────────────────────────────────────
  // Add-on controls
  // ────────────────────────────────────────────────
  const toggleAddon = (index) => {
    setAddons((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const updateQuantity = (index, delta) => {
    setAddons((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = (item.quantity || 0) + delta;
        return { ...item, quantity: Math.max(0, newQty) };
      }),
    );
  };

  // ────────────────────────────────────────────────
  // Pricing (matches backend: no quantity multiplier yet)
  // ────────────────────────────────────────────────
  const basePrice = Number.parseFloat(service?.base_price) || 0;

  const addonsTotal = addons.reduce((sum, item) => {
    const isSelected = item.is_quantity_based
      ? item.quantity > 0
      : item.checked;
    return isSelected ? sum + item.price : sum;
  }, 0);

  const total = basePrice + addonsTotal;

  const isFormValid =
    selectedDate && selectedSlot && selectedAddress && !submitting && !loading;

  // ────────────────────────────────────────────────
  // Submit booking
  // ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);

    try {
      // Flat array of addon IDs - what backend expects
      const selectedAddonIds = addons
        .filter((addon) => {
          if (addon.is_quantity_based) return addon.quantity > 0;
          return addon.checked;
        })
        .map((addon) => addon.id);

      const scheduled_at = new Date(
        `${selectedDate}T${selectedSlot}:00`,
      ).toISOString();

      const payload = {
        service: service.id,
        address: selectedAddress,
        scheduled_at,
        location_notes: instructions.trim(),
        addon_ids: selectedAddonIds,
      };

      const booking = await apiFetch("/api/bookings/customer/bookings/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (booking?.error === "TOKEN_EXPIRED") return router.push("/login");
      if (booking?.error) throw new Error(booking.error || "Booking failed");

      router.push(`/user/payment?bookingId=${booking.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading service details...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 text-xl">
        {error || "Service not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking Details
          </h1>
          <p className="text-lg text-gray-600">
            {service.name || "Service"} • Date, time, address & add-ons
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Date & Time */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber-600" />
                Select Date & Time
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
                    required
                  >
                    <option value="">Select slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Home className="w-6 h-6 text-amber-600" />
                Service Address
              </h2>

              {addresses.length === 0 && (
                <p className="text-gray-500 mb-4">No saved addresses yet.</p>
              )}

              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="font-medium">{addr.label}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {addr.street}, {addr.city} {addr.pincode}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
              >
                <Plus size={18} /> Add New Address
              </button>

              {showAddressForm && (
                <div className="mt-6 space-y-4 border-t pt-5">
                  {["label", "street", "city", "state", "pincode"].map(
                    (field) => (
                      <input
                        key={field}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={newAddress[field]}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    ),
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="bg-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-amber-600" />
                Special Instructions (Optional)
              </h2>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Call before arrival, pet in house, gate code 1234..."
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[100px]"
              />
            </div>

            {/* Add-ons */}
            {addons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Plus className="w-6 h-6 text-amber-600" />
                  Add-ons & Extras
                </h2>

                <div className="space-y-4">
                  {addons.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        (
                          item.is_quantity_based
                            ? item.quantity > 0
                            : item.checked
                        )
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-4 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleAddon(index)}
                            className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ₹{item.price.toFixed(0)}
                              {item.is_quantity_based
                                ? " / meter"
                                : " (one-time)"}
                              {item.description && ` • ${item.description}`}
                            </p>
                          </div>
                        </label>

                        {item.is_quantity_based && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, -1)}
                              disabled={item.quantity <= 0}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}

                        {(item.is_quantity_based
                          ? item.quantity > 0
                          : item.checked) && (
                          <CheckCircle className="w-6 h-6 text-amber-600 ml-3" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Summary */}
          <div className="lg:sticky lg:top-8 space-y-6 self-start">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl p-8">
              <p className="text-sm text-amber-100 font-medium">Total Amount</p>

              {loading ? (
                <p className="text-4xl font-bold mt-1">—</p>
              ) : (
                <p className="text-4xl font-bold mt-1">
                  ₹{Number(total).toFixed(0)}
                </p>
              )}

              <p className="text-xs text-amber-100 mt-1">
                Base: ₹{basePrice.toFixed(0)} + Add-ons
              </p>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full mt-6 py-4 text-lg font-bold rounded-xl shadow-xl transition-all ${
                  isFormValid
                    ? "bg-white text-amber-600 hover:bg-gray-100 active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </button>

              <div className="mt-6 pt-4 border-t border-white/30 text-center text-sm text-amber-100">
                Verified professionals • 30-day warranty
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

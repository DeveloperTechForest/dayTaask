"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ChevronLeft,
  Loader2,
  Plus,
  MessageSquare,
  FileText,
} from "lucide-react";
import { apiFetch } from "@/utils/api";

export default function QuoteDetails() {
  const { quoteId } = useParams();
  const router = useRouter();
  const resolvedQuoteId = Array.isArray(quoteId) ? quoteId[0] : quoteId;

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [instructions, setInstructions] = useState("");

  const timeSlots = [
    { value: "09:00", label: "Morning (9 AM - 12 PM)" },
    { value: "12:00", label: "Afternoon (12 PM - 4 PM)" },
    { value: "16:00", label: "Evening (4 PM - 8 PM)" },
  ];

  const responseMatches = useMemo(() => {
    if (!quote) return false;
    if (!quote.custom_service_id) return false;
    return true;
  }, [quote]);

  useEffect(() => {
    const normalizePreferredSlot = (slot) => {
      if (!slot) return "";
      const lower = slot.toLowerCase();
      if (lower.includes("morning")) return "09:00";
      if (lower.includes("afternoon")) return "12:00";
      if (lower.includes("evening")) return "16:00";
      if (["09:00", "12:00", "16:00"].includes(slot)) return slot;
      return "";
    };

    const loadQuote = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(
          `/api/bookings/customer/quote-requests/${resolvedQuoteId}/`
        );
        if (data?.error) throw new Error(data.detail || "Failed to load quote");
        setQuote(data);
        if (data.preferred_date) {
          setSelectedDate(data.preferred_date);
        }
        if (data.preferred_time_slot) {
          setSelectedSlot(normalizePreferredSlot(data.preferred_time_slot));
        }
      } catch (err) {
        setError(err?.message || "Failed to load quote");
      } finally {
        setLoading(false);
      }
    };

    const loadAddresses = async () => {
      try {
        const addrRes = await apiFetch("/api/users/customer/addresses/");
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
      } catch {
        // ignore
      }
    };

    if (!resolvedQuoteId || resolvedQuoteId === "undefined") {
      return;
    }
    loadQuote();
    loadAddresses();
  }, [resolvedQuoteId]);

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

      if (created?.error) throw new Error("Address creation failed");

      const fresh = await apiFetch("/api/users/customer/addresses/");
      const addrList = Array.isArray(fresh) ? fresh : fresh?.results || [];
      setAddresses(addrList);
      if (addrList.length > 0) {
        setSelectedAddress(addrList[addrList.length - 1].id);
      }

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

  const handleConfirmBooking = async () => {
    if (!responseMatches) {
      setError("Quote response is not available yet.");
      return;
    }
    if (!selectedDate || !selectedSlot || !selectedAddress) {
      setError("Please select date, time, and address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const scheduled_at = new Date(
        `${selectedDate}T${selectedSlot}:00`
      ).toISOString();

      const payload = {
        service: quote.service,
        custom_service: quote.custom_service_id,
        address: selectedAddress,
        scheduled_at,
        location_notes: instructions.trim(),
      };

      const booking = await apiFetch("/api/bookings/customer/bookings/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (booking?.error) throw new Error(booking.error || "Booking failed");

      router.push(`/user/payment?bookingId=${booking.id}`);
    } catch (err) {
      setError(err?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg text-red-600">
        {error}
      </div>
    );
  }

  if (!quote) return null;

  if (!responseMatches) {
    return (
      <div className="min-h-screen bg-light-bg">
        <Header />
        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-brand cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-lg">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Quote response is not ready
            </h1>
            <p className="text-muted-foreground">
              We are still waiting on the quote response for this request.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const totalAmount = Number(quote.custom_service_price || 0);

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-brand cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
            Confirm Your Booking
          </h1>
          <p className="text-xl text-muted-foreground">
            Review details and schedule your service
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-foreground">Quote Details</h2>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold">
                  {quote.custom_service_name || quote.service_name}
                </p>
                <p className="text-muted-foreground">
                  {quote.custom_service_description || quote.problem_description}
                </p>
                <p className="text-muted-foreground">
                  Duration: {quote.custom_service_duration_minutes || 0} minutes
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-7 h-7 text-yellow-500" />
                Choose Date and Time
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-yellow-500" />
                Service Address
              </h2>

              {addresses.length === 0 && (
                <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
              )}

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      selectedAddress === addr.id
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-border hover:border-yellow-300"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{addr.label}</p>
                    <p className="text-muted-foreground">
                      {addr.street}, {addr.city} {addr.pincode}
                    </p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="mt-4 text-yellow-600 font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>

              {showAddressForm && (
                <div className="mt-6 space-y-3 border-t pt-4">
                  {Object.keys(newAddress).map((field) => (
                    <input
                      key={field}
                      value={newAddress[field]}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full px-4 py-2.5 border border-border rounded-xl"
                    />
                  ))}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddAddress}
                      className="px-5 py-2.5 bg-yellow-500 text-white rounded-xl"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-5 py-2.5 border border-border rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-yellow-500" />
                Special Instructions (Optional)
              </h2>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., Call before arrival"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6">
                  <h3 className="text-2xl font-bold">Booking Summary</h3>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="font-bold text-lg text-foreground">
                      {quote.custom_service_name || quote.service_name}
                    </h4>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                      <Clock className="w-5 h-5" />
                      Estimated: {quote.custom_service_duration_minutes || 0} minutes
                    </p>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between text-foreground">
                    <span>Service Cost</span>
                    <span className="font-semibold">
                      INR {totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-foreground">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-yellow-600">
                      INR {totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    className="w-full bg-yellow-500 text-white font-bold text-xl py-5 rounded-xl hover:bg-yellow-600 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <CreditCard className="w-6 h-6" />
                    )}
                    Proceed to Payment
                  </button>

                  {error && (
                    <div className="text-red-600 text-center font-medium mt-2">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

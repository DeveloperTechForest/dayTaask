"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { apiFetch } from "@/utils/api";
import { Loader2 } from "lucide-react";

export default function PastQuotesPage() {
  const router = useRouter();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/bookings/customer/quote-requests/");
        const list = Array.isArray(res?.results) ? res.results : res || [];
        setQuoteRequests(list);
      } catch (err) {
        setQuoteRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const getQuoteStatusLabel = (status) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "quoted") return "Quote Sent";
    if (normalized === "accepted") return "Accepted";
    if (normalized === "rejected") return "Rejected";
    if (normalized === "cancelled") return "Cancelled";
    if (normalized === "expired") return "Expired";
    return status || "Pending";
  };

  const isQuotePast = (quote) => {
    const status = (quote.status || "").toLowerCase();
    if (quote.booking_id) return true;
    return ["accepted", "rejected", "expired", "cancelled"].includes(status);
  };

  const pastQuoteRequests = quoteRequests.filter((q) => isQuotePast(q));

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-3xl font-bold text-foreground">Past Quotes</h1>
          <button
            onClick={() => router.push("/user/quote/quote-request")}
            className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600"
          >
            Request New Quote
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading past quotes...
          </div>
        ) : pastQuoteRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No past quote requests
          </p>
        ) : (
          <div className="space-y-4">
            {pastQuoteRequests.map((quote) => (
              <div
                key={quote.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground">
                    Quote {quote.quote_code || quote.id}
                  </p>
                  <h4 className="text-lg font-bold">
                    {quote.custom_service_name || quote.service_name || "Service"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Status: {getQuoteStatusLabel(quote.custom_service_status || quote.status)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/user/quote/${quote.id}`)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100"
                  >
                    View
                  </button>
                  {quote.booking_id && (
                    <button
                      onClick={() => router.push(`/user/tracking/${quote.booking_id}`)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
                    >
                      View Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

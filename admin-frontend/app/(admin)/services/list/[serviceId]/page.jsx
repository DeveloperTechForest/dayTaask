// app/services/preview/[serviceId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Clock,
  Shield,
  CheckCircle,
  ArrowLeft,
  Link2,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import Link from "next/link";

export default function ServicePreview() {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        setError("Invalid service ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch(
          `/api/services/admin/services/${serviceId}/`
        );
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Service not found or failed to load");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${
      mins > 0 ? `${mins}m` : ""
    }`.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-500">{error || "Service not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header - Matching Screenshot */}
      <header className=" border-b-2 border-gray-300 mb-6">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/services/list/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>

            {/* Title & Short Description */}
            <div className="px-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-gray-600">
                {service.short_description}
              </p>
            </div>

            {/* Rating + Info Row */}
            <div className="flex flex-wrap items-center gap-6 px-2">
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-medium">
                <Star className="w-5 h-5 fill-current" />
                4.8 (234 reviews)
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                {formatDuration(service.duration_minutes)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5" />
                {service.warranty_days} days warranty
              </div>
            </div>

            {/* Slug + Created At + Updated At */}
            <div className="flex flex-wrap flex-col  gap-6 px-2">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Link2 className="w-5 h-5" />
                  <span className="font-bold">Slug : </span> {service.slug}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">Duration:</span>
                  {formatDuration(service.duration_minutes)}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />{" "}
                  <span className="font-bold">Created At:</span>
                  {new Date(service.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">Updated At:</span>{" "}
                  {new Date(service.updated_at).toLocaleDateString()}
                </div>{" "}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">What's Included</h2>
              <ul className="space-y-4">
                {(service.whats_included || []).length > 0 ? (
                  service.whats_included.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No items specified</li>
                )}
              </ul>
            </div>

            {/* Service Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Service Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <p className="text-sm text-gray-500 mb-1">
                  {service.price_unit}
                </p>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ₹{parseFloat(service.base_price).toLocaleString("en-IN")}
                </div>
                <p className="text-sm text-gray-500 mb-8">+ applicable taxes</p>

                <div className="space-y-4">
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl transition shadow-md cursor-not-allowed"
                    disabled
                  >
                    Book Now
                  </button>
                  <button
                    className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-bold py-4 rounded-xl transition cursor-not-allowed"
                    disabled
                  >
                    Get Custom Quote
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t space-y-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Service Guarantee
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.warranty_days} days warranty
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Verified Experts
                      </p>
                      <p className="text-sm text-gray-600">
                        Background checked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

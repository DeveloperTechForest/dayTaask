"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Shield, CheckCircle, ArrowLeft } from "lucide-react";

export default function ServiceDetail() {
  const { categoryId, serviceId } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⛳ Fetch service details
  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/services/services-detail/${serviceId}/`,
        );

        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  // ⛳ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading service...</p>
      </div>
    );
  }

  // ⛳ Not found
  if (!service) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <p className="text-2xl text-gray-500">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      {/* Back Button */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-foreground transition-brand cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-brand-lg">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Short Description */}
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
                {service.name}
              </h1>
              <p className="text-lg text-gray-500">
                {service.short_description}
              </p>
            </div>

            {/* Rating, Duration, Warranty */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2 font-medium">
                <Star className="w-4 h-4 fill-current" />
                4.8 (234 reviews)
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{service.duration_minutes} minutes</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="w-4 h-4" />
                <span>{service.warranty_days} days warranty</span>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-6 bg-card rounded-xl border">
              <h2 className="font-bold text-xl mb-4">What's Included</h2>
              <ul className="space-y-3">
                {service.whats_included?.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-600 gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Description */}
            <div className="p-6 bg-card rounded-xl border">
              <h2 className="font-bold text-xl mb-4">Service Description</h2>

              <p className="text-gray-500 whitespace-pre-line">
                {service.description}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-6 bg-card rounded-xl border shadow-brand-xl space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Starting from</p>
                  <div className="font-bold text-4xl text-foreground">
                    ₹{service.base_price}
                  </div>
                  <p className="text-sm text-gray-500">+ applicable taxes</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/user/booking/${serviceId}`)}
                    className="w-full bg-yellow-500 text-white font-bold py-4 rounded-xl hover:bg-yellow-500/80 transition cursor-pointer"
                  >
                    Book Now
                  </button>

                  <button
                    onClick={() => router.push("/user/quote/quote-request")}
                    className="w-full border-2 border-yellow-500 text-yellow-500 font-bold py-4 rounded-xl hover:bg-yellow-100 hover:text-yellow-600 transition cursor-pointer"
                  >
                    Get Custom Quote
                  </button>
                </div>

                <div className="pt-4 border-t space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold">Service Guarantee</p>
                      <p className="text-gray-500">
                        {service.warranty_days} days warranty
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold">Verified Experts</p>
                      <p className="text-gray-500">Background checked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Booking Card Ends */}
        </div>
      </div>
    </div>
  );
}

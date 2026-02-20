// app/quote-request/page.jsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Upload,
  X,
  Calendar,
  Clock,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle2,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function QuoteRequest() {
  const router = useRouter();

  const [problem, setProblem] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New: Category & Service Selection
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");

  // Service Data
  const serviceCategories = {
    electrical: {
      name: "Electrical",
      services: [
        "Complete House Wiring",
        "Switch & Socket Installation",
        "Ceiling Fan Installation",
        "Inverter/UPS Installation",
        "MCB & Wiring Repair",
        "Emergency Electrical Repair",
      ],
    },
    plumbing: {
      name: "Plumbing",
      services: [
        "Tap Repair & Replacement",
        "Pipe Leakage Repair",
        "Bathroom Fitting Installation",
        "Water Tank Cleaning",
        "Motor Pump Repair",
        "Geyser Installation",
      ],
    },
    cleaning: {
      name: "Cleaning & Pest Control",
      services: [
        "Full Home Deep Cleaning",
        "Sofa & Carpet Cleaning",
        "Bathroom Deep Cleaning",
        "Kitchen Deep Cleaning",
        "Cockroach Pest Control",
        "Termite Control",
      ],
    },
    appliances: {
      name: "Appliance Repair",
      services: [
        "AC Service & Repair",
        "Washing Machine Repair",
        "Refrigerator Repair",
        "Microwave Repair",
        "RO Water Purifier Service",
        "Geyser Repair",
      ],
    },
  };

  // Get available services based on selected category
  const availableServices = useMemo(() => {
    if (!selectedCategory || !serviceCategories[selectedCategory]) return [];
    return serviceCategories[selectedCategory].services;
  }, [selectedCategory]);

  // Reset service when category changes
  useMemo(() => {
    setSelectedService("");
  }, [selectedCategory]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim() || !selectedCategory || !selectedService) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newQuoteId = Date.now();
    router.push(`/user/quote/${newQuoteId}`);
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-brand"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Get Free Quotes
          </h1>
          <p className="text-xl text-muted-foreground">
            Tell us what you need — verified experts will respond in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category & Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Category */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <label className="flex items-center gap-3 text-lg font-semibold text-foreground mb-4">
                Service Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer text-foreground"
                >
                  <option value="">Select category</option>
                  {Object.entries(serviceCategories).map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Specific Service */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <label className="flex items-center gap-3 text-lg font-semibold text-foreground mb-4">
                Specific Service
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  disabled={!selectedCategory}
                  className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedCategory
                      ? "Select service"
                      : "First select category"}
                  </option>
                  {availableServices.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <label className="block text-lg font-semibold text-foreground mb-4">
              Describe Your Problem
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={`e.g., I need ${selectedService || "help with"}...`}
              required
              rows={6}
              className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-foreground placeholder-muted-foreground"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Include details like brand, model, symptoms, and when it started
            </p>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <label className="flex items-center gap-3 text-lg font-semibold text-foreground mb-4">
                <Calendar className="w-6 h-6 text-yellow-500" />
                Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <label className="flex items-center gap-3 text-lg font-semibold text-foreground mb-4">
                <Clock className="w-6 h-6 text-yellow-500" />
                Preferred Time
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-5 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              >
                <option value="">Any time</option>
                <option value="Morning">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <label className="flex items-center gap-3 text-lg font-semibold text-foreground mb-6">
              <ImageIcon className="w-6 h-6 text-yellow-500" />
              Add Photos (Optional)
            </label>

            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-yellow-500/50 transition-all">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Click to upload images
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-xl border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !problem.trim() ||
                !selectedCategory ||
                !selectedService
              }
              className="px-12 py-5 bg-yellow-500 text-white font-bold text-xl rounded-xl hover:bg-yellow-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Free Quotes
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Thousands of customers trust us every day
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span>Verified Experts Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span>Responses in less than 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <span>100% Safe & Secure</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

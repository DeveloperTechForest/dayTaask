"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ServicesByCategory() {
  const { categoryId } = useParams();
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const controller = new AbortController();
    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const url = `http://localhost:8000/api/services/category/${encodeURIComponent(
          categoryId,
        )}/services/`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const json = await res.json();

        // If your endpoint returns a list directly, use json.results or json (adjust as needed)
        // I will assume it returns a paginated object OR a list. Handle both:
        const rawList = Array.isArray(json) ? json : (json.results ?? []);

        // Map backend fields to your frontend shape
        const formatted = rawList.map((s) => ({
          id: s.id,
          slug:
            s.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, "") // remove special chars
              .trim()
              .replace(/\s+/g, "-") || `service-${s.id}`,
          title: s.name,
          description: s.short_description || s.description || "",
          price: s.base_price ? `₹${s.base_price}` : "Price on request",
          image:
            s.image && s.image !== "null"
              ? s.image
              : "/images/service-fallback.jpg", // change fallback as you like
          rating: s.rating ?? 4.8, // placeholder if backend doesn't provide rating
          bookings: s.bookings ?? 0, // placeholder
        }));

        setServices(formatted);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load services:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadServices();

    return () => controller.abort();
  }, [categoryId]);

  // Format category name
  const categoryName = categoryId
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-3">
            {categoryName} Services
          </h1>
          <p className="text-lg text-muted-foreground">
            {loading
              ? "Loading..."
              : `${services.length} professional services available`}
          </p>
        </div>

        {/* Search & Filters Bar (same UI as before) */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-brand"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-brand cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-6 py-3.5 bg-background border border-border rounded-xl hover:bg-secondary/5 transition-brand font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border">
              {/* ... price range UI (same as before) ... */}
              <div className="space-y-6">
                <div>
                  <label className="text-foreground font-medium text-lg">
                    Price Range
                  </label>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-2 bg-secondary rounded-full transition-all"
                    style={{
                      left: `${(priceRange[0] / 10000) * 100}%`,
                      right: `${100 - (priceRange[1] / 10000) * 100}%`,
                    }}
                  ></div>

                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      if (newMin < priceRange[1])
                        setPriceRange([newMin, priceRange[1]]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                  />

                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      if (newMax > priceRange[0])
                        setPriceRange([priceRange[0], newMax]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val < priceRange[1])
                        setPriceRange([val, priceRange[1]]);
                    }}
                    className="w-32 px-4 py-2 text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Min"
                  />
                  <span className="text-muted-foreground">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= 10000 && val > priceRange[0])
                        setPriceRange([priceRange[0], val]);
                    }}
                    className="w-32 px-4 py-2 text-center border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20">Loading services...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">Error: {error}</div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() =>
                  router.push(`/categories/${categoryId}/${service.id}`)
                }
                className="cursor-pointer group"
              >
                <div className="transform transition-transform group-hover:scale-[1.02]">
                  <ServiceCard
                    image={service.image}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    rating={service.rating}
                    bookings={service.bookings}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-6">
              No services found for this category
            </p>
            <button
              onClick={() => router.push("/quote-request")}
              className="px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-amber-600 transition-brand shadow-lg text-lg"
            >
              Request Custom Quote
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

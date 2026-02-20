// app/page.js

"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  Calendar,
  Settings,
  Wallet,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ShieldCheck, Clock, ThumbsUp } from "lucide-react";
import Link from "next/link";

// ────────────────────────────────────────────────
// Reusable button styles (same as your previous design)
// ────────────────────────────────────────────────
const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-d)] focus:ring-[var(--color-primary)] shadow-md",
  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]",
  ghost:
    "hover:bg-gray-100/80 text-[var(--color-text)] focus:ring-[var(--color-primary)]",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-8 text-base",
  xl: "h-14 px-10 text-lg",
};

// ────────────────────────────────────────────────
// How DayTaask Works – Customer view (concise)
// ────────────────────────────────────────────────
const howItWorksSteps = [
  {
    step: "01",
    icon: Search,
    title: "Find & Choose",
    description: "Search services and pick trusted professionals",
  },
  {
    step: "02",
    icon: Calendar,
    title: "Book Instantly",
    description: "Select date, time — confirmed in seconds",
  },
  {
    step: "03",
    icon: ShieldCheck,
    title: "Relax & Enjoy",
    description: "Service done — pay only when satisfied",
  },
];

// ────────────────────────────────────────────────
// Customer Testimonials
// ────────────────────────────────────────────────
const testimonials = [
  {
    name: "Anjali Mehta",
    location: "Bangalore",
    rating: 5,
    text: "Found a fantastic cleaner in minutes. House looks brand new — polite and thorough!",
  },
  {
    name: "Vikram Singh",
    location: "Mumbai",
    rating: 5,
    text: "AC technician arrived on time, fixed everything perfectly. No overcharging. Super happy!",
  },
  {
    name: "Neha Kapoor",
    location: "Delhi",
    rating: 5,
    text: "Plumber was professional, cleaned up after work. Best home service experience ever.",
  },
  {
    name: "Rohan Patel",
    location: "Pune",
    rating: 5,
    text: "Booked shifting service — stress-free move. Team was punctual and careful with items.",
  },
];

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:8000/api/services/home/");
        const data = await res.json();
        setHomeData(data);
      } catch (error) {
        console.error("API error:", error);
      }
    }
    loadData();
  }, []);

  if (!homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading amazing services...
        </p>
      </div>
    );
  }

  const { categories, top_services } = homeData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/80 font-sans">
      <Header />

      {/* Hero – Customer focused */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Happy home"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Your Home, <span className="text-yellow-400">Hassle-Free</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 font-light max-w-3xl mx-auto">
              Verified professionals for cleaning, repairs, beauty & more —
              booked in minutes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto pt-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="What help do you need today?"
                  className="w-full h-14 pl-12 pr-4 bg-white/95 backdrop-blur border-0 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/40 transition-all text-lg"
                />
              </div>
              <button className="h-14 px-10 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95">
                Find Help Now
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                Verified Professionals
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Same-day Service
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-400" />
                4.9★ Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
            Popular Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted home solutions loved by thousands
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/categories/${cat.id}`)}
              className="group p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-2xl hover:border-yellow-400/40 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <img src={cat.icon} className="w-12 h-12" alt={cat.name} />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/categories")}
            className="h-12 px-10 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition-all text-lg shadow-lg hover:shadow-xl"
          >
            See All Services
          </button>
        </div>
      </section>

      {/* How DayTaask Works – Fully Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14 lg:mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-4.5xl lg:text-5xl text-foreground tracking-tight">
              How DayTaask Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto">
              Hassle-free home services in three simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connection Line – only on md+ */}
            <div className="hidden md:block absolute top-42 left-[16%] right-[16%] h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.step}
                  className="relative text-center transform transition-all duration-700 opacity-0 translate-y-8 sm:translate-y-10 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step Number Badge */}
                  <div className="relative z-10 mx-auto mb-5 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-4 border-yellow-500 flex items-center justify-center font-bold text-xl sm:text-2xl text-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>

                  {/* Icon Container */}
                  <div className="mx-auto mb-4 sm:mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center shadow-inner group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-400">
                    <step.icon className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-4 max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Most Booked Services */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 mb-12">
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
                  Most Loved Services
                </h2>
                <p className="text-xl text-muted-foreground">
                  Trusted by thousands every month
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {top_services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() =>
                      router.push(
                        `/categories/${service.category}/${service.id}`,
                      )
                    }
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl hover:border-yellow-400/40 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="font-heading font-bold text-2xl text-foreground group-hover:text-yellow-600 transition-colors">
                        {service.name}
                      </h3>

                      <p className="text-gray-600 text-base line-clamp-2">
                        {service.short_description}
                      </p>

                      <div className="flex justify-between items-center pt-4">
                        <div>
                          <span className="text-sm text-gray-500 block">
                            Starting from
                          </span>
                          <p className="font-bold text-2xl text-foreground">
                            ₹{service.base_price}
                          </p>
                        </div>
                        <button className="px-6 py-3 bg-yellow-500 text-white font-medium rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Button */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            <Link href="/categories">
              <button className="h-12 sm:h-14 px-8 sm:px-12 bg-yellow-500 text-white font-semibold text-base sm:text-xl rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-95 inline-flex items-center gap-2 sm:gap-3">
                Book Your First Service
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from happy customers across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative animate-fade-in-up group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Quote className="absolute top-6 left-6 w-12 h-12 text-yellow-500/10" />

                <div className="flex mb-5">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-6 h-6 text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-6">
            Ready for a Cleaner, Better Home?
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Join thousands of happy customers who trust DayTaask every day
          </p>

          <Link href="/register">
            <button className="h-16 px-12 bg-yellow-500 text-white font-bold rounded-full hover:bg-yellow-600 transition-all text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.04] active:scale-95 inline-flex items-center gap-3">
              Book Your Service Now
              <ChevronRight className="w-7 h-7" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

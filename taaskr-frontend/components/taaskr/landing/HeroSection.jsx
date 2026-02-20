// components/taaskr/landing/HeroSection.jsx

import Link from "next/link";
import { Star, ChevronRight, Play, IndianRupee } from "lucide-react";
// import heroWorker from "@/assets/taaskr-hero-worker.jpg"; // uncomment when you have the image
import { buttonStyles, buttonSizes } from "@/lib/buttonStyles";
const heroWorker = "./taaskr/taaskr-hero-worker-BefggdU3.jpg"; // Placeholder image

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />

      <div className="container relative py-16 px-4 md:py-24 md:px-6 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mx-auto lg:mx-0">
              <Star className="w-4 h-4 fill-current" />
              Join 10,000+ service professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              Turn Your Skills Into{" "}
              <span className="gradient-text">Income</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-text-light)] max-w-lg mx-auto lg:mx-0">
              Join DayTaask as a service provider. Set your own schedule, choose
              your jobs, and earn on your terms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/register">
                <button
                  className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonSizes.lg} gap-2 shadow-xl hover:scale-105 hover:opacity-90 transition-all duration-300`}
                >
                  Become a Taaskr
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>

              <button className="flex items-center gap-3 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-sm">
                  <Play className="w-5 h-5 fill-current text-[var(--color-primary)]" />
                </div>
                <span className="font-medium">Watch how it works</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[var(--color-bg)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]"
                  />
                ))}
              </div>
              <div className="text-sm text-[var(--color-text-light)]">
                <span className="font-semibold text-[var(--color-text)]">
                  4.8★
                </span>{" "}
                from 2,000+ reviews
              </div>
            </div>
          </div>

          {/* Right image (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)]/50">
              <img
                src={heroWorker}
                alt="Professional Taaskr service provider"
                className="w-full h-auto object-cover"
              />
              {/* <div className="w-full h-[500px] bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                <span className="text-6xl opacity-30">Worker</span>
              </div> */}
            </div>

            {/* Floating earnings card */}
            <div className="absolute -left-8 top-1/4 z-20 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] p-5 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-[var(--color-success)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-light)]">
                    Today's Earnings
                  </p>
                  <p className="font-bold text-xl">₹2,450</p>
                </div>
              </div>
            </div>

            {/* Floating rating card */}
            <div
              className="absolute -right-4 bottom-1/4 z-20 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] p-5 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[var(--color-warning)] fill-current"
                    />
                  ))}
                </div>
                <span className="font-semibold">4.9</span>
              </div>
              <p className="text-xs text-[var(--color-text-light)] mt-1">
                Excellent rating!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// components/taaskr/landing/CTASection.jsx

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import { buttonStyles, buttonSizes } from "@/lib/buttonStyles";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 ">
      <div className="container">
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 shadow-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
          {/* Decorative blurred circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-5">
              Ready to Start Earning?
            </h2>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto">
              Join thousands of skilled professionals who are already earning
              with DayTaask. Your next job is just a tap away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button
                  className={`bg-white text-[var(--color-primary)] ${buttonStyles.base} ${buttonSizes.xl} gap-2 shadow-xl hover:scale-105 hover:opacity-90 transition-all duration-300`}
                >
                  Get Started Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>

              <button
                className={`${buttonStyles.base} ${buttonStyles.outline} ${buttonSizes.xl} gap-2 border-white/30 text-white hover:bg-white/10`}
              >
                <Download className="w-5 h-5" />
                Download App
              </button>
            </div>

            {/* App store badges */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <div className="bg-white/10 backdrop-blur rounded-lg px-5 py-2.5 text-sm font-medium">
                📱 Available on Play Store
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-5 py-2.5 text-sm font-medium">
                🍎 Coming soon to App Store
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

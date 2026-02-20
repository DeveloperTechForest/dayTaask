// components/taaskr/landing/EarningsSection.jsx

import { Check } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonStyles, buttonSizes } from "@/lib/buttonStyles";
// import earningsImg from "@/assets/taaskr-earnings.jpg";

const earningFeatures = [
  "No commission on first 10 jobs",
  "Weekly payouts to your bank",
  "Bonus for high ratings",
  "Referral rewards up to ₹5,000",
  "Peak hour surge pricing",
  "Loyalty rewards program",
];

export function EarningsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image / Placeholder */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border)]/50">
              {/* Replace with real image when available */}
              <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center">
                {/* <span className="text-6xl opacity-30">Earnings</span> */}
                <img
                  src="./taaskr/taaskr-earnings-D-z8cX4p.jpg"
                  alt="Earnings"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating earnings card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[var(--color-surface)]/95 backdrop-blur rounded-xl p-5 shadow-xl border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--color-text-light)]">
                    Monthly Earnings
                  </span>
                  <span className="text-xs text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-1 rounded-full">
                    +23% vs last month
                  </span>
                </div>

                <div className="text-3xl font-bold font-display">₹47,520</div>

                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border)]">
                  <div>
                    <p className="text-xs text-[var(--color-text-light)]">
                      Jobs
                    </p>
                    <p className="font-semibold">48</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-light)]">
                      Avg/Job
                    </p>
                    <p className="font-semibold">₹990</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-light)]">
                      Rating
                    </p>
                    <p className="font-semibold">4.9★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
              Earnings
            </span>

            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Maximize Your Earnings
            </h2>

            <p className="text-lg text-[var(--color-text-light)]">
              Our transparent pricing and bonus system helps you earn more with
              every job you complete.
            </p>

            <ul className="space-y-4">
              {earningFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[var(--color-success)]" />
                  </div>
                  <span className="text-[var(--color-text)]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <button
                className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonSizes.lg} mt-6 gap-2 shadow-xl hover:scale-105 hover:opacity-90 transition-all duration-300`}
              >
                Start Earning Today
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

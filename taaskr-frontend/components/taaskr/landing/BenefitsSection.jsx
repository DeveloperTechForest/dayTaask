// components/taaskr/landing/BenefitsSection.jsx

import {
  IndianRupee,
  Clock,
  Shield,
  TrendingUp,
  MapPin,
  Headphones,
} from "lucide-react";

const benefits = [
  {
    icon: IndianRupee,
    title: "Earn Great Money",
    description:
      "Set your own rates and earn up to ₹50,000/month with competitive job pricing",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "Work when you want, as much as you want. Full control over your schedule",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Get paid directly to your bank account within 24 hours of job completion",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Build your reputation with ratings and get more customers over time",
  },
  {
    icon: MapPin,
    title: "Work Nearby",
    description:
      "Get jobs in your preferred area. No long commutes, more efficiency",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our support team is always available to help you with any issues",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-2 mb-4">
            Why Join Taaskr?
          </h2>
          <p className="text-[var(--color-text-light)]">
            Everything you need to run your service business successfully
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]/50 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-primary)]/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7 text-[var(--color-primary)]" />
              </div>

              <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
              <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

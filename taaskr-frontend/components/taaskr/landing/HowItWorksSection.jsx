// components/taaskr/landing/HowItWorksSection.jsx

import { UserPlus, Settings, Wallet } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Sign Up & Verify",
    description:
      "Create your profile, upload your documents, and complete verification in minutes",
  },
  {
    step: "02",
    icon: Settings,
    title: "Set Availability",
    description:
      "Choose your services, set your rates, and define your working hours and areas",
  },
  {
    step: "03",
    icon: Wallet,
    title: "Start Earning",
    description:
      "Accept job requests, deliver quality service, and receive payments instantly",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-[var(--color-text-light)]">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary)]/30" />

            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Step circle */}
                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-2xl font-display mb-6 shadow-lg shadow-[var(--color-primary)]/25 mx-auto">
                  <item.icon className="w-8 h-8" />
                </div>

                {/* Step number badge */}
                <div className="absolute -top-10  left-1/2 transform -translate-x-1/2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm">
                  Step {item.step}
                </div>

                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-light)] leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

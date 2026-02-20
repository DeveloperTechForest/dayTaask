// app/page.js    (or app/taaskr/landing/page.js if you prefer separate route)

import Link from "next/link";
import { Logo } from "@/components/taaskr/Logo";
import { ChevronRight } from "lucide-react";

// Import all landing sections (you'll provide these next)
import { HeroSection } from "@/components/taaskr/landing/HeroSection";
import { StatsSection } from "@/components/taaskr/landing/StatsSection";
import { ServicesSection } from "@/components/taaskr/landing/ServicesSection";
import { BenefitsSection } from "@/components/taaskr/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/taaskr/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/taaskr/landing/TestimonialsSection";
import { EarningsSection } from "@/components/taaskr/landing/EarningsSection";
import { CTASection } from "@/components/taaskr/landing/CTASection";
import { Footer } from "@/components/taaskr/landing/Footer";
import { buttonStyles, buttonSizes } from "@/lib/buttonStyles";

export default function TaaskrLanding() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header – matches inner pages style */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Logo size="md" />

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button
                className={`${buttonStyles.base} ${buttonStyles.ghost} ${buttonSizes.default}`}
              >
                Sign In
              </button>
            </Link>

            <Link href="/register" className="hidden sm:block">
              <button
                className={`${buttonStyles.base} ${buttonStyles.primary} ${buttonSizes.default} gap-2`}
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* All landing sections */}
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <EarningsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

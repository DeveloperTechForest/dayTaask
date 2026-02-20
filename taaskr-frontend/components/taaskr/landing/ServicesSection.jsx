// components/taaskr/landing/ServicesSection.jsx

import {
  Zap,
  Droplets,
  Sparkles,
  Wrench,
  PaintBucket,
  Truck,
} from "lucide-react";
// import electricianImg from "@/assets/taaskr-electrician.jpg"; // etc.

const services = [
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, repairs, installations",
    image: "./taaskr/taaskr-electrician-B8-jJpa6.jpg", // Placeholder image
    earnings: "₹800-2000/job",
  },
  {
    icon: Droplets,
    title: "Plumbing",
    description: "Repairs, fittings, maintenance",
    image: "./taaskr/taaskr-plumber-BSodYoew.jpg", // Placeholder image
    earnings: "₹600-1500/job",
  },
  {
    icon: Sparkles,
    title: "Cleaning",
    description: "Home & office cleaning",
    image: "./taaskr/taaskr-cleaner-D5DPI_rB.jpg", // Placeholder image
    earnings: "₹500-1200/job",
  },
  {
    icon: Wrench,
    title: "Appliance Repair",
    description: "AC, washing machine, fridge",
    earnings: "₹700-2500/job",
  },
  {
    icon: PaintBucket,
    title: "Painting",
    description: "Interior & exterior painting",
    earnings: "₹1000-5000/job",
  },
  {
    icon: Truck,
    title: "Shifting",
    description: "Packing & moving services",
    earnings: "₹1500-8000/job",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-2 mb-4">
            Pick Your Services
          </h2>
          <p className="text-[var(--color-text-light)]">
            Choose from a wide range of services and start earning in categories
            you excel at
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)]/50 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-primary)]/30 transition-all duration-300"
            >
              {/* Gradient or image placeholder */}
              <div className="h-48 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <service.icon className="w-20 h-20 text-[var(--color-primary)]/30 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-semibold text-xl">{service.title}</h3>
                </div>

                <p className="text-sm text-[var(--color-text-light)] mb-4">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-light)]">
                    Avg. Earnings
                  </span>
                  <span className="font-semibold text-[var(--color-success)]">
                    {service.earnings}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

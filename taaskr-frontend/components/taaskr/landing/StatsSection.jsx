// components/taaskr/landing/StatsSection.jsx

const stats = [
  { value: "10K+", label: "Active Taaskrs" },
  { value: "₹2Cr+", label: "Paid to Taaskrs" },
  { value: "4.8★", label: "Average Rating" },
  { value: "50K+", label: "Jobs Completed" },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-[var(--color-primary)] text-white relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-display">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/80 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

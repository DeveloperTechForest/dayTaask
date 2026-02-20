// components/taaskr/landing/TestimonialsSection.jsx

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Electrician",
    location: "Mumbai",
    rating: 5,
    earnings: "₹45,000/month",
    text: "DayTaask changed my life! I was struggling to find consistent work before. Now I have a steady stream of customers and earn more than I ever did.",
  },
  {
    name: "Priya Sharma",
    role: "Home Cleaner",
    location: "Bangalore",
    rating: 5,
    earnings: "₹35,000/month",
    text: "The flexibility is amazing. I can work around my family schedule and still earn great money. The app is so easy to use!",
  },
  {
    name: "Mohammed Ali",
    role: "Plumber",
    location: "Delhi",
    rating: 5,
    earnings: "₹52,000/month",
    text: "I've been a Taaskr for 2 years now. The support team is fantastic and payments are always on time. Highly recommend!",
  },
  {
    name: "Sunita Devi",
    role: "AC Technician",
    location: "Pune",
    rating: 5,
    earnings: "₹48,000/month",
    text: "The verification process was smooth and I started getting jobs within a week. Best decision I made for my career.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[var(--color-primary)] font-medium text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-2 mb-4">
            Hear From Our Taaskrs
          </h2>
          <p className="text-[var(--color-text-light)]">
            Real stories from service professionals who transformed their
            careers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]/50 p-6 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-[var(--color-primary)]/20 mb-5" />

              <p className="text-[var(--color-text-light)] mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[var(--color-warning)] fill-current"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-[var(--color-text-light)]">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-light)]">
                    Earnings
                  </p>
                  <p className="font-semibold text-[var(--color-success)]">
                    {testimonial.earnings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

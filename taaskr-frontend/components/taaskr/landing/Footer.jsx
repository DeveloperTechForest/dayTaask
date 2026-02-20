// components/taaskr/landing/Footer.jsx

import { Logo } from "@/components/taaskr/Logo";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Safety", href: "#" },
    { label: "Community Guidelines", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + Contact */}
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="text-[var(--color-text-light)] mt-5 max-w-sm">
              Connecting skilled service professionals with customers who need
              them. Join the largest network of home service providers in India.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href="mailto:support@daytaask.com"
                className="flex items-center gap-3 text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
              >
                <Mail className="w-5 h-5" />
                support@daytaask.com
              </a>
              <a
                href="tel:1800-123-4567"
                className="flex items-center gap-3 text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
              >
                <Phone className="w-5 h-5" />
                1800-123-4567 (Toll Free)
              </a>
              <p className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
                <MapPin className="w-5 h-5" />
                Mumbai, Maharashtra, India
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[var(--color-text-light)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-light)]">
            © {new Date().getFullYear()} DayTaask. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-text-light)]">
              Made with ❤️ in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

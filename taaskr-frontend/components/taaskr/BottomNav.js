// components/taaskr/BottomNav.js
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  User,
  Bell,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/support", icon: HelpCircle, label: "Help" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] text-[var(--color-text-light)] hover:text-[var(--color-text)] data-[active=true]:text-[var(--color-primary)] data-[active=true]:bg-[var(--color-primary)]/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// components/taaskr/Header.js
import { Logo } from "./Logo";
import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export function Header({ title, onMenuClick, className = "" }) {
  const { logout } = useAuth();
  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)] ${className}`}
    >
      <div className="container flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[var(--color-text)]" />
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-semibold font-display">{title}</h1>
          ) : (
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/dt-images/dt_logo-nobg.png"
                alt="DayTaask"
                width={200}
                height={60}
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 hover:scale-105"
                priority
              />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--color-text)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full"></span>
          </button>
          <button
            onClick={logout}
            className="p-2 px-4 rounded-full bg-gray-100 hover:bg-red-100 transition-colors flex items-center gap-1 text-red-500 cursor-pointer"
            aria-label="Logout"
          >
            Logout <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

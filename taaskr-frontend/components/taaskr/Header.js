// components/taaskr/Header.js
import { Logo } from "./Logo";
import { Bell, Menu } from "lucide-react";

export function Header({ title, onMenuClick, className = "" }) {
  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)] ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
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
            <Logo size="sm" />
          )}
        </div>

        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[var(--color-text)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

// components/taaskr/OnlineToggle.js
import { Power } from "lucide-react";

export function OnlineToggle({ isOnline, onToggle, className = "" }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center gap-3 px-5 py-3 rounded-full font-medium transition-all duration-300 ${
        isOnline
          ? "bg-[var(--color-success)] text-white shadow-[var(--shadow-md)]"
          : "bg-gray-100 text-[var(--color-text-light)] hover:bg-gray-200"
      } ${className}`}
    >
      {isOnline && (
        <span className="absolute inset-0 rounded-full animate-pulse bg-[var(--color-success)]/30" />
      )}
      <Power className={`w-5 h-5 ${isOnline ? "animate-pulse" : ""}`} />
      <span>{isOnline ? "Online" : "Go Online"}</span>
    </button>
  );
}

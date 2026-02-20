// components/taaskr/ToastProvider.jsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, X, Info, AlertCircle } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type: options.type || "info", // "success" | "error" | "info" | "warning"
      duration: options.duration || 4000,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white transform transition-all duration-300 animate-slide-in-right ${
              toast.type === "success"
                ? "bg-[var(--color-success)]"
                : toast.type === "error"
                  ? "bg-[var(--color-danger)]"
                  : toast.type === "warning"
                    ? "bg-[var(--color-warning)] text-black"
                    : "bg-[var(--color-primary)]"
            }`}
          >
            {/* Icon based on type */}
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}

            <p className="text-sm font-medium">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to use toast anywhere
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

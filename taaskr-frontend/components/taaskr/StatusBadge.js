// components/taaskr/StatusBadge.js
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function StatusBadge({ status, className = "", showIcon = true }) {
  const config = {
    online: {
      label: "Online",
      bg: "bg-[var(--color-success)]/10",
      text: "text-[var(--color-success)]",
      border: "border-[var(--color-success)]/20",
      icon: CheckCircle,
    },
    offline: {
      label: "Offline",
      bg: "bg-gray-100",
      text: "text-[var(--color-text-light)]",
      border: "border-[var(--color-border)]",
      icon: XCircle,
    },
    pending: {
      label: "Pending",
      bg: "bg-[var(--color-warning)]/10",
      text: "text-[var(--color-warning)]",
      border: "border-[var(--color-warning)]/20",
      icon: Clock,
    },
    approved: {
      label: "Approved",
      bg: "bg-[var(--color-success)]/10",
      text: "text-[var(--color-success)]",
      border: "border-[var(--color-success)]/20",
      icon: CheckCircle,
    },
    rejected: {
      label: "Rejected",
      bg: "bg-[var(--color-danger)]/10",
      text: "text-[var(--color-danger)]",
      border: "border-[var(--color-danger)]/20",
      icon: XCircle,
    },
    accepted: {
      label: "Accepted",
      bg: "bg-[var(--color-primary)]/10",
      text: "text-[var(--color-primary)]",
      border: "border-[var(--color-primary)]/20",
      icon: CheckCircle,
    },
    incoming: {
      label: "Incoming",
      bg: "bg-[var(--color-warning)]/10",
      text: "text-[var(--color-warning)]",
      border: "border-[var(--color-warning)]/20",
      icon: AlertCircle,
    },
    "in-progress": {
      label: "In Progress",
      bg: "bg-[var(--color-primary)]/10",
      text: "text-[var(--color-primary)]",
      border: "border-[var(--color-primary)]/20",
      icon: Loader2,
    },
    completed: {
      label: "Completed",
      bg: "bg-[var(--color-success)]/10",
      text: "text-[var(--color-success)]",
      border: "border-[var(--color-success)]/20",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-[var(--color-danger)]/10",
      text: "text-[var(--color-danger)]",
      border: "border-[var(--color-danger)]/20",
      icon: AlertCircle,
    },
  };

  const cfg = config[status] || config.offline;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border} ${className}`}
    >
      {showIcon && (
        <cfg.icon
          className={`w-3 h-3 ${status === "in-progress" ? "animate-spin" : ""}`}
        />
      )}
      {cfg.label}
    </span>
  );
}

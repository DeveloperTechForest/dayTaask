// components/taaskr/StatCard.js
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "bg-[var(--color-surface)] border border-[var(--color-border)]",
    primary:
      "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white",
    success:
      "bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success)]/50 text-white",
    warning:
      "bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-warning)]/80 text-black",
  };

  const iconBg = {
    default: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    primary: "bg-white/20 text-white",
    success: "bg-white/20 text-white",
    warning: "bg-white/20 text-white",
  };

  return (
    <div
      className={`rounded-xl p-5 shadow-[var(--shadow-md)] transition-all hover:shadow-[var(--shadow-lg)] ${variants[variant]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={`text-sm font-medium ${
              variant === "default"
                ? "text-[var(--color-text-light)]"
                : "text-white/80"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold font-display ${variant === "default" ? "text-[var(--color-text)]" : "text-white"}`}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={`text-xs ${
                variant === "default"
                  ? "text-[var(--color-text-light)]"
                  : "text-white/70"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-lg ${iconBg[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-medium ${
              trend.isPositive
                ? "text-[var(--color-success)]"
                : "text-[var(--color-danger)]"
            }`}
          >
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}%
          </span>
          <span
            className={`text-xs ${
              variant === "default"
                ? "text-[var(--color-text-light)]"
                : "text-white/60"
            }`}
          >
            vs last week
          </span>
        </div>
      )}
    </div>
  );
}

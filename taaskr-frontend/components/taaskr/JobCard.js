// components/taaskr/JobCard.js
import {
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  User,
  ChevronRight,
} from "lucide-react";

export function JobCard({
  serviceName,
  customerName,
  location,
  distance,
  dateTime,
  earnings,
  status,
  countdown,
  onAccept,
  onReject,
  onClick,
  className = "",
}) {
  const isIncoming = status === "incoming";

  return (
    <div
      className={`bg-[var(--color-surface)] mb-4 rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-md)] overflow-hidden transition-all hover:shadow-[var(--shadow-lg)] ${
        isIncoming
          ? "ring-2 ring-[var(--color-primary)]/50 shadow-[var(--shadow-glow)]"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Countdown for incoming jobs */}
      {isIncoming && countdown !== undefined && (
        <div className="bg-[var(--color-primary)]/10 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-primary)]">
            New Request!
          </span>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--color-primary)]/20"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="62.83"
                  strokeDashoffset={(62.83 * (60 - countdown)) / 60}
                  className="text-[var(--color-primary)] transition-all duration-1000"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-[var(--color-primary)]">
              {countdown}s
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-[var(--color-text)]">
              {serviceName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-[var(--color-text-light)] mt-1">
              <User className="w-3.5 h-3.5" />
              <span>{customerName}</span>
            </div>
          </div>

          {/* Status badge (inline simple version) */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              status === "pending"
                ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20"
                : status === "accepted"
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20"
                  : status === "completed"
                    ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                    : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[var(--color-text-light)]" />
            <span className="text-[var(--color-text)]">{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-[var(--color-text-light)]" />
              <span className="text-[var(--color-text-light)]">{distance}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--color-text-light)]" />
              <span className="text-[var(--color-text-light)]">{dateTime}</span>
            </div>
          </div>
        </div>

        {/* Earnings + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-divider)]">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-[var(--color-success)]" />
            <span className="text-xl font-bold text-[var(--color-success)]">
              {earnings}
            </span>
          </div>

          {isIncoming ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject?.();
                }}
                className="px-4 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept?.();
                }}
                className="px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-d)] transition-colors"
              >
                Accept
              </button>
            </div>
          ) : (
            <ChevronRight className="w-5 h-5 text-[var(--color-text-light)]" />
          )}
        </div>
      </div>
    </div>
  );
}

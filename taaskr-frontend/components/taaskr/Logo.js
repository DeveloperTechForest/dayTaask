// components/taaskr/Logo.js
export function Logo({ className = "", size = "md", variant = "full" }) {
  // Size mappings (same as before)
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-10 h-10", text: "text-2xl" },
  };

  // Build class strings manually (no cn needed)
  const containerClasses = ["flex items-center gap-2 font-medium", className]
    .filter(Boolean)
    .join(" ");

  const iconContainerClasses = [
    "rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]",
    "flex items-center justify-center shadow-md",
    sizes[size].icon,
  ].join(" ");

  const textClasses = [
    "font-display font-bold tracking-tight text-[var(--color-text)]",
    sizes[size].text,
  ].join(" ");

  return (
    <div className={containerClasses}>
      <div className={iconContainerClasses}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="w-[70%] h-[70%] text-white"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </div>

      {variant === "full" && <span className={textClasses}>Taaskr</span>}
    </div>
  );
}

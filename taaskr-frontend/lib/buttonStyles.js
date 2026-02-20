// lib/buttonStyles.js

export const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-d)] focus:ring-[var(--color-primary)] shadow-md",
  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]",
  ghost:
    "hover:bg-gray-100/80 text-[var(--color-text)] focus:ring-[var(--color-primary)]",
};

export const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-8 text-base",
  xl: "h-14 px-10 text-lg",
};

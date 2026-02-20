// utils/dateUtils.js
/**
 * Formats ISO date string to "6 Jan 2026 11:00" style
 * @param {string} isoString - ISO date string (e.g. "2026-01-06T11:00:00Z")
 * @returns {string} Formatted date-time or "—" if invalid/empty
 */
export const formatDateTime = (isoString) => {
  if (!isoString || isNaN(Date.parse(isoString))) return "—";

  const date = new Date(isoString);

  // Use toLocaleDateString for date part (day short month year)
  const datePart = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Use toLocaleTimeString for clean time (24-hour format without seconds)
  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
};

/**
 * Formats ISO string to be used in <input type="datetime-local"> value
 * Returns "YYYY-MM-DDTHH:MM" format
 * @param {string} isoString
 * @returns {string}
 */
export const formatForInput = (isoString) => {
  if (!isoString || isNaN(Date.parse(isoString))) return "";
  return isoString.slice(0, 16); // "2026-01-06T11:00"
};

/**
 * Checks if a scheduled time is urgent (less than 24 hours from now)
 * @param {string} isoString
 * @returns {boolean}
 */
export const isUrgent = (isoString) => {
  if (!isoString || isNaN(Date.parse(isoString))) return false;

  const scheduled = new Date(isoString);
  const now = new Date();

  // Only consider future events
  if (scheduled <= now) return false;

  const hoursDiff = (scheduled - now) / (1000 * 60 * 60);
  return hoursDiff < 24;
};

/**
 * Optional: Full date only (e.g. "6 Jan 2026")
 * Useful for table columns where time is not needed
 */
export const formatOnlyDate = (isoString) => {
  if (!isoString || isNaN(Date.parse(isoString))) return "—";

  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

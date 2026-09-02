// Convert 24-hour time strings ("14:30", "09:05", "9:05") to 12-hour format ("2:30 PM").
export function formatTime12h(time) {
  if (!time) return "";

  // Already in 12-hour format — return as-is.
  if (/\b(AM|PM|am|pm)\b/.test(String(time))) return time;

  const parts = String(time).trim().split(":");
  const hours = parseInt(parts[0], 10);
  if (Number.isNaN(hours)) return time;

  const minutes = parts[1] ? parts[1].slice(0, 2) : "00";
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${suffix}`;
}

// Convert 12-hour parts (hour 1–12, minute "00"–"59", period "AM"/"PM")
// back into a 24-hour "HH:mm" string. Returns "" if any part is missing.
export function to24Hour(hour12, minute, period) {
  if (!hour12 || !minute || !period) return "";
  const parsedHour = parseInt(hour12, 10);
  if (Number.isNaN(parsedHour)) return "";
  let hours = parsedHour % 12;
  if (period === "PM") hours += 12;
  return `${String(hours).padStart(2, "0")}:${minute}`;
}
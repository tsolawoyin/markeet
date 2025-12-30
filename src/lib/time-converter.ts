/**
 * Converts a timestamp to Twitter/X style time display
 * @param timestamp - ISO 8601 timestamp string
 * @returns Formatted time string (e.g., "13h", "2m", "now")
 */
export function formatTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Less than 5 seconds
  if (diffInSeconds < 5) {
    return "now";
  }

  // Less than 60 seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  // Less than 60 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Less than 24 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Check if it was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday =
    past.getDate() === yesterday.getDate() &&
    past.getMonth() === yesterday.getMonth() &&
    past.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "yesterday";
  }

  // Less than 7 days - show day count
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // Less than 4 weeks - show week count
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  // Same year - show "MMM DD" format (e.g., "Dec 25")
  if (past.getFullYear() === now.getFullYear()) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[past.getMonth()]} ${past.getDate()}`;
  }

  // Different year - show "MMM DD, YYYY" format (e.g., "Dec 25, 2023")
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[past.getMonth()]} ${past.getDate()}, ${past.getFullYear()}`;
}

// Usage examples:
// console.log(formatTime("2025-12-30T08:21:55.815Z")); // "13h" (if current time is appropriate)
// console.log(formatTime("2025-12-30T09:20:55.815Z")); // "1m"
// console.log(formatTime("2025-12-30T09:21:50.815Z")); // "5s"
// console.log(formatTime("2025-12-30T09:21:55.815Z")); // "now"
// console.log(formatTime("2025-12-29T09:21:55.815Z")); // "yesterday" or "1d"
// console.log(formatTime("2025-12-20T09:21:55.815Z")); // "10d"
// console.log(formatTime("2024-12-30T09:21:55.815Z")); // "Dec 30, 2024"

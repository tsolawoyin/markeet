/**
 * Calculates time remaining until a future timestamp
 * @param timestamp - ISO 8601 timestamp string
 * @returns Formatted time remaining (e.g., "2 days left", "5 hours left", "30 seconds left")
 */
export function getTimeRemaining(timestamp: string): string {
  const now = new Date();
  const target = new Date(timestamp);
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  // If time has passed
  if (diffInSeconds <= 0) {
    return "Expired";
  }

  // Less than 60 seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${
      diffInSeconds === 1 ? "second" : "seconds"
    } left`;
  }

  // Less than 60 minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${
      diffInMinutes === 1 ? "minute" : "minutes"
    } left`;
  }

  // Less than 24 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} left`;
  }

  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} left`;
}

/**
 * Alternative version that returns an object with more details
 */
export function getTimeRemainingDetailed(timestamp: string): {
  value: number;
  unit: "day" | "hour" | "minute" | "second" | "expired";
  display: string;
  isExpired: boolean;
} {
  const now = new Date();
  const target = new Date(timestamp);
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  if (diffInSeconds <= 0) {
    return {
      value: 0,
      unit: "expired",
      display: "Expired",
      isExpired: true,
    };
  }

  if (diffInSeconds < 60) {
    return {
      value: diffInSeconds,
      unit: "second",
      display: `${diffInSeconds} ${
        diffInSeconds === 1 ? "second" : "seconds"
      } left`,
      isExpired: false,
    };
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return {
      value: diffInMinutes,
      unit: "minute",
      display: `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } left`,
      isExpired: false,
    };
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return {
      value: diffInHours,
      unit: "hour",
      display: `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} left`,
      isExpired: false,
    };
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return {
    value: diffInDays,
    unit: "day",
    display: `${diffInDays} ${diffInDays === 1 ? "day" : "days"} left`,
    isExpired: false,
  };
}

// // Usage examples:
// console.log(getTimeRemaining("2025-12-31T02:15:55.52662+00:00"));
// // Output: "5 days left" (or whatever the actual time is)

// console.log(getTimeRemaining("2025-12-30T10:30:00.000Z"));
// // Output: "2 hours left"

// console.log(getTimeRemaining("2025-12-30T09:22:30.000Z"));
// // Output: "45 seconds left"

// console.log(getTimeRemaining("2025-12-29T09:21:55.815Z"));
// // Output: "Expired"

// // Using the detailed version:
// const timeInfo = getTimeRemainingDetailed("2025-12-31T02:15:55.52662+00:00");
// console.log(timeInfo);
// // {
// //   value: 5,
// //   unit: "day",
// //   display: "5 days left",
// //   isExpired: false
// // }

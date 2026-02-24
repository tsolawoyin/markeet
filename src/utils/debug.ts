// utils/debug.ts
export const isDev = process.env.NODE_ENV === "development";

export const debug = {
  log: (...args: any[]) => isDev && console.log(...args),
  error: (...args: any[]) => console.error(...args), // Always log errors
  warn: (...args: any[]) => isDev && console.warn(...args),
};

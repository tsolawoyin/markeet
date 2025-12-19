"use client";

import { useEffect } from "react";

/**
 * This component runs on iOS only to ensure service workers don't break navigation
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    const cleanup = async () => {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      // ONLY run cleanup on iOS
      if (!isIOS) return;

      try {
        // Unregister all service workers on iOS only
        if ("serviceWorker" in navigator) {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            try {
              await registration.unregister();
              console.log("iOS cleanup: Unregistered SW:", registration.scope);
            } catch (err) {
              console.warn("iOS cleanup: Failed to unregister SW:", err);
            }
          }
        }

        // Clear all caches on iOS only
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            try {
              await caches.delete(cacheName);
              console.log("iOS cleanup: Deleted cache:", cacheName);
            } catch (err) {
              console.warn(
                "iOS cleanup: Failed to delete cache:",
                cacheName,
                err
              );
            }
          }
        }
      } catch (err) {
        console.warn("iOS cleanup error:", err);
      }
    };

    cleanup();

    // Run cleanup periodically on iOS only
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      const interval = setInterval(cleanup, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return null;
}

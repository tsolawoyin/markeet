"use client";

import { useEffect } from "react";

/**
 * This component runs on every page to ensure:
 * 1. All service workers are unregistered on iOS
 * 2. All caches are cleared on iOS
 * 3. Users can navigate properly (sign out, view pages, etc.)
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    const cleanup = async () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (!isIOS) return;

      try {
        // Unregister all service workers
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            try {
              await registration.unregister();
              console.log("Unregistered SW:", registration.scope);
            } catch (err) {
              console.warn("Failed to unregister SW:", err);
            }
          }
        }

        // Clear all caches
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            try {
              await caches.delete(cacheName);
              console.log("Deleted cache:", cacheName);
            } catch (err) {
              console.warn("Failed to delete cache:", cacheName, err);
            }
          }
        }

        // Force refresh page data from network
        if ("caches" in window && navigator.onLine) {
          // Send a signal to bypass any cached responses
          fetch(window.location.href, { cache: "no-store" }).catch(() => {
            // Silently fail - we're just trying to refresh
          });
        }
      } catch (err) {
        console.warn("Cleanup error:", err);
      }
    };

    cleanup();

    // Run cleanup periodically to catch any newly registered SWs
    const interval = setInterval(cleanup, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}

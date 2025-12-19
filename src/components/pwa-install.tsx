"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  useEffect(() => {
    // Check if device is iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // ONLY unregister service workers on iOS
    // iOS SW support causes navigation/routing issues
    if (
      isIOS &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            registration
              .unregister()
              .then(() => {
                console.log(
                  "iOS: Service Worker unregistered:",
                  registration.scope
                );
              })
              .catch((err) => {
                console.warn("iOS: Failed to unregister SW:", err);
              });
          });
        })
        .catch((err) => {
          console.warn("iOS: Error getting SW registrations:", err);
        });

      // Clear caches on iOS
      if ("caches" in window) {
        caches
          .keys()
          .then((cacheNames) => {
            Promise.all(
              cacheNames.map((cacheName) => {
                return caches
                  .delete(cacheName)
                  .then(() => {
                    console.log("iOS: Cleared cache:", cacheName);
                  })
                  .catch((err) => {
                    console.warn("iOS: Failed to clear cache:", cacheName, err);
                  });
              })
            );
          })
          .catch((err) => {
            console.warn("iOS: Error accessing caches:", err);
          });
      }
    }

    // Register service worker on NON-iOS devices in production
    if (
      !isIOS &&
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log(
              "Service Worker registered successfully:",
              registration.scope
            );

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error: unknown) => {
            console.warn("Service Worker registration failed:", error);
          });
      });
    }

    if (isIOS) {
      console.log(
        "iOS detected: Service Workers disabled to prevent navigation issues"
      );
    }

    // Handle install prompt
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e: Event) => {
        const beforeInstallPrompt = e as BeforeInstallPromptEvent;
        beforeInstallPrompt.preventDefault();
        (window as any).deferredPrompt = beforeInstallPrompt;
        console.log("Install prompt ready");
      });

      window.addEventListener("appinstalled", () => {
        console.log("PWA app installed");
        delete (window as any).deferredPrompt;
      });
    }
  }, []);

  return null;
}

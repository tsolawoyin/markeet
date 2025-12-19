"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  useEffect(() => {
    // Check if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Critical: Force unregister ALL service workers on iOS
    // iOS SW support is broken and causes navigation/routing issues
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log("Service Worker unregistered:", registration.scope);
          }).catch((err) => {
            console.warn("Failed to unregister SW:", err);
          });
        });
      }).catch((err) => {
        console.warn("Error getting SW registrations:", err);
      });
    }

    // Clear service worker cache on iOS to prevent stale page issues
    if (isIOS && typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName).then(() => {
              console.log("Cleared cache:", cacheName);
            }).catch((err) => {
              console.warn("Failed to clear cache:", cacheName, err);
            });
          })
        );
      }).catch((err) => {
        console.warn("Error accessing caches:", err);
      });
    }

    // Only register service worker in production and on NON-iOS devices
    if (process.env.NODE_ENV === "production" && !isIOS) {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("Service Worker registered successfully:", registration);
          })
          .catch((error: unknown) => {
            console.warn("Service Worker registration failed:", error);
          });
      }
    }

    if (isIOS) {
      console.log("iOS detected: Service Workers disabled to prevent navigation issues");
    }

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e: Event) => {
        const beforeInstallPrompt = e as BeforeInstallPromptEvent;
        beforeInstallPrompt.preventDefault();
        (window as Record<string, BeforeInstallPromptEvent>).deferredPrompt = beforeInstallPrompt;
      });

      window.addEventListener("appinstalled", () => {
        console.log("PWA app installed");
        delete (window as Record<string, BeforeInstallPromptEvent>).deferredPrompt;
      });
    }
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  useEffect(() => {
    // Only register service worker in production
    if (process.env.NODE_ENV === "production") {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
          console.log("Service Worker registration failed:", error);
        });
      }
    } else {
      // Development: Unregister any existing service workers
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
            console.log("Service Worker unregistered (development mode)");
          });
        });
      }
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

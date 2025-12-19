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

    // Only register service worker in production and on non-iOS devices
    // iOS (Safari) has limited SW support
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
    } else if (!isIOS) {
      // Development: Unregister any existing service workers
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
            console.log("Service Worker unregistered (development mode)");
          });
        });
      }
    } else if (isIOS) {
      console.log("iOS detected: Service Workers have limited support in Safari");
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

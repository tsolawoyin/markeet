"use client";

import { useState, useEffect, useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Download, CheckCircle, ArrowRight, Smartphone, Monitor, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Onboarding page for installing the web app
export default function Page() {
  const { user } = useContext(ShellContext);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const getInstallInstructions = () => {
    switch (platform) {
      case "ios":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Install Markeet on your iPhone or iPad for the best experience:
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  1
                </span>
                <span>Tap the <strong>Share</strong> button at the bottom of Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  2
                </span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  3
                </span>
                <span>Tap <strong>"Add"</strong> in the top right corner</span>
              </li>
            </ol>
          </div>
        );
      case "android":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Install Markeet on your Android device for quick access:
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  1
                </span>
                <span>Tap the <strong>menu</strong> (three dots) in Chrome</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  2
                </span>
                <span>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  3
                </span>
                <span>Confirm by tapping <strong>"Add"</strong> or <strong>"Install"</strong></span>
              </li>
            </ol>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Install Markeet on your computer for a native app experience:
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  1
                </span>
                <span>Look for the <strong>install icon</strong> in your browser's address bar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  2
                </span>
                <span>Click it and select <strong>"Install"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs shrink-0">
                  3
                </span>
                <span>The app will open in its own window</span>
              </li>
            </ol>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-8">
            <Image
              src="/welcome.jpg"
              alt="Markeet App"
              width={200}
              height={200}
              className="w-full max-w-md rounded-lg object-cover mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Install Markeet
          </h1>
          <p className="text-lg text-center text-muted-foreground">
            Get quick access with our mobile app experience
          </p>
        </div>

        {/* Installation Section */}
        <div className="bg-card border border-border rounded-xl p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Install the App</h2>

          <div className="space-y-6">
            {/* Install Option */}
            <div className="pb-6 border-b border-border dark:border-slate-800 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {platform === "ios" || platform === "android" ? (
                    <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                  ) : (
                    <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      Add to Home Screen
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Access Markeet instantly like a native app with faster loading and offline support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-8">
                {isInstalled ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800/50 w-fit">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span className="font-medium">App installed ✓</span>
                  </div>
                ) : isInstallable && platform === "desktop" ? (
                  <Button
                    onClick={handleInstallClick}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-400">
                        {getInstallInstructions()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Why Install?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Faster loading times and smoother performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Works offline - browse listings without internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Quick access from your home screen or dock</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Native app experience without app store downloads</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border dark:border-slate-800">
            <p className="text-sm text-muted-foreground mb-4">
              You can install the app anytime from your browser menu.
            </p>
            <Link
              href="/onboarding/invite"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Click here to continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
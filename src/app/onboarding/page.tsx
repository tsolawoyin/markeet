"use client";

import { useState, useEffect, useContext } from "react";
import { ShellContext } from "@/shell/shell";

import {
  Bell,
  Download,
  Share2,
  CheckCircle,
  Sparkles,
  ArrowRight,
  X,
  Smartphone,
  Chrome,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export default function OnboardingPage() {
  const { user } = useContext(ShellContext);
  const [notificationStatus, setNotificationStatus] = useState("default");

  useEffect(() => {
    // Check current notification permission status on mount
    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleNotificationClick = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationStatus(permission);

        // Show confirmation notification if granted
        if (permission === "granted") {
          new Notification("🎉 Notifications Enabled!", {
            body: "You'll now receive updates about listings and messages",
            icon: "/favicon.ico",
          });
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  console.log("OnboardingPage user:", user);
  console.log("Notification status:", notificationStatus);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="mb-8">
            <Image
              src="/welcome.jpg"
              alt="Markeet Logo"
              width={200}
              height={200}
              className="w-full max-w-md rounded-lg object-cover mx-auto"
            />
          </div>
          {/* <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Markeet</span>
          </h1> */}
          <p className="text-xl text-center text-muted-foreground mb-2">
            Hi <strong>{user.user_metadata.full_name}</strong>!
          </p>
          <p className="text-lg text-center text-muted-foreground">
            Thank you for signing up. Let's get you set up.
          </p>
        </div>

        {/* Next Steps Section */}
        <div className="bg-card border border-border rounded-xl p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Next Steps</h2>
          
          <div className="space-y-6">
            {/* Notification Setting */}
            <div className="pb-6 border-b border-border dark:border-slate-800 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">Enable Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get alerts about new listings, messages, and deals on campus.
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-8">
                {notificationStatus === "granted" ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800/50 w-fit">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Notifications enabled ✓</span>
                  </div>
                ) : notificationStatus === "denied" ? (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800/50">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Notifications blocked. Enable in browser settings.
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleNotificationClick}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Enable Notifications
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border dark:border-slate-800">
            <p className="text-sm text-muted-foreground mb-4">
              You can adjust these settings anytime in your account preferences.
            </p>
            <a
              href="/browse"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Continue to Marketplace
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Bell, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function OnboardingPage() {
  const { user, supabase } = useContext(ShellContext);
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [isIOS, setIsIOS] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const isAppleDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isAppleDevice);

    if ("Notification" in window && !isAppleDevice) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const subscribeToPushNotifications = async () => {
    try {
      setSubscribing(true);

      // Request notification permission
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission !== "granted") {
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      // Save subscription to database
      const subscriptionJSON = subscription.toJSON();

      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint: subscriptionJSON.endpoint,
          p256dh: subscriptionJSON.keys?.p256dh,
          auth: subscriptionJSON.keys?.auth,
        },
        {
          onConflict: "endpoint",
        }
      );

      if (error) throw error;

      // Show test notification
      new Notification("🎉 Notifications Enabled!", {
        body: "You'll now receive updates about new listings and blog posts",
        icon: "/icons/192.png",
      });
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      alert("Failed to enable notifications. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleNotificationClick = async () => {
    if (isIOS) {
      alert(
        "iOS doesn't support web push notifications in Safari yet. " +
          "If you installed Markeet as an app, notifications will work when we add that feature. " +
          "For now, make sure to turn on app notifications in your device settings."
      );
      return;
    }

    await subscribeToPushNotifications();
  };

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
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Enable Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get instant alerts when new items are listed on campus and
                      when we publish new blog posts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-8">
                {isIOS ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-700 dark:text-amber-400">
                        <p className="font-semibold mb-2">iOS Users</p>
                        <p className="mb-2">
                          Safari doesn't support web push notifications yet.
                          However, if you install Markeet as an app, you can
                          enable notifications in your device settings.
                        </p>
                        <p className="text-xs opacity-90">
                          Steps: Settings → Installed Apps → Markeet →
                          Notifications → Allow
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleNotificationClick}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm"
                      size="sm"
                      variant="outline"
                    >
                      Got it
                    </Button>
                  </div>
                ) : notificationStatus === "granted" ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800/50 w-fit">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span className="font-medium">Notifications enabled ✓</span>
                  </div>
                ) : notificationStatus === "denied" ? (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800/50">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">
                      Notifications blocked. Enable in browser settings.
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleNotificationClick}
                    disabled={subscribing}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    {subscribing ? "Enabling..." : "Enable Notifications"}
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
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Continue to Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

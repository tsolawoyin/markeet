"use client";

import { usePushNotification } from "@/providers/push-notification-context";
import { Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationSection() {
  const { isSupported, subscription, subscribeToPush, unsubscribeFromPush } =
    usePushNotification();
  const [isToggling, setIsToggling] = useState(false);

  const isEnabled = !!subscription;

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      if (isEnabled) {
        unsubscribeFromPush();
        toast.success("Push notifications disabled");
      } else {
        subscribeToPush();
        toast.success("Push notifications enabled");
      }
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsToggling(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
          Notifications
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Push notifications are not supported on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 dark:text-white">
        Notifications
      </h2>

      <button
        onClick={handleToggle}
        disabled={isToggling}
        className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isEnabled
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-stone-100 dark:bg-stone-800"
            }`}
          >
            {isEnabled ? (
              <Bell className="w-4.5 h-4.5 text-green-600 dark:text-green-400" />
            ) : (
              <BellOff className="w-4.5 h-4.5 text-stone-400 dark:text-stone-500" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-900 dark:text-white">
              Push Notifications
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isEnabled
                ? "You'll receive order updates and messages"
                : "Enable to stay updated on your orders"}
            </p>
          </div>
        </div>

        {/* Toggle indicator */}
        <div
          className={`w-11 h-6 rounded-full relative transition-colors ${
            isEnabled
              ? "bg-green-500 dark:bg-green-600"
              : "bg-stone-300 dark:bg-stone-700"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              isEnabled ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

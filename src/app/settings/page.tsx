"use client";

import { useApp } from "@/providers/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ProfileSection } from "./components/profile-section";
import { AppearanceSection } from "./components/appearance-section";
import { NotificationSection } from "./components/notification-section";
import { AccountSection } from "./components/account-section";

export default function SettingsPage() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // yupyup. route to login
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-900">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-700 dark:text-stone-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">
              Settings
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Manage your account
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Profile Section */}
        <section className="bg-white dark:bg-stone-950 rounded-xl">
          <ProfileSection />
        </section>

        <hr className="border-stone-200 dark:border-stone-900" />

        {/* Appearance Section */}
        <section>
          <AppearanceSection />
        </section>

        <hr className="border-stone-200 dark:border-stone-900" />

        {/* Notification Section */}
        <section>
          <NotificationSection />
        </section>

        <hr className="border-stone-200 dark:border-stone-900" />

        {/* Account Section */}
        <section>
          <AccountSection />
        </section>
      </div>
    </div>
  );
}

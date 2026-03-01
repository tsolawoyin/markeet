"use client";

import { useApp } from "@/providers/app-provider";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Package,
  Settings,
  Shield,
  LogOut,
  Moon,
  Sun,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function MyProfile() {
  const { user, supabase } = useApp();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isAdmin = user?.profile?.role === "admin";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Navigation items configuration
  const navigationItems = [
    {
      icon: Package,
      label: "My Listings",
      description: "View and manage your active listings",
      href: `/listings/${user?.id}`,
      show: true,
    },
    {
      icon: Heart,
      label: "Favorites",
      description: "Items and services you've saved",
      href: "#",
      show: true,
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Manage your account preferences",
      href: "/settings",
      show: true,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header with gradient branding */}
      <div className="bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 px-5 pt-10 pb-8 lg:px-12">
          <h1 className="text-2xl font-bold mb-1">My Profile</h1>
          <p className="text-orange-100 text-sm">
            Manage your account information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 lg:px-12 py-6 space-y-4">
        {/* Personal Information Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Personal Information
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                  Full name
                </div>
                <div className="text-sm font-medium text-stone-900 dark:text-white">
                  {user?.profile?.full_name}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                  Email
                </div>
                <div className="text-sm font-medium text-stone-900 dark:text-white truncate">
                  {user?.profile?.email}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                  Phone
                </div>
                <div className="text-sm font-medium text-stone-900 dark:text-white">
                  {user?.profile?.phone}
                </div>
              </div>
            </div>

            {/* Course */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                  Course
                </div>
                <div className="text-sm font-medium text-stone-900 dark:text-white">
                  {user?.profile?.course}
                </div>
              </div>
            </div>

            {/* Hall of Residence */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                  Hall of residence
                </div>
                <div className="text-sm font-medium text-stone-900 dark:text-white">
                  {user?.profile?.hall_of_residence}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {/* Admin Dashboard (only for admins) */}
          {isAdmin && (
            <Link href="#">
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-purple-200 dark:border-purple-800/60 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-stone-900 dark:text-white">
                      Admin Dashboard
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                      Manage platform operations
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 dark:text-stone-500 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </div>
            </Link>
          )}

          {/* Navigation Items */}
          {navigationItems.map(
            (item) =>
              item.show && (
                <Link key={item.href} href={item.href}>
                  <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all cursor-pointer group overflow-hidden">
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-stone-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-xs text-stone-600 dark:text-stone-400">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-400 dark:text-stone-500 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </Link>
              ),
          )}
        </div>
      </div>
    </div>
  );
}

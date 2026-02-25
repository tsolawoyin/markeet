"use client";

import { Home, Plus, Briefcase, Newspaper, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    url: "/",
    name: "Home",
    icon: Home,
  },
  {
    url: "/create",
    name: "Post",
    icon: Plus,
    isAction: true,
  },
  {
    url: "/profile/me",
    name: "Profile",
    icon: User,
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;

          // Center "Post" button — elevated action style
          if (item.isAction) {
            return (
              <Link
                key={item.url}
                href={item.url}
                className="relative -mt-5 flex flex-col items-center"
                aria-label={item.name}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                    isActive
                      ? "bg-orange-600 shadow-orange-300 dark:shadow-orange-950/50"
                      : "bg-orange-500 hover:bg-orange-600 shadow-orange-200 dark:shadow-orange-950/40"
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isActive
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-stone-500 dark:text-stone-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.url}
              href={item.url}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-16 py-2 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
              }`}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 dark:bg-orange-400 rounded-full" />
              )}

              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />

              <span
                className={`text-[10px] font-medium ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

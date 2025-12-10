"use client";

import { Search, MessageCircle, User, Plus, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    url: "/browse",
    name: "Home",
    icon: Home,
  },
//   {
//     url: "/search",
//     name: "Search",
//     icon: Search,
//   },
  {
    url: "/create",
    name: "Post",
    icon: Plus,
  },
//   {
//     url: "/campus",
//     name: "Campus",
//     icon: Users,
//   },
//   {
//     url: "/messages",
//     name: "Messages",
//     icon: MessageCircle,
//     badge: true,
//   },
  {
    url: "/profile/me",
    name: "Profile",
    icon: User,
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
      <div className="flex justify-around py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.url);

          return (
            <Link
              key={item.url}
              href={item.url}
              className={`flex flex-col items-center gap-1 relative ${
                isActive
                  ? "text-blue-900 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.name}</span>
              {item.badge && (
                <span className="absolute top-0 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

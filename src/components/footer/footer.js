"use client";

import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    url: "/chat",
    name: "Chat",
    icon: MessageSquareText,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const hidden = pathname.match(/\/chat\/\w+/);

  if (hidden) return null;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0">
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
              <Icon className="w-6 h-6" size={20} />
              {/* <span className="text-xs">{item.name}</span> */}
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

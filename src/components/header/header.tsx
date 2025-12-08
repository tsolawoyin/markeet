"use client";

import { ModeToggle } from "./theme-toggle";
import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Button } from "../ui/button";
import { ShoppingBag, Bell, LogOut, Home, Search, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
    {
        url: "/",
        name: "Home",
        icon: Home,
    },
    {
        url: "/search",
        name: "Search",
        icon: Search,
    },
    {
        url: "/campus",
        name: "Campus",
        icon: Users,
    },
    {
        url: "/messages",
        name: "Messages",
        icon: MessageCircle,
    },
];

export default function Header() {
    const { supabase, setUser } = useContext(ShellContext);
    const pathname = usePathname();

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    return (
        <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur supports-backdrop-filter:bg-white/95 dark:supports-backdrop-filter:bg-gray-800/95">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex h-14 md:h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">
                            Markeet
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigationLinks.map((link) => {
                            const isActive = pathname === link.url;
                            return (
                                <Link
                                    key={link.url}
                                    href={link.url}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isActive
                                        ? "text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-gray-700"
                                        : "text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Post Button - Hidden on mobile (use footer instead) */}
                        <Button
                            asChild
                            className="hidden md:flex bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                        >
                            <Link href="/post">Post Item</Link>
                        </Button>

                        {/* Notifications - Desktop & Tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex relative text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>

                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* Sign Out - Desktop & Tablet */}
                        <Button
                            onClick={signOut}
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>

                        {/* Sign Out - Mobile (text button) */}
                        <Button
                            onClick={signOut}
                            variant="ghost"
                            className="sm:hidden text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
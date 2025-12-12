"use client";

import { ModeToggle } from "./theme-toggle";
import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Button } from "../ui/button";
import { ShoppingBag, Bell, LogOut, Home, Search, Users, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Nice and easy project...
// Makes sense. 
// Let me use the remaining time on layout
const navigationLinks = [
    {
        url: "/browse",
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

import ProfileMenu from "./header-menu";

interface HeaderProps {
    currentPage: "profile" | "browse" | "create" | string;
    isOwnProfile: boolean;
    isEditing: boolean;
}

export default function Header({ currentPage, isOwnProfile, isEditing }: HeaderProps) {
    const router = useRouter();
    // it will now require serious logic

    if (currentPage == "profile") {
        return (
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl text-gray-900 dark:text-white">
                        {isOwnProfile ? "My Profile" : "User Profile"}
                    </h1>

                    {isOwnProfile && <ProfileMenu />}
                </div>
            </nav>
        )
    }

    if (currentPage == "browse") {
        return (
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Markeet
                    </h1>
                    <ProfileMenu />
                </div>
            </nav>
        )
    }

    if (currentPage == "create") {
        return (
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                        <span className="text-xl text-gray-900 dark:text-white">
                            {isEditing ? "Edit Listing" : "Create Listing"}
                        </span>
                    </div>
                    <ProfileMenu />
                </div>
            </nav>
        )
    }

    return null
}
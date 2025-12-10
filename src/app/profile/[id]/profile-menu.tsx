"use client";

import { EllipsisVertical, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function ProfileMenu() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const { supabase } = useContext(ShellContext);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const themeOptions = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                    <EllipsisVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
                {/* Theme Section */}
                <div className="mb-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Theme
                    </div>
                    {themeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${theme === option.value
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{option.label}</span>
                                {theme === option.value && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </PopoverContent>
        </Popover>
    );
}
// ============================================
// FILE: app/profile/components/profile-stats.tsx
// ============================================

import { createClient } from "@/utils/supabase/server";
import { Package, ShoppingBag, Heart, Eye } from "lucide-react";

export default async function ProfileStats({ userId }: { userId: string }) {
    const supabase = await createClient();

    // Fetch aggregated stats from view
    const { data: stats } = await supabase
        .from("profile_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

    const statsData = [
        {
            icon: Package,
            value: stats?.active_listings_count || 0,
            label: "Active Listings",
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            icon: ShoppingBag,
            value: stats?.sold_listings_count || 0,
            label: "Items Sold",
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            icon: Heart,
            value: stats?.favorites_count || 0,
            label: "Favorites",
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-50 dark:bg-red-900/20",
        },
        {
            icon: Eye,
            value: stats?.total_views || 0,
            label: "Total Views",
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className={`${stat.bgColor} p-1.5 sm:p-2 rounded-lg`}>
                                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">
                            {stat.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
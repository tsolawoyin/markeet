// ============================================
// FILE: app/profile/components/profile-tabs.tsx (Client Component for interactivity)
// ============================================

"use client";

import { useState, useEffect, useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Package, Heart, ShoppingBag, Loader2 } from "lucide-react";
import ListingCard from "./listing-card";

type Tab = "listings" | "favorites" | "sold";

export default function ProfileTabs({
    userId,
    isOwnProfile = false
}: {
    userId: string;
    isOwnProfile?: boolean;
}) {
    const { supabase } = useContext(ShellContext);
    const [activeTab, setActiveTab] = useState<Tab>("listings");
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let query;

            switch (activeTab) {
                case "listings":
                    // Fetch active listings
                    query = supabase
                        .from("listings")
                        .select("*")
                        .eq("seller_id", userId)
                        .eq("status", "active")
                        .order("created_at", { ascending: false });
                    break;

                case "sold":
                    // Fetch sold listings (only for own profile)
                    if (!isOwnProfile) {
                        setListings([]);
                        setLoading(false);
                        return;
                    }
                    query = supabase
                        .from("listings")
                        .select("*")
                        .eq("seller_id", userId)
                        .eq("status", "sold")
                        .order("updated_at", { ascending: false });
                    break;

                case "favorites":
                    // Fetch favorited listings (only for own profile)
                    if (!isOwnProfile) {
                        setListings([]);
                        setLoading(false);
                        return;
                    }
                    query = supabase
                        .from("favorites")
                        .select(
                            `
              id,
              created_at,
              listing:listings (*)
            `
                        )
                        .eq("user_id", userId)
                        .order("created_at", { ascending: false });
                    break;
            }

            const { data, error } = await query;

            if (error) throw error;

            // For favorites, extract the listing objects
            if (activeTab === "favorites") {
                setListings(data.map((fav: any) => fav.listing).filter(Boolean));
            } else {
                setListings(data || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        {
            id: "listings" as Tab,
            name: isOwnProfile ? "My Listings" : "Active Listings",
            icon: Package,
            show: true,
        },
        {
            id: "favorites" as Tab,
            name: "Favorites",
            icon: Heart,
            show: isOwnProfile, // Only show for own profile
        },
        {
            id: "sold" as Tab,
            name: "Sold Items",
            icon: ShoppingBag,
            show: isOwnProfile, // Only show for own profile
        },
    ].filter(tab => tab.show);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold whitespace-nowrap transition ${activeTab === tab.id
                                    ? "border-blue-900 dark:border-blue-600 text-blue-900 dark:text-blue-400"
                                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {activeTab === "listings" && (isOwnProfile ? "No active listings" : "No listings available")}
                            {activeTab === "favorites" && "No favorites yet"}
                            {activeTab === "sold" && "No sold items"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {activeTab === "listings" && isOwnProfile &&
                                "Create your first listing to get started"}
                            {activeTab === "listings" && !isOwnProfile &&
                                "This user hasn't posted any listings yet"}
                            {activeTab === "favorites" &&
                                "Start favoriting items you're interested in"}
                            {activeTab === "sold" && "Items you've sold will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                showActions={activeTab === "listings" && isOwnProfile}
                                onUpdate={fetchData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { useShell } from "@/provider/shell";
import { useApp } from "@/providers/app-provider";

import ListingCard from "@/components/listing-card";
import Link from "next/link";
import { fetchUserOffers } from "@/utils/fetchers";
import { Listing } from "@/components/listing-card";
import { ChevronRight, ShoppingBag } from "lucide-react";

export default function Listings() {
  const { supabase, user } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);

  const params = useParams();
  const isOwner = params.id == "me" || params.id == user?.id;

  useEffect(() => {
    const userId = isOwner ? user?.id : (params.id as string);
    if (!userId) return;

    fetchUserOffers(supabase, userId, {
      limit: 6,
      offset: 0,
      status: "active",
      type: "product", // Only show products here
    }).then((data) => {
      if (data && data.length > 0) setListings(data);
    });
  }, [user, params.id, isOwner, supabase]);

  if (!listings.length) {
    return (
      <div className="px-5 lg:px-12 py-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-900">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
          Active Listings
        </h2>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 text-stone-400 dark:text-stone-500" />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            No active listings yet
          </p>
        </div>
      </div>
    );
  }

  const userId = isOwner ? user?.id : (params.id as string);

  return (
    <div className="px-5 lg:px-12 py-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
          Listings
        </h2>
        {userId && (
          <Link
            href={`/view/listings/${userId}`}
            className="flex items-center gap-0.5 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:opacity-80 transition-opacity"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/listing/${listing.id}`}>
            <ListingCard listing={listing} />
          </Link>
        ))}
      </div>
    </div>
  );
}

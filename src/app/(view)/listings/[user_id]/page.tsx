"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { fetchUserOffers } from "@/utils/fetchers";
import { type Listing } from "@/components/listing-card";
import ListingCard from "@/components/listing-card";
import Link from "next/link";
import { ArrowLeft, Package, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserListingsPage() {
  const { supabase, user } = useApp();
  const params = useParams();
  const router = useRouter();
  const userId = params.user_id as string;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [userName, setUserName] = useState<string>("");
  const limit = 20;

  const isOwner = user?.id === userId;

  // Fetch user profile
  useEffect(() => {
    if (userId) {
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single()
        .then(({ data }) => {
          if (data) setUserName(data.full_name);
        });
    }
  }, [userId, supabase]);

  // Fetch initial listings
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchUserOffers(supabase, userId, {
      status: "active",
      limit,
      offset: 0,
    }).then((data) => {
      if (data && data.length > 0) {
        setListings(data);
        setHasMore(data[0]?.has_more || false);
      }
      setLoading(false);
    });
  }, [userId, supabase]);

  // Load more listings
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const newOffset = offset + limit;
    const data = await fetchUserOffers(supabase, userId, {
      status: "active",
      limit,
      offset: newOffset,
    });

    if (data && data.length > 0) {
      setListings((prev) => [...prev, ...data]);
      setOffset(newOffset);
      setHasMore(data[0]?.has_more || false);
    }
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-32 h-5" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="px-5 lg:px-12 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">
              {userName ? `${userName}'s Listings` : "Listings"}
            </span>
          </button>
        </header>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-stone-400 dark:text-stone-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">
            No listings yet
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 text-center max-w-xs">
            {isOwner
              ? "You haven't created any listings yet"
              : "This user hasn't created any listings yet"}
          </p>
          {isOwner && (
            <Link
              href="/create/listing"
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
            >
              Create Listing
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">
              {userName ? `${userName}'s Listings` : "Listings"}
            </span>
          </button>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </span>
        </div>
      </header>

      {/* Listings Grid */}
      <div className="px-5 lg:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`}>
              <ListingCard listing={listing} />
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-xl font-semibold text-stone-900 dark:text-white hover:border-orange-500 dark:hover:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import ListingCard, { type Listing } from "@/components/listing-card";
import { useApp } from "@/providers/app-provider";
import { fetchSearchResults } from "@/utils/fetchers";
import { type CategoryFilter } from "./category-bar";

const ITEMS_PER_PAGE = 20;

export function ProductGrid({ activeFilter }: { activeFilter: CategoryFilter }) {
  const { supabase, user } = useApp();

  const [results, setResults] = useState<Listing[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const buildParams = useCallback(() => {
    const params: Parameters<typeof fetchSearchResults>[1] = {
      page_limit: ITEMS_PER_PAGE,
    };

    if (activeFilter.type === "category") {
      params.filter_category_id = activeFilter.id;
    } else if (activeFilter.type === "hall" && user?.profile.hall_of_residence) {
      params.filter_hall = user.profile.hall_of_residence;
    }

    return params;
  }, [activeFilter, user?.profile.hall_of_residence]);

  const performSearch = useCallback(
    async (resetOffset = true) => {
      setLoading(true);
      if (resetOffset) {
        setInitialLoading(true);
      }

      const newOffset = resetOffset ? 0 : offset;
      const params = buildParams();
      params.page_offset = newOffset;

      const data = await fetchSearchResults(supabase, params);

      if (resetOffset) {
        setResults(data || []);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setResults((prev) => [...prev, ...(data || [])]);
        setOffset((prev) => prev + ITEMS_PER_PAGE);
      }

      if (!data || data.length === 0 || data[0]?.has_more === false) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setLoading(false);
      setInitialLoading(false);
    },
    [supabase, offset, buildParams],
  );

  // Reset and fetch when filter changes
  useEffect(() => {
    setResults([]);
    setOffset(0);
    setHasMore(true);
    performSearch(true);
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          performSearch(false);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, initialLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="px-5 lg:px-8 pt-4 pb-20">
      {initialLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCard key={i} listing={null} variant="grid" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-stone-400 dark:text-stone-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
            No listings yet
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 text-center max-w-xs">
            Check back later or try a different category
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`}>
                <ListingCard listing={item} variant="grid" />
              </Link>
            ))}
          </div>

          {/* Loading indicator */}
          {loading && !initialLoading && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          )}

          {/* End of results */}
          {!hasMore && results.length > 0 && (
            <div className="text-center pt-5">
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                You&apos;ve reached the end!
              </p>
            </div>
          )}
        </>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-20" />
    </div>
  );
}

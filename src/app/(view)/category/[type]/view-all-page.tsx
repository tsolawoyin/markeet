"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
  Store,
  Building2,
  GraduationCap,
  Heart,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/listing-card";

import { Pattaya } from "next/font/google";

const pattaya = Pattaya({
  weight: ["400"],
  subsets: ["latin"],
});

import Link from "next/link";

import {
  fetchAllListings,
  fetchHallListings,
  fetchCourseListings,
} from "@/utils/fetchers";
import { useApp } from "@/providers/app-provider";

const ITEMS_PER_PAGE = 20;

const BANNER_CONFIG: Record<string, { icon: typeof Store; subtitle: string }> =
  {
    all: {
      icon: Store,
      subtitle: "Browse everything available on campus",
    },
    hall: {
      icon: Building2,
      subtitle: "Listings from students in your hall",
    },
    course: {
      icon: GraduationCap,
      subtitle: "Items relevant to your course",
    },
  };

export default function SeeAllPage({
  initialItems,
  type,
}: {
  initialItems: any;
  type: string;
}) {
  const { supabase, user } = useApp();
  const router = useRouter();

  const [items, setItems] = useState<any[]>(initialItems);
  const [offset, setOffset] = useState(initialItems.length ? 20 : 0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(initialItems.length ? 20 : 0);
  const initialLoadDone = useRef(true);

  const genTitle = (type: string) => {
    if (type == "hall") return `From ${user?.profile.hall_of_residence} hall`;
    if (type == "all") return "What students are selling";
    if (type == "course") return `For ${user?.profile.course} students`;
  };

  const banner = BANNER_CONFIG[type] || BANNER_CONFIG.all;
  const BannerIcon = banner.icon;

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  // Observer — reads from the ref, never stale
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          initialLoadDone.current
        ) {
          loadItems(offset);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, type]);

  const loadItems = async (offset: number = 0) => {
    // console.log(offset);

    try {
      setLoading(true);

      const fetchMap: Record<string, Function> = {
        all: fetchAllListings,
        hall: fetchHallListings,
        course: fetchCourseListings,
      };

      const fetcher = fetchMap[type];

      if (!fetcher) {
        console.warn("Unknown feed type:", type);
        return;
      }

      // console.log("fetching the next ", offset, " items");
      const newItems = await fetcher(supabase, ITEMS_PER_PAGE, offset);

      if (!newItems || newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => (offset === 0 ? newItems : [...prev, ...newItems]));

      setOffset((prev) => prev + ITEMS_PER_PAGE);

      // if your backend returns has_more
      if (newItems[0]?.has_more === false) {
        setHasMore(false);
      }
    } catch (err) {
      // console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Branded Banner */}
      <div className="bg-linear-to-br relative from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-8 w-20 h-20 bg-white/5 rounded-full hidden md:block" />

        <div className="relative z-10 px-5 pt-5 pb-6 lg:px-12 lg:pt-8 lg:pb-10">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-white/15 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <BannerIcon className="w-5 h-5" />
            </div> */}
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">
                {genTitle(type)}
              </h1>
              <p className="text-orange-100 text-sm mt-0.5">
                {banner.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link href={`/listing/${item.id}`}>
              <ListingCard key={item.id} listing={item} />
            </Link>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}

        {/* End of results */}
        {!hasMore && items.length > 0 && (
          <div className="text-center pt-5">
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              You've reached the end!
            </p>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="h-20" />

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              No items found
            </h3>
            {/* <p className="text-sm text-stone-600 dark:text-stone-400 text-center mb-4">
              Try adjusting your filters or check back later
            </p> */}
          </div>
        )}
      </div>

      {/* Scroll to top button (appears after scrolling) */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

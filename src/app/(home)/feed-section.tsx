import Link from "next/link";
import ListingCard from "@/components/listing-card";

import { useApp } from "@/providers/app-provider";
import { useEffect, useState } from "react";
import {
  fetchAllListings,
  fetchHallListings,
  fetchCourseListings,
} from "@/utils/fetchers";
import { type Listing } from "@/components/listing-card";
import {
  ChevronRight,
  Store,
  Building2,
  GraduationCap,
  Heart,
  Wrench,
  TrendingUp,
  PackageOpen,
} from "lucide-react";

export interface HallOffer {
  id: string;
  title: string;
  price: number;
  images: string[]; // Single image URL (first from array)
  seller: {
    name: string;
    avatar: string;
    hall_of_residence: string;
    rating: number;
    review_count: number;
  };
  offer_type: "product" | "service";
  created_at: string; // Formatted as "2h ago", "5m ago", etc.
  views_count: number;
  turnaround_days: number | null;
  total_count: number; // Total number of matching records
  has_more: boolean; // Whether there are more records to load
}

const SECTION_STYLE: Record<
  string,
  {
    icon: typeof Store;
    accent: string;
    accentDark: string;
    badge: string;
    badgeDark: string;
  }
> = {
  all: {
    icon: Store,
    accent: "text-orange-600",
    accentDark: "dark:text-orange-400",
    badge: "bg-orange-100 text-orange-700",
    badgeDark: "dark:bg-orange-900/30 dark:text-orange-400",
  },
  hall: {
    icon: Building2,
    accent: "text-blue-600",
    accentDark: "dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700",
    badgeDark: "dark:bg-blue-900/30 dark:text-blue-400",
  },
  course: {
    icon: GraduationCap,
    accent: "text-emerald-600",
    accentDark: "dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
    badgeDark: "dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  wish: {
    icon: Heart,
    accent: "text-purple-600",
    accentDark: "dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700",
    badgeDark: "dark:bg-purple-900/30 dark:text-purple-400",
  },
  service: {
    icon: Wrench,
    accent: "text-teal-600",
    accentDark: "dark:text-teal-400",
    badge: "bg-teal-100 text-teal-700",
    badgeDark: "dark:bg-teal-900/30 dark:text-teal-400",
  },
  trending: {
    icon: TrendingUp,
    accent: "text-rose-600",
    accentDark: "dark:text-rose-400",
    badge: "bg-rose-100 text-rose-700",
    badgeDark: "dark:bg-rose-900/30 dark:text-rose-400",
  },
};

const fetchMap: Record<string, Function> = {
  all: fetchAllListings,
  hall: fetchHallListings,
  course: fetchCourseListings,
};

const FeedSection = ({
  title,
  type,
  emptyMessage,
  emptyCtaHref,
  emptyCtaLabel,
}: {
  title: string;
  type: "all" | "hall" | "course";
  emptyMessage?: string;
  emptyCtaHref?: string;
  emptyCtaLabel?: string;
}) => {
  const [items, setItems] = useState<Listing[]>(new Array(5).fill(null));

  const { supabase } = useApp();

  useEffect(() => {
    const fetcher = fetchMap[type];
    if (!fetcher) return;

    fetcher(supabase, 10, 0).then((data: any) => {
      setItems(data ?? []);
    });
  }, []);

  const style = SECTION_STYLE[type] || SECTION_STYLE.all;
  const SectionIcon = style.icon;

  // No items after fetch
  if (!items.length) {
    if (!emptyMessage) return null;

    return (
      <div className="py-3">
        {/* Section Header */}
        <div className="flex items-center justify-between px-5 lg:px-8 mb-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              {title}
            </h2>
          </div>
        </div>

        {/* Empty State */}
        <div className="mx-5 lg:mx-8 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex flex-col items-center text-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${style.badge} ${style.badgeDark} flex items-center justify-center`}
          >
            <PackageOpen className="w-5 h-5" />
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {emptyMessage}
          </p>
          {emptyCtaHref && (
            <Link
              href={emptyCtaHref}
              className={`text-sm font-semibold ${style.accent} ${style.accentDark} hover:opacity-80 transition-opacity`}
            >
              {emptyCtaLabel || "Get started"}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 lg:px-8 mb-3">
        <div className="flex items-center gap-2.5">
          {/* <div
            className={`w-7 h-7 rounded-lg ${style.badge} ${style.badgeDark} flex items-center justify-center`}
          >
            <SectionIcon className="w-3.5 h-3.5" />
          </div> */}
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            {title}
          </h2>
        </div>
        <Link
          href={`/category/${type}`}
          className={`flex items-center gap-0.5 text-sm font-semibold ${style.accent} ${style.accentDark} hover:opacity-80 transition-opacity`}
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 px-5 lg:px-8 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, index) => (
          <Link key={item?.id ?? index} href={`/listing/${item?.id}`}>
            <ListingCard listing={item as Listing | null} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeedSection;

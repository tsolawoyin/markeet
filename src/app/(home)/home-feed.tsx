"use client";

import { useApp } from "@/providers/app-provider";
import HeroCarousel from "./hero-carousel";
import { CategoryBar, type CategoryFilter } from "./category-bar";
import { ProductGrid } from "./product-grid";
import Link from "next/link";
import { Search, Plus, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";

export function HomeFeed() {
  const { user } = useApp();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>({ type: "all" });

  const isNewUser = useMemo(() => {
    if (!user) return false;
    const created = new Date(user.profile.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created > sevenDaysAgo;
  }, [user]);

  const needsProfileCompletion = user && (!user.profile.avatar_url || !user.profile.bio);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Hero Banner Carousel */}
      <HeroCarousel />

      {/* Search Bar */}
      <Link href="/search" className="block px-5 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-400 dark:text-stone-500">
          <Search className="w-5 h-5" />
          <span className="text-sm">Search products, services...</span>
        </div>
      </Link>

      {/* Greeting / Welcome */}
      {user && (
        isNewUser ? (
          <div className="px-5 lg:px-8 pt-4 pb-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Welcome to Markeet, {user.profile.full_name.split(" ")[0]}!
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Get started by exploring what&apos;s around you.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Link
                href="/create/listing"
                className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  List your first item
                </span>
              </Link>

              {needsProfileCompletion && (
                <Link
                  href="/profile/me"
                  className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <UserCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    Complete your profile
                  </span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="px-5 lg:px-8 pt-3 pb-2">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Welcome back,{" "}
              <span className="font-semibold text-stone-700 dark:text-stone-200">
                {user.profile.full_name}
              </span>{" "}
              <span className="text-stone-400 dark:text-stone-500">
                &middot; {user.profile.hall_of_residence}
              </span>
            </p>
          </div>
        )
      )}

      {/* Category Bar */}
      <CategoryBar activeFilter={activeFilter} onSelect={setActiveFilter} />

      {/* Product Grid */}
      <ProductGrid activeFilter={activeFilter} />
    </div>
  );
}

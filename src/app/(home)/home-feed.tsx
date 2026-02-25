"use client";

import { useApp } from "@/providers/app-provider";
import FeedSection from "./feed-section";
import HeroCarousel from "./hero-carousel";
import Link from "next/link";
import { Search, Plus, Building2, UserCircle, Users, Check } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

export function HomeFeed() {
  const { user } = useApp();

  const isNewUser = useMemo(() => {
    if (!user) return false;
    const created = new Date(user.profile.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created > sevenDaysAgo;
  }, [user]);

  const needsProfileCompletion = user && (!user.profile.avatar_url || !user.profile.bio);

  const [copied, setCopied] = useState(false);
  const handleCopyReferral = useCallback(async () => {
    if (!user) return;
    const link = `${window.location.origin}/sign-up?ref=${user.id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [user]);

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
                href="/create/offer"
                className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  List your first item
                </span>
              </Link>

              {/* <Link
                href="/view/category/hall"
                className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  Browse your hall
                </span>
              </Link> */}

              {/* Referral CTA */}

              {/* <button
                onClick={handleCopyReferral}
                className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-purple-300 dark:hover:border-purple-800 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                  {copied ? (
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    {copied ? "Link copied!" : "Invite friends"}
                  </span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    Earn &#8358;200 each
                  </span>
                </div>
              </button> */}

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

      {/* Feed Sections */}
      <FeedSection title="What students are selling" type="all" />

      {/* <FeedSection
        title="Hire a student freelancer"
        type="service"
        emptyMessage="No freelancers yet. Got a skill? List your service!"
        emptyCtaHref="/create/offer"
        emptyCtaLabel="List a service"
      /> */}

      {user && (
        <>
          <FeedSection
            title={`From ${user.profile.hall_of_residence} hall`}
            type="hall"
            emptyMessage={`No listings from ${user.profile.hall_of_residence} yet. Be the first!`}
            emptyCtaHref="/create/offer"
            emptyCtaLabel="List something"
          />
          <FeedSection
            title={`For ${user.profile.course} Students`}
            type="course"
            emptyMessage={`Nothing for ${user.profile.course} students yet. List something!`}
            emptyCtaHref="/create/offer"
            emptyCtaLabel="List something"
          />
        </>
      )}

      {/* <FeedSection
        title="Students are looking for"
        type="wish"
        emptyMessage="No wishes yet. Need something? Let sellers come to you!"
        emptyCtaHref="/create/wish"
        emptyCtaLabel="Post a wish"
      /> */}
    </div>
  );
}

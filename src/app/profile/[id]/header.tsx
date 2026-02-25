"use client";

import {
  MapPin,
  GraduationCap,
  CalendarDays,
  Package,
  Sparkles,
  ChevronRight,
  Wallet,
  ArrowRight,
  Shield,
  Settings,
  Copy,
  Check,
  UserPlus,
  Star,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type Profile } from "@/providers/app-provider";
import { useApp } from "@/providers/app-provider";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ParamValue } from "next/dist/server/request/params";
import { Button } from "@/components/ui/button";
import { follow, isFollowing as isFollowFunc } from "@/utils/follows-utils";
import { useRouter } from "next/navigation";


const formatMemberDate = (dateString: string | number | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const fetchUser = async (userId: ParamValue) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
};

export default function ProfileHeader() {
  const { user, supabase } = useApp();
  const params = useParams();
  const router = useRouter();

  const isOwner = user && (params.id === "me" || params.id === user.id);
  const isAdmin = user?.profile?.role === "admin";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeListings, setActiveListings] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyReferralLink = async () => {
    const link = `${window.location.origin}/sign-up?ref=${user!.id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFollowClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    follow(user.id, params.id).then((done) => {
      if (done) setIsFollowing(true);
    });
  };

  const countListings = async (userId: string) => {
    const { count, error } = await supabase
      .from("offers")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", userId)
      .eq("status", "active");

    if (error) return 0;
    return count as number;
  };

  useEffect(() => {
    if (isOwner && user) {
      setProfile(user.profile);
      countListings(user.id).then((num) => setActiveListings(num));
    } else if (params.id !== "me") {
      fetchUser(params.id).then((data) => {
        if (data) setProfile(data);
      });
      countListings(params.id as string).then((num) => setActiveListings(num));
    }
  }, [params.id, user]);

  useEffect(() => {
    if (!user) {
      setIsFollowing(false);
    } else if (!isOwner) {
      isFollowFunc(user.id, params.id).then((value) => setIsFollowing(value));
    }
  }, []);

  return (
    <>
      {/* ─── Branded Banner ──────────────────────────────────────────────── */}
      <div className="bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 px-5 pt-8 pb-6 lg:px-12 lg:pt-10 lg:pb-8">
          {/* Settings gear for owner */}
          {isOwner && (
            <Link
              href="/settings"
              className="absolute top-4 right-4 lg:top-6 lg:right-8 p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}

          {/* Avatar + Name */}
          <div className="flex items-start gap-4">
            <img
              src={
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "User")}&background=f97316&color=fff&size=200&bold=true&rounded=true`
              }
              alt={profile?.full_name}
              className="w-20 h-20 rounded-full bg-white/20 shadow-lg object-cover border-2 border-white/30"
            />

            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight truncate">
                  {profile?.full_name}
                </h1>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="inline-flex items-center gap-1.5 text-sm text-orange-100">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {profile?.course}
                </div>
                <div className="inline-flex items-center gap-1.5 text-sm text-orange-100">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile?.hall_of_residence} hall
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-5 text-sm">
            <div>
              <span className="font-bold">{profile?.followers_count}</span>
              <span className="text-orange-100 ml-1">followers</span>
            </div>
            {activeListings > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div>
                  <span className="font-bold">{activeListings}</span>
                  <span className="text-orange-100 ml-1">listings</span>
                </div>
              </>
            )}
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1 text-orange-100">
              <CalendarDays className="w-3 h-3" />
              {profile?.created_at && formatMemberDate(profile.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content below banner ────────────────────────────────────────── */}
      <div className="px-5 lg:px-12">
        {/* Owner + Admin: Admin Access Button */}
        {/* {isOwner && isAdmin && (
          <Link href="/admin">
            <div className="bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-2xl p-4 shadow-sm dark:shadow-purple-950/50 border-2 border-purple-200 dark:border-purple-800/60 mb-4 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer group mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-900 dark:text-white">
                      Admin Dashboard
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-300">
                      Manage platform operations
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )} */}

        {/* Non-owner: Follow button */}
        {!isOwner && !isFollowing && (
          <Button
            onClick={handleFollowClick}
            className="mt-4 w-full mb-4 rounded-xl font-semibold text-base shadow-md bg-orange-500 hover:bg-orange-600 text-white"
          >
            {user ? "Follow" : "Login to follow"}
          </Button>
        )}

        {/* Owner: Invite friends referral link */}
        {isOwner && (
          <button
            onClick={handleCopyReferralLink}
            className="mt-4 w-full mb-4 flex items-center gap-3 bg-white dark:bg-stone-900 rounded-xl p-3.5 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 dark:text-white">
                Invite Friends
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {copiedLink ? "Link copied!" : "Copy your referral link"}
              </p>
            </div>
            {copiedLink ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <Copy className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" />
            )}
          </button>
        )}
      </div>
    </>
  );
}

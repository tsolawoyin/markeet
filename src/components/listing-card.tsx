"use client";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  offer_type: "product"; // Take note of this. For now we deal with listing
  //   turnaround_days: number | null;
  condition?: string | null;
  images: string[]; // this is one of the mistakes I made. Smiles...
  tags: string[];
  views_count: number;
  created_at: string; // Raw timestamp "2025-01-30T08:30:00Z"
  status: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    hall_of_residence: string;
    course: string;
    rating: number;
    review_count: number;
    completed_orders: number;
    badge_tier: string;
    completion_rate: number | null;
    phone: string;
    headline: string;
    skills: string[];
  };
  category: {
    id: string;
    name: string;
    description: string | null;
  };
}

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useApp } from "@/providers/app-provider";
import { Button } from "./ui/button";

import {
  Bell,
  MessageSquare,
  Search,
  Heart,
  MapPin,
  Clock,
  Star,
  Eye,
  Target,
} from "lucide-react";

import Image from "next/image";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import { Skeleton } from "./ui/skeleton";
// import SellerBadge from "./seller-badge";

// Color Palette based on #103470
const THEME_COLORS = {
  primary: {
    50: "#E6EBF5", // Very light blue
    100: "#CDD7EB", // Light blue
    200: "#9BB0D7", // Lighter blue
    500: "#103470", // Main deep blue
    600: "#0D2A5A", // Darker blue
    700: "#0A1F44", // Deeper blue
    900: "#06152E", // Very dark blue
  },
  accent: {
    light: "#4A7BC8", // Lighter accent blue
    sky: "#5B9BD5", // Sky blue accent
  },
};

const ListingCard = ({ listing }: { listing: Listing | null }) => {
  // console.log(listing);
  const { supabase, user } = useApp();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(listing)
  // const [favoritesCount, setFavoritesCount] = useState(listing.favorites || 0);

  // Check if listing is already favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.id || !listing) return;

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("offer_id", listing.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking favorite status:", error);
          return;
        }

        setIsFavorited(!!data);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [listing, user?.id, supabase]);

  // Toggle favorite function
  const toggleFavorite = useCallback(
    async (currentFavoriteState: boolean) => {
      console.log("calling....");
      if (!user?.id || !listing) {
        toast.error("Please log in to save listings");
        setIsFavorited(false);
        return;
      }

      console.log("checking...");

      try {
        if (currentFavoriteState) {
          // Remove from favorites
          // console.log("checking222");
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("offer_id", listing.id)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          // Add to favorites
          console.log("adding favorite");
          const { error } = await supabase.from("favorites").insert({
            offer_id: listing.id,
            user_id: user.id,
          });

          console.log(error);

          if (error) {
            console.log(error);
            if (error.code === "23505") {
              console.log(error);
              setIsFavorited(true);
              return;
            }
            throw error;
          }
        }
      } catch (error: any) {
        console.error("Error toggling favorite:", error);
        toast.error("Failed to update favorite");
        // Revert optimistic update
        setIsFavorited(!currentFavoriteState);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, listing, supabase],
  );

  // Debounced version
  const debouncedToggleFavorite = useDebounce(toggleFavorite, 500);

  // Handle favorite toggle with optimistic update
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      toast.error("Please log in to save listings");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);

    // Call debounced function
    debouncedToggleFavorite(isFavorited);
  };

  if (!listing) {
    return (
      <div className="w-40 shrink-0">
        {/* Image Container Skeleton */}
        <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900">
          <Skeleton className="w-full h-full" />

          {/* Save Button Skeleton */}
          <div className="absolute top-2 right-2">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>

          {/* Badge Skeleton */}
          <div className="absolute top-2 left-2">
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>

          {/* Seller Avatar Skeleton */}
          <div className="absolute bottom-2 left-2">
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="mt-2 space-y-2">
          {/* Title Skeleton - 2 lines */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Price Skeleton */}
          <Skeleton className="h-5 w-20" />

          {/* Location Skeleton */}
          <Skeleton className="h-3 w-24" />

          {/* Time Skeleton */}
          <Skeleton className="h-3 w-16" />

          {/* Rating Skeleton */}
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-40 shrink-0 cursor-pointer group">
      {/* Image Container */}
      <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 transition-transform group-hover:scale-[1.02]">
        <Image
          src={listing.images[0]} // this is the best thing intuitively.... images[0]
          alt={listing.title}
          className="w-full h-full object-cover"
          fill
          sizes="160px"
        //   unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Save Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 backdrop-blur-sm rounded-full transition-all shadow-md ${
            isLoading
              ? "bg-white/70 cursor-not-allowed"
              : "bg-white/90 hover:bg-white"
          }`}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-3.5 h-3.5 transition-all ${
              isFavorited
                ? "fill-red-500 text-red-500"
                : "text-stone-600 hover:text-red-500"
            } ${isLoading ? "opacity-50" : ""}`}
          />
        </button>

        {/* Badge */}
        <span className="absolute top-2 left-2 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
          {/* {listing.offer_type === "product" ? "PRODUCT" : "SERVICE"} */}
          {/* PRODUCT */}
          {/* since everything is product now sef, this is supposed to represent the condition of the item */}
          
        </span>

        {/* Seller Avatar */}
        <div className="absolute bottom-2 left-2">
          <Avatar>
            <AvatarImage
              src={listing.seller.avatar}
              alt="listing.seller.name"
            />
          </Avatar>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 line-clamp-2 leading-tight">
          {listing.title}
        </h3>

        <p className="text-base font-bold text-orange-600 dark:text-orange-400 mt-1">
          ₦{listing.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-1 mt-1 text-xs text-stone-500 dark:text-stone-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{listing.seller.hall_of_residence}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
          <Clock className="w-3 h-3" />
          <span>{listing.created_at}</span>
        </div>

        {listing.seller.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {listing.seller.rating}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ({listing.seller.review_count})
            </span>
            {/* <SellerBadge tier={listing.seller.badge_tier} size="sm" /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;

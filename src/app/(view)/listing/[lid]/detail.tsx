"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Star,
  Eye,
  Flag,
  Package,
  Zap,
  ChevronLeft,
  ChevronRight,
  Pencil,
  CheckCircle2,
  ImageIcon,
  Phone,
  MessageCircle,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchOffer } from "@/utils/fetchers";
import { type Listing } from "@/components/listing-card";
import { useApp } from "@/providers/app-provider";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
// import SellerBadge from "@/components/seller-badge";

// ─── Image Gallery ──────────────────────────────────────────────────────────

const ImageGallery = ({
  images,
  onShare,
}: {
  images: string[];
  onShare: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <div
      className="relative w-full aspect-square bg-stone-900 lg:aspect-auto lg:h-125"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchMove={(e) => (touchEndX.current = e.touches[0].clientX)}
      onTouchEnd={handleSwipe}
    >
      <img
        src={images[activeIndex]}
        alt={`Image ${activeIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Image Counter */}
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-full">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="absolute top-4 left-4 p-3 bg-white dark:bg-stone-900 rounded-full shadow-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors active:scale-95"
      >
        <Share2 className="w-5 h-5 text-stone-700 dark:text-stone-300" />
      </button>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows (Desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1,
              )
            }
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-stone-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-700 dark:text-stone-300" />
          </button>
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1,
              )
            }
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-stone-900 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-stone-700 dark:text-stone-300" />
          </button>
        </>
      )}
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ListingDetailPage({
  ofd,
  lid,
}: {
  ofd: Listing | null;
  lid: string;
}) {
  const router = useRouter();
  const { supabase, user } = useApp();

  const [listing, setListing] = useState<Listing | null>(ofd);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);

  const isOwner = user?.id === listing?.seller?.id;

  // Share functionality
  const handleShare = async () => {
    if (!listing) return;

    const shareUrl = window.location.href;
    const shareData = {
      title: listing.title,
      text: `Check out this product: ${listing.title} - ₦${listing.price.toLocaleString()}`,
      url: shareUrl,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (currentFavoriteState: boolean) => {
      if (!user?.id || !listing) {
        toast.error("Please log in to save listings");
        setIsFavorited(false);
        return;
      }

      try {
        if (currentFavoriteState) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("offer_id", listing.id)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase.from("favorites").insert({
            offer_id: listing.id,
            user_id: user.id,
          });

          if (error) {
            if (error.code === "23505") {
              setIsFavorited(true);
              return;
            }
            throw error;
          }
        }
      } catch {
        toast.error("Failed to update favorite");
        setIsFavorited(!currentFavoriteState);
      } finally {
        setIsFavLoading(false);
      }
    },
    [user?.id, listing, supabase],
  );

  const debouncedToggleFavorite = useDebounce(toggleFavorite, 500);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      toast.error("Please log in to save listings");
      return;
    }

    if (isLoading) return;

    setIsFavLoading(true);
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    debouncedToggleFavorite(isFavorited);
  };

  // Check favorite status on mount
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

        if (error && error.code !== "PGRST116") return;
        setIsFavorited(!!data);
      } catch {
        // silently fail
      }
    };

    checkFavoriteStatus();
  }, [listing, user?.id, supabase]);

  // Backup fetch if server didn't provide data
  useEffect(() => {
    if (!lid) {
      setError("No listing ID provided");
      setIsLoading(false);
      return;
    }

    const loadOffer = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOffer(supabase, lid);
        if (!data) {
          setError("Listing not found");
        } else {
          setListing(data);
        }
      } catch {
        setError("Failed to load listing. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!listing) {
      loadOffer();
    }
  }, [lid]);

  // Error State
  if (error || (!isLoading && !listing)) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
        <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
          <p className="text-stone-600 dark:text-stone-400 text-center">
            {error || "Listing not found"}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  // ─── Product Layout (existing) ──────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24">
      {/* Back Button Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Desktop: constrained layout */}
      <div className="lg:max-w-5xl lg:mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-8">
        {/* Image Gallery */}
        <div className="lg:rounded-2xl lg:overflow-hidden lg:sticky lg:top-20 lg:self-start">
          <ImageGallery images={listing.images} onShare={handleShare} />
        </div>

        {/* Content Section */}
        <div className="px-5 py-6 bg-white dark:bg-stone-900 rounded-t-3xl -mt-6 relative z-10 shadow-lg lg:mt-0 lg:rounded-2xl lg:shadow-md lg:border lg:border-stone-200 lg:dark:border-stone-800">
          {/* Type Badge + Flag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 text-sm font-semibold rounded-full border border-orange-200 dark:border-orange-800/40">
              <>
                <Package className="w-4 h-4" />
                PRODUCT
              </>
            </span>
            <button
              onClick={() => toast.info("Report feature coming soon")}
              className="ml-auto p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <Flag className="w-5 h-5 text-stone-500 dark:text-stone-400" />
            </button>
          </div>

          {/* Price */}
          <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            ₦{listing.price.toLocaleString()}
          </h1>

          {/* Title */}
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white leading-tight">
            {listing.title}
          </h2>

          {/* Seller Info Card */}
          <Link href={`/profile/${listing.seller.id}`}>
            <div className="flex items-center gap-3 mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-14 h-14 rounded-full border-2 border-white dark:border-stone-700 shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-stone-900 dark:text-white">
                    {listing.seller.name}
                  </p>
                  {/* <SellerBadge tier={listing.seller.badge_tier} size="sm" /> */}
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {listing.seller.course}
                </p>
                {listing.seller.rating > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                        {listing.seller.rating}
                      </span>
                    </div>
                    {listing.seller.completed_orders >= 5 && (
                      <>
                        <span className="text-xs text-stone-500 dark:text-stone-500">
                          •
                        </span>
                        <span className="text-sm text-stone-600 dark:text-stone-400">
                          {listing.seller.completed_orders} sales
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Location & Time */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  Location
                </p>
                <p className="font-medium text-stone-700 dark:text-stone-200">
                  {listing.seller.hall_of_residence}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full">
                <Clock className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  Posted
                </p>
                <p className="font-medium text-stone-700 dark:text-stone-200">
                  {formatTimeAgo(listing.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-200 dark:bg-stone-800 my-6" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
              Description
            </h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Category */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-400 mb-2">
              Category
            </h3>
            <span className="inline-block px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-full">
              {listing.category.name}
            </span>
          </div>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-400 mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 text-sm font-medium rounded-full border border-orange-200 dark:border-orange-800/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View Count */}
          {/* <div className="flex items-center gap-2 mt-6 text-stone-500 dark:text-stone-500 text-sm">
            <Eye className="w-4 h-4" />
            <span>{listing.views_count.toLocaleString()} views</span>
          </div> */}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-2xl z-50">
        <div className="flex gap-3 max-w-5xl mx-auto">
          {isOwner ? (
            <Link href={`/create/offer?oid=${lid}`} className="flex-1">
              <Button className="h-14 w-full bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold rounded-xl shadow-md">
                <Pencil className="w-5 h-5 mr-2" />
                Edit Listing
              </Button>
            </Link>
          ) : !user ? (
            <Link href="/auth/login" className="flex-1">
              <Button className="h-14 w-full bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold rounded-xl shadow-md">
                <LogIn className="w-5 h-5 mr-2" />
                Sign in to contact seller
              </Button>
            </Link>
          ) : (
            <>
              <button
                onClick={handleToggleFavorite}
                disabled={isFavLoading}
                className={`flex items-center justify-center w-14 h-14 border-2 rounded-xl transition-all ${
                  isFavorited
                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-600 dark:border-orange-500 text-orange-600 dark:text-orange-400"
                    : "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-orange-600 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 transition-all ${isFavorited ? "fill-orange-600 dark:fill-orange-400" : ""}`}
                />
              </button>
              {/* Order button — commented out while ordering is deactivated
              <Link href={`/create/order?lid=${lid}`} className="flex-1">
                <Button className="h-14 w-full bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold rounded-xl shadow-md">
                  Order now
                </Button>
              </Link>
              */}
              <a
                href={`https://wa.me/${listing.seller.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in your listing: ${listing.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="h-14 w-full bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-xl shadow-md">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
              <a
                href={`tel:${listing.seller.phone}`}
                className="flex items-center justify-center w-14 h-14 border-2 rounded-xl transition-all bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-orange-600 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                aria-label="Call seller"
              >
                <Phone className="w-5 h-5" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// I'm even lazy to write any code... Omase o...

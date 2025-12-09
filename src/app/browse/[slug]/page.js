// ============================================
// FILE 1: app/browse/[slug]/page.js (Server Component)
// ============================================

// ============================================
// FILE 2: app/browse/[slug]/listing-detail-client.js (Client Component)
// ============================================

"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  User,
  Heart,
  ArrowLeft,
  Shield,
  MapPin,
  Clock,
  Tag,
  AlertTriangle,
  Loader2,
  Phone,
  Mail,
  Eye,
  Share2,
} from "lucide-react";
import { ShellContext } from "@/shell/shell";
import Link from "next/link";

export default function ListingDetailClient({ listingId }) {
  const router = useRouter();
  const { supabase, user } = useContext(ShellContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarListings, setSimilarListings] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);

      // Fetch the listing
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .eq("status", "active")
        .single();

      if (error) throw error;

      setListing(data);

      // Increment view count
      await supabase.rpc("increment_listing_views", {
        listing_id: listingId,
      });

      // Fetch similar listings (same category, different listing)
      const { data: similar } = await supabase
        .from("listings")
        .select("*")
        .eq("category", data.category)
        .eq("status", "active")
        .neq("id", listingId)
        .limit(4);

      setSimilarListings(similar || []);
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const getConditionColor = (condition) => {
    if (condition === "new")
      return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
    if (condition === "fairly-used")
      return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
    return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  const getConditionLabel = (condition) => {
    if (condition === "fairly-used") return "Fairly Used";
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const getCategoryName = (category) => {
    const categories = {
      textbooks: "Textbooks",
      "phones & laptops": "Phones & Laptops",
      "hostel essentials": "Hostel Essentials",
    };
    return categories[category] || category;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this listing: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Listing not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This listing may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/browse")}
            className="px-4 py-2 bg-blue-900 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const gradientColors = [
    "from-blue-100 to-blue-200",
    "from-purple-100 to-purple-200",
    "from-green-100 to-green-200",
    "from-pink-100 to-pink-200",
  ];
  const gradientIndex =
    listing.category === "textbooks"
      ? 0
      : listing.category === "phones & laptops"
      ? 1
      : 2;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 dark:text-white" />
            </button>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Item Details
            </span>
          </div>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <Share2 className="w-6 h-6 dark:text-white" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl relative overflow-hidden bg-white dark:bg-gray-800">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <img
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.is_featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                      Featured
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${
                    gradientColors[gradientIndex]
                  } dark:opacity-90 flex items-center justify-center`}
                >
                  <div className="text-center">
                    <Tag className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No image available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-blue-900 dark:border-blue-600"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {listing.views_count || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Posted</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getTimeAgo(listing.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.hall_of_residence}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(listing.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
                      {getCategoryName(listing.category)}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                        listing.condition
                      )}`}
                    >
                      {getConditionLabel(listing.condition)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isSaved
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-6">
                ₦{parseFloat(listing.price).toLocaleString()}
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Seller Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-blue-900 dark:text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {listing.seller_name}
                    </div>
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {listing.hall_of_residence}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {listing.seller_phone && (
                  <a
                    href={`tel:${listing.seller_phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{listing.seller_phone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${listing.seller_email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{listing.seller_email}</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`tel:${listing.seller_phone}`}
                  className="w-full py-3 bg-blue-900 dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-5 h-5" />
                  Call Seller
                </a>
                <a
                  href={`mailto:${listing.seller_email}?subject=Interested in ${listing.title}`}
                  className="w-full py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </a>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-900 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Safe Campus Meetup
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Always meet in public campus locations. Suggested: UI
                    Library, Student Union Building, Faculty entrances. Never
                    share personal banking details.
                  </p>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <button className="w-full py-3 border-2 border-red-600 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition">
              <AlertTriangle className="w-5 h-5" />
              Report Listing
            </button>
          </div>
        </div>

        {/* Similar Items */}
        {similarListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Similar Items
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/browse/${item.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-blue-900/20 transition cursor-pointer border border-transparent dark:border-gray-700 dark:hover:border-blue-600 block"
                >
                  <div className="aspect-square rounded-t-xl relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          gradientColors[gradientIndex]
                        } dark:opacity-90`}
                      ></div>
                    )}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-bold text-blue-900 dark:text-blue-400 shadow-sm">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getConditionLabel(item.condition)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  Filter,
  X,
  BookOpen,
  Laptop,
  Home,
  Package,
  Loader,
  Shirt,
  Apple
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import Link from "next/link";

import Header from "@/components/header/header";

const categories = [
  { id: "all", name: "All Items", icon: Package },
  { id: "textbooks", name: "Textbooks", icon: BookOpen },
  { id: "phones & laptops", name: "Phones & Laptops", icon: Laptop },
  { id: "hostel essentials", name: "Hostel Essentials", icon: Home },
  { id: "food & groceries", name: "Food & Groceries", icon: Apple },
  { id: "clothing & accessories", name: "Clothing & Accessories", icon: Shirt },
];

// UI Halls of Residence
const hallsOfResidence = [
  { id: "all", name: "All Halls" },
  { id: "tedder", name: "Tedder Hall" },
  { id: "queen-elizabeth", name: "Queen Elizabeth Hall" },
  { id: "queen-idia", name: "Queen Idia Hall" },
  { id: "obafemi-awolowo", name: "Obafemi Awolowo Hall" },
  { id: "nnamdi-azikiwe", name: "Nnamdi Azikiwe Hall" },
  { id: "sultan-bello", name: "Sultan Bello Hall" },
  { id: "independence", name: "Independence Hall" },
  { id: "mellanby", name: "Mellanby Hall" },
  { id: "kuti", name: "Kuti Hall" },
  { id: "off-campus", name: "Off Campus" },
];

const ITEMS_PER_PAGE = 12;

const gradientColors = [
  "from-blue-100 to-blue-200",
  "from-purple-100 to-purple-200",
  "from-green-100 to-green-200",
  "from-pink-100 to-pink-200",
];

export default function HomePage() {
  const { supabase, user } = useContext(ShellContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHall, setSelectedHall] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  // exactly.
  const userHall = user?.user_metadata?.hall_of_residence || "";
  const observerTarget = useRef(null);

  // Fetch listings from Supabase
  const fetchListings = useCallback(
    async (pageNum = 0, append = false) => {
      try {
        if (pageNum === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        let query = supabase
          .from("listings")
          .select("*", { count: "exact" })
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        if (selectedHall !== "all") {
          query = query.eq("hall_of_residence", selectedHall);
        }

        if (searchQuery.trim()) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
          );
        }

        const from = pageNum * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;

        // Filter out listings without images
        const dataWithImages = data.filter(
          (item) =>
            item.images && Array.isArray(item.images) && item.images.length > 0
        );

        // Sort: user's hall first
        const sortedData = dataWithImages.sort((a, b) => {
          if (
            a.hall_of_residence === userHall &&
            b.hall_of_residence !== userHall
          )
            return -1;
          if (
            a.hall_of_residence !== userHall &&
            b.hall_of_residence === userHall
          )
            return 1;
          return 0;
        });

        if (append) {
          setListings((prev) => [...prev, ...sortedData]);
        } else {
          setListings(sortedData);
        }

        setTotalCount(count || 0);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, selectedHall, searchQuery, userHall, supabase]
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchListings(0, false);
  }, [selectedCategory, selectedHall, searchQuery, fetchListings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchListings(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, page, fetchListings]);

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

  const getGradientColor = (category) => {
    const index = categories.findIndex((c) => c.id === category);
    return gradientColors[index % gradientColors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <Header currentPage={"browse"} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for items, textbooks, laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-base dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Quick Categories - Horizontal Scroll on Mobile */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? "bg-blue-900 dark:bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === "all"
                ? "Latest Items"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {loading ? "Loading..." : `${totalCount} items available`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {selectedHall !== "all" && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filter by Hall of Residence
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {hallsOfResidence.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    selectedHall === hall.id
                      ? "bg-blue-900 dark:bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {hall.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {listings.map((item) => (
                <Link
                  key={item.id}
                  href={`/browse/${item.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-blue-900/20 transition cursor-pointer border border-transparent dark:border-gray-700 dark:hover:border-blue-600 block"
                >
                  {/* Image or Gradient */}
                  <div className="aspect-square rounded-t-xl relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <>
                        {/* <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        /> */}
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                        {/* Subtle overlay for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
                      </>
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${getGradientColor(
                          item.category
                        )} dark:opacity-90`}
                      ></div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-bold text-blue-900 dark:text-blue-400 shadow-sm">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-2 left-2 bg-blue-900 dark:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                      {categories.find((c) => c.id === item.category)?.name}
                    </div>

                    {/* Top left badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.hall_of_residence === userHall && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                          Your Hall
                        </div>
                      )}
                      {item.is_featured && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                          Featured
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium text-xs">
                            {item.hall_of_residence}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            item.condition === "new"
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : item.condition === "fairly-used"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {item.condition === "fairly-used"
                            ? "Fairly Used"
                            : item.condition.charAt(0).toUpperCase() +
                              item.condition.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {loadingMore && (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Loading more...
                </span>
              </div>
            )}

            <div ref={observerTarget} className="h-4" />

            {!hasMore && listings.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  You've reached the end of the listings
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

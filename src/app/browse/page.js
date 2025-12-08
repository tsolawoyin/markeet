"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
  X,
  BookOpen,
  Laptop,
  Sofa,
  Shirt,
  Ticket,
  Wrench,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useContext } from "react";
import { ShellContext } from "@/shell/shell";

const categories = [
  { id: "all", name: "All Items", icon: Package },
  { id: "textbooks", name: "Textbooks", icon: BookOpen },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "furniture", name: "Furniture", icon: Sofa },
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "sports-fitness", name: "Sports & Fitness", icon: Package },
  { id: "kitchen-appliances", name: "Kitchen", icon: Package },
  { id: "room-decor", name: "Room Decor", icon: Package },
  { id: "tickets-events", name: "Tickets", icon: Ticket },
  { id: "services", name: "Services", icon: Wrench },
  { id: "stationery", name: "Stationery", icon: Package },
  { id: "musical-instruments", name: "Music", icon: Package },
  { id: "beauty-personal-care", name: "Beauty", icon: Package },
  { id: "books-novels", name: "Books", icon: BookOpen },
  { id: "gaming-entertainment", name: "Gaming", icon: Package },
];

const universities = [
  { id: "all", name: "All Universities" },
  { id: "University of Ibadan", name: "University of Ibadan" },
  { id: "University of Lagos", name: "University of Lagos" },
  {
    id: "Obafemi Awolowo University,Ile-Ife",
    name: "Obafemi Awolowo University",
  },
  { id: "Covenant University", name: "Covenant University" },
  { id: "Nigerian Defence Academy Kaduna", name: "Nigerian Defence Academy" },
];

const ITEMS_PER_PAGE = 12;

const gradientColors = [
  "from-blue-100 to-blue-200",
  "from-purple-100 to-purple-200",
  "from-green-100 to-green-200",
  "from-pink-100 to-pink-200",
  "from-indigo-100 to-indigo-200",
  "from-yellow-100 to-yellow-200",
  "from-cyan-100 to-cyan-200",
  "from-orange-100 to-orange-200",
  "from-red-100 to-red-200",
  "from-gray-100 to-gray-200",
];

export default function HomePage() {
  // owapa... nice one.
  const { supabase } = useContext(ShellContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  const userUniversity = "University of Ibadan";
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

        if (selectedUniversity !== "all") {
          query = query.eq("university", selectedUniversity);
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

        // Sort: user's university first
        const sortedData = data.sort((a, b) => {
          if (
            a.university === userUniversity &&
            b.university !== userUniversity
          )
            return -1;
          if (
            a.university !== userUniversity &&
            b.university === userUniversity
          )
            return 1;
          return 0;
        });

        if (append) {
          setListings((prev) => [...prev, ...sortedData]);
        } else {
          setListings(sortedData);
        }

        // Update total count from Supabase
        setTotalCount(count || 0);

        // Check if there are more items to load
        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setHasMore(false); // Stop trying to load more on error
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      selectedCategory,
      selectedUniversity,
      searchQuery,
      userUniversity,
      supabase,
    ]
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true); // Reset hasMore when filters change
    fetchListings(0, false);
  }, [selectedCategory, selectedUniversity, searchQuery, fetchListings]);

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for items, textbooks, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-base dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Quick Categories */}
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
            {selectedUniversity !== "all" && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filter by University
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {universities.map((university) => (
                <button
                  key={university.id}
                  onClick={() => setSelectedUniversity(university.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    selectedUniversity === university.id
                      ? "bg-blue-900 dark:bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {university.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-blue-900/20 transition cursor-pointer border border-transparent dark:border-gray-700 dark:hover:border-blue-600"
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${getGradientColor(
                      item.category
                    )} dark:opacity-90 rounded-t-xl relative`}
                  >
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-bold text-blue-900 dark:text-blue-400 shadow-sm">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-blue-900 dark:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {categories.find((c) => c.id === item.category)?.name}
                    </div>

                    {/* Top left badges - stacked vertically with gap */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.university === userUniversity && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Your Campus
                        </div>
                      )}
                      {item.is_featured && (
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">
                            {item.university_short}
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
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.seller_rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {loadingMore && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
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

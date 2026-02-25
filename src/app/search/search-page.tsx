"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  Package,
  Wrench,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  ThumbsUp,
  Recycle,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import ListingCard from "@/components/listing-card";
import Link from "next/link";
import { useApp } from "@/providers/app-provider";
import { fetchSearchResults } from "@/utils/fetchers";
import { useDebounce } from "@/hooks/use-debounce";
// import { type Category, type OfferDetail } from "@/lib/types";
import { type Category } from "../create/listing/types";
import { type Listing } from "@/components/listing-card";
import { createClient } from "@/lib/supabase/client";

const ITEMS_PER_PAGE = 20;

const hallsOfResidence = [
  { value: "queen-elizabeth", label: "Queen Elizabeth II Hall" },
  { value: "queen-idia", label: "Queen Idia Hall" },
  { value: "obafemi-awolowo", label: "Awo Hall" },
  { value: "mellanby", label: "Mellanby Hall" },
  { value: "tedder", label: "Tedder Hall" },
  { value: "kuti", label: "Kuti Hall" },
  { value: "sultan-bello", label: "Sultan Bello Hall" },
  { value: "independence", label: "Great Independence Hall" },
  { value: "nnamdi-azikiwe", label: "Nnamdi Azikiwe Hall" },
  { value: "alexander-brown-hall", label: "Alexander Brown Hall (ABH)" },
  { value: "off-campus", label: "Off Campus" },
];

export default function SearchPage() {
  const { supabase } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [offerType, setOfferType] = useState(searchParams.get("type") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || "",
  );
  const [condition, setCondition] = useState(
    searchParams.get("condition") || "",
  );
  const [hall, setHall] = useState(searchParams.get("hall") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");

  // UI state
  const [results, setResults] = useState<Listing[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const client = createClient();
      const { data } = await client.from("categories").select("*");
      if (data) setCategories(data as Category[]);
    };
    fetchCategories();
  }, []);

  // Build search params for URL sync
  const syncToUrl = useCallback(
    (params: Record<string, string>) => {
      const url = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.set(key, value);
      });
      const paramStr = url.toString();
      router.replace(`/search${paramStr ? `?${paramStr}` : ""}`, {
        scroll: false,
      });
    },
    [router],
  );

  // Search function
  const performSearch = useCallback(
    async (resetOffset = true) => {
      setLoading(true);
      if (resetOffset) {
        setInitialLoading(true);
      }

      const newOffset = resetOffset ? 0 : offset;

      const data = await fetchSearchResults(supabase, {
        search_text: query,
        filter_category_id: categoryId || undefined,
        filter_offer_type: offerType || undefined,
        filter_condition: condition || undefined,
        filter_hall: hall || undefined,
        filter_price_min: priceMin ? Number(priceMin) : undefined,
        filter_price_max: priceMax ? Number(priceMax) : undefined,
        sort_by: sortBy,
        page_limit: ITEMS_PER_PAGE,
        page_offset: newOffset,
      });

      if (resetOffset) {
        setResults(data || []);
        setOffset(ITEMS_PER_PAGE);
      } else {
        setResults((prev) => [...prev, ...(data || [])]);
        console.log(data)
        setOffset((prev) => prev + ITEMS_PER_PAGE);
      }

      if (!data || data.length === 0 || data[0]?.has_more === false) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setLoading(false);
      setInitialLoading(false);
    },
    [
      supabase,
      query,
      categoryId,
      offerType,
      condition,
      hall,
      priceMin,
      priceMax,
      sortBy,
      offset,
    ],
  );

  // Debounced search for text input
  const debouncedSearch = useDebounce(() => {
    syncToUrl({
      q: query,
      type: offerType,
      sort: sortBy,
      category: categoryId,
      condition,
      hall,
      price_min: priceMin,
      price_max: priceMax,
    });
    performSearch(true);
  }, 300);

  // Trigger search on query change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      performSearch(true);
      return;
    }
    debouncedSearch();
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps


  // Trigger search on filter change (immediate, not debounced)
  useEffect(() => {
    if (isFirstLoad.current) return;
    syncToUrl({
      q: query,
      type: offerType,
      sort: sortBy,
      category: categoryId,
      condition,
      hall,
      price_min: priceMin,
      price_max: priceMax,
    });
    performSearch(true);
  }, [offerType, sortBy, categoryId, condition, hall, priceMin, priceMax]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          performSearch(false);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Count active filters
  const activeFilterCount = [
    categoryId,
    condition,
    hall,
    priceMin,
    priceMax,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setQuery("");
    setOfferType("");
    setSortBy("newest");
    setCategoryId("");
    setCondition("");
    setHall("");
    setPriceMin("");
    setPriceMax("");
  };

  const getActivePills = () => {
    const pills: { label: string; onClear: () => void }[] = [];
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId);
      pills.push({
        label: cat?.name || "Category",
        onClear: () => setCategoryId(""),
      });
    }
    if (condition) {
      const condLabels: Record<string, string> = {
        new: "New",
        like_new: "Like New",
        used: "Used",
      };
      pills.push({
        label: condLabels[condition] || condition,
        onClear: () => setCondition(""),
      });
    }
    if (hall) {
      const h = hallsOfResidence.find((h) => h.value === hall);
      pills.push({
        label: h?.label || hall,
        onClear: () => setHall(""),
      });
    }
    if (priceMin || priceMax) {
      let label = "Price: ";
      if (priceMin && priceMax) label += `₦${priceMin} - ₦${priceMax}`;
      else if (priceMin) label += `from ₦${priceMin}`;
      else label += `up to ₦${priceMax}`;
      pills.push({
        label,
        onClear: () => {
          setPriceMin("");
          setPriceMax("");
        },
      });
    }
    return pills;
  };


  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Branded Banner */}
      <div className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 px-5 pt-5 pb-6 lg:px-12 lg:pt-8 lg:pb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-white/15 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">Search</h1>
              <p className="text-orange-100 text-sm mt-0.5">
                Find what you need on campus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-900 px-5 lg:px-12 py-3">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items on campus"
            className="pl-10 pr-10 py-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-base text-stone-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 rounded-xl"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-5 lg:px-12 py-3 border-b border-stone-100 dark:border-stone-900">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* Type chips */}

          {/* {[
            { value: "", label: "All", icon: null },
            { value: "product", label: "Products", icon: Package },
            { value: "service", label: "Services", icon: Wrench },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setOfferType(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                offerType === value
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))} */}

          {/* <div className="w-px h-6 bg-stone-200 dark:bg-stone-800 mx-1 shrink-0" /> */}

          {/* Sort chips */}
          {[
            { value: "newest", label: "Newest", icon: Clock },
            { value: "cheapest", label: "Cheapest", icon: DollarSign },
            { value: "popular", label: "Popular", icon: TrendingUp },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                sortBy === value
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}

          <div className="w-px h-6 bg-stone-200 dark:bg-stone-800 mx-1 shrink-0" />

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilterCount > 0
                ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40"
                : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Pills */}
      {getActivePills().length > 0 && (
        <div className="px-5 lg:px-12 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {getActivePills().map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800/40 whitespace-nowrap"
            >
              {pill.label}
              <button
                onClick={pill.onClear}
                className="hover:bg-orange-200 dark:hover:bg-orange-800/40 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 whitespace-nowrap underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Grid */}
      <div className="px-5 lg:px-12 pt-5 pb-20">
        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-stone-400 dark:text-stone-500" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              No results found
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 text-center max-w-xs">
              Try different keywords or adjust your filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((item) => {
                return (
                  <Link key={item.id} href={`/listing/${item.id}`}>
                    <ListingCard listing={item} />
                  </Link>
                );
              })}
            </div>

            {/* Loading indicator */}
            {loading && !initialLoading && (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            )}

            {/* End of results */}
            {!hasMore && results.length > 0 && (
              <div className="text-center pt-5">
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  You've reached the end!
                </p>
              </div>
            )}
          </>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="h-20" />
      </div>

      {/* Filter Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent
          side="bottom"
          className="dark:bg-stone-900 dark:border-stone-800 rounded-t-2xl max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="dark:text-white">Filters</SheetTitle>
            <SheetDescription className="dark:text-stone-400">
              Refine your search results
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-6 flex flex-col gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                Category
              </label>
              <Select
                value={categoryId}
                onValueChange={(value) =>
                  setCategoryId(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-950 dark:text-white">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">
                Condition
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "", label: "Any", icon: null },
                  { value: "new", label: "New", icon: Sparkles },
                  { value: "like_new", label: "Like New", icon: ThumbsUp },
                  { value: "used", label: "Used", icon: Recycle },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCondition(value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                      condition === value
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-500"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-orange-300 dark:hover:border-orange-700"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-4 h-4 ${
                          condition === value
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-stone-400 dark:text-stone-500"
                        }`}
                      />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        condition === value
                          ? "text-orange-700 dark:text-orange-400"
                          : "text-stone-600 dark:text-stone-300"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location on campus
              </label>
              <Select
                value={hall}
                onValueChange={(value) => setHall(value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-950 dark:text-white">
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All locations</SelectItem>
                    {hallsOfResidence.map((h) => (
                      <SelectItem key={h.value} value={h.value}>
                        {h.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                Price range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 font-medium text-sm">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="pl-7 border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-950 dark:text-white"
                    min="0"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 font-medium text-sm">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="pl-7 border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-950 dark:text-white"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryId("");
                  setCondition("");
                  setHall("");
                  setPriceMin("");
                  setPriceMax("");
                }}
                className="flex-1 dark:border-stone-700 dark:text-stone-200"
              >
                Clear
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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

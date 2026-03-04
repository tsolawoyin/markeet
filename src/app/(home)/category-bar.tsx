"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Category } from "../create/listing/types";
import { Building2 } from "lucide-react";

export type CategoryFilter =
  | { type: "all" }
  | { type: "category"; id: string }
  | { type: "hall" };

export function CategoryBar({
  activeFilter,
  onSelect,
}: {
  activeFilter: CategoryFilter;
  onSelect: (filter: CategoryFilter) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const client = createClient();
      const { data } = await client.from("categories").select("*");
      if (data) setCategories(data as Category[]);
    };
    fetchCategories();
  }, []);

  const isActive = (filter: CategoryFilter) => {
    if (filter.type === "all" && activeFilter.type === "all") return true;
    if (filter.type === "hall" && activeFilter.type === "hall") return true;
    if (
      filter.type === "category" &&
      activeFilter.type === "category" &&
      filter.id === activeFilter.id
    )
      return true;
    return false;
  };

  return (
    <div className="px-5 lg:px-8 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2">
        {/* All chip */}
        <button
          onClick={() => onSelect({ type: "all" })}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            isActive({ type: "all" })
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700"
          }`}
        >
          All
        </button>

        {/* My Hall chip */}
        <button
          onClick={() => onSelect({ type: "hall" })}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            isActive({ type: "hall" })
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          My Hall
        </button>

        {/* Category chips */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect({ type: "category", id: cat.id })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isActive({ type: "category", id: cat.id })
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

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

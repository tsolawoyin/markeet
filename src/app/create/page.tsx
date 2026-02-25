"use client";

import { Package, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {;
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Branded Banner */}
      <div className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 px-5 pt-10 pb-8 lg:px-12 lg:pt-12 lg:pb-10">
          <h1 className="text-2xl lg:text-3xl font-bold">Create</h1>
          <p className="text-orange-100 text-sm mt-1">
            What do you want to do today?
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="px-5 lg:px-12 py-8">
        <div className="max-w-2xl mx-auto grid gap-4">
          {/* Create Listing */}
          <Link href="/create/listing">
            <div className="group relative overflow-hidden bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 p-5 transition-all hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    Create a Listing
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Sell a product to students on campus
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 shrink-0 text-stone-400 dark:text-stone-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Create Wish */}
          {/* <button
            onClick={() => toast.info("Upcoming soon please check back.")}
            className="w-full text-left"
          >
            <div className="group relative overflow-hidden bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 p-5 opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    Make a Wish
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Request an item or service you need from other students
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 shrink-0 text-stone-400 dark:text-stone-500" />
              </div>
            </div>
          </button> */}
        </div>

        {/* Tip */}
        {/* <div className="max-w-2xl mx-auto mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-xl">
          <p className="text-sm text-stone-700 dark:text-stone-300 text-center">
            <strong>Tip:</strong> Create a listing if you&apos;re selling. Make
            a wish if you&apos;re looking to buy.
          </p>
        </div> */}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { fetchOffer } from "@/utils/fetchers";
import ListingDetailPage from "./detail";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://markeet.ng";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lid: string }>;
}): Promise<Metadata> {
  const lid = (await params).lid;
  const supabase = await createClient();
  const offer = await fetchOffer(supabase, lid);

  if (!offer) {
    return {
      title: "Listing Not Found | Markeet",
      description: "This listing could not be found on Markeet.",
    };
  }

  const title = `${offer.title} — ₦${offer.price.toLocaleString()}`;
  const description = offer.description.length > 160
    ? offer.description.slice(0, 157) + "..."
    : offer.description;
  const ogImageUrl = `${siteUrl}/api/og?id=${lid}`;
  const listingUrl = `${siteUrl}/view/listing/${lid}`;

  return {
    title: `${offer.title} | Markeet`,
    description,
    openGraph: {
      type: "website",
      siteName: "Markeet",
      title,
      description,
      url: listingUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: offer.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const DetailSkeleton = () => (
  <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24">
    <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="w-12 h-4" />
      </div>
    </header>

    <Skeleton className="w-full aspect-square" />

    <div className="px-5 py-6 bg-white dark:bg-stone-900 rounded-t-3xl -mt-6 relative z-10 shadow-lg space-y-4">
      <Skeleton className="w-24 h-6 rounded-full" />
      <Skeleton className="w-32 h-8" />
      <Skeleton className="w-3/4 h-7" />

      <div className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-36 h-3" />
        </div>
        <Skeleton className="w-24 h-9 rounded-lg" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-28 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </div>

      <div className="h-px bg-stone-200 dark:bg-stone-800" />

      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-3/4 h-3" />
      </div>

      <div className="space-y-2">
        <Skeleton className="w-16 h-3" />
        <Skeleton className="w-24 h-7 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="w-12 h-3" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-7 rounded-full" />
          <Skeleton className="w-16 h-7 rounded-full" />
          <Skeleton className="w-24 h-7 rounded-full" />
        </div>
      </div>

      <Skeleton className="w-24 h-3" />
    </div>
  </div>
);

const Dynamic = async ({ lid }: { lid: string }) => {
  const supabase = await createClient();
  const data = await fetchOffer(supabase, lid);

  return <ListingDetailPage ofd={data ?? null} lid={lid} />;
};

export default async function Page({
  params,
}: {
  params: Promise<{ lid: string }>;
}) {
  const lid = (await params).lid;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <Dynamic lid={lid} />
    </Suspense>
  );
}

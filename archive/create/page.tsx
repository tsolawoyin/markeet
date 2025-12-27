// ============================================
// FILE: app/listing/create/page.tsx (Server Component with PPR)
// ============================================

import { Suspense } from "react";
import ListingFormClient from "./listing-form-client";
import { ListingFormSkeleton } from "./listing-form-skeleton";


export default async function ListingFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // no need to checj for auth here. Proxy covers that
  // Get listing ID from search params (if editing)
  const params = await searchParams;
  const listingId = params?.id;
  const isEditing = !!listingId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Suspense fallback={<ListingFormSkeleton isEditing={isEditing} />}>
        <ListingFormClient listingId={listingId} />
      </Suspense>
    </div>
  );
}

// Do not forget that you have essentially infinite amount of time now.
// thanks.
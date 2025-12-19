// ============================================
// FILE: app/listing/create/page.tsx (Server Component with PPR)
// ============================================

import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ListingFormClient from "./listing-form-client";
import { ListingFormSkeleton } from "./listing-form-skeleton";


export default async function ListingFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get listing ID from search params (if editing)
  const params = await searchParams;
  const listingId = params?.id;
  const isEditing = !!listingId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Suspense fallback={<ListingFormSkeleton isEditing={isEditing} />}>
        <ListingFormClient userId={user.id} listingId={listingId} />
      </Suspense>
    </div>
  );
}
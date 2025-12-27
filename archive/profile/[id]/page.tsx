// ============================================
// FILE: app/profile/[id]/page.tsx (Server Component with PPR)
// ============================================

import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileHeader from "./components/profile-header";
import ProfileStats from "./components/profile-stats";
import ProfileTabs from "./components/profile-tabs";
import {
  ProfileHeaderSkeleton,
  ProfileStatsSkeleton,
  ProfileTabsSkeleton,
} from "./components/skeletons";

// import ProfileMenu from "./profile-menu";
import Header from "@/components/header/header";

// Enable PPR for this route
// export const experimental_ppr = true;

export default async function ProfilePage({
  params,
}: {
  // params: { id: string },
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine which profile to show
  const profileUserId = id === "me" ? user.id : id;
  const isOwnProfile = profileUserId === user.id;

  // Verify the profile exists
  const { data: profileExists } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileUserId)
    .single();

  if (!profileExists) {
    redirect("/browse");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-15">
      {/* Static Navigation */}
      <Header
        currentPage={"profile"}
        isOwnProfile={isOwnProfile}
        isEditing={false}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header - Dynamic (uses user data) */}
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader userId={profileUserId} isOwnProfile={isOwnProfile} />
        </Suspense>

        {/* Profile Stats - Dynamic (aggregated data) */}
        <Suspense fallback={<ProfileStatsSkeleton />}>
          <ProfileStats userId={profileUserId} />
        </Suspense>

        {/* Profile Tabs - Dynamic (user listings) */}
        <Suspense fallback={<ProfileTabsSkeleton />}>
          <ProfileTabs userId={profileUserId} isOwnProfile={isOwnProfile} />
        </Suspense>
      </div>
    </div>
  );
}

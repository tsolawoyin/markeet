// ============================================
// FILE: app/profile/components/profile-header.tsx
// ============================================

import { createClient } from "@/utils/supabase/server";
import { User, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfileHeader({
  userId,
  isOwnProfile = false
}: {
  userId: string;
  isOwnProfile?: boolean;
}) {
  const supabase = await createClient();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return <div>Profile not found</div>;
  }

  // Format join date
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-900 dark:text-blue-300" />
            </div>
          )}
          {profile.is_active && !profile.is_banned && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.full_name}
            </h2>
            <Shield className="w-5 h-5 text-green-600" />
          </div>

          {/* Show email and phone only on own profile */}
          {isOwnProfile && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {profile.email}
              </p>

              {profile.phone && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                  {profile.phone}
                </p>
              )}
            </>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {profile.course && (
              <>
                <span>{profile.course}</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
              </>
            )}
            <span>{profile.hall_of_residence}</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
              {profile.bio}
            </p>
          )}

          {isOwnProfile && (
            <Link href="/profile/edit">
              <Button
                variant="outline"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
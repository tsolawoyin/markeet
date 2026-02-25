// import { debug } from "./debug";
import { createClient } from "@/lib/supabase/client";
import { ParamValue } from "next/dist/server/request/params";

export async function follow(
  currentUserId: string,
  userToFollowId: string | ParamValue,
) {
  const supabase = createClient();
  const { data, error } = await supabase.from("follows").insert({
    follower_id: currentUserId,
    following_id: userToFollowId,
  });

  if (error) return false;
  return true;
}

export async function unfollow(
  currentUserId: string,
  userToUnfollowId: string,
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", currentUserId)
    .eq("following_id", userToUnfollowId);

  if (error) return false;
  return true;
}

export async function isFollowing(
  currentUserId: string,
  userId: string | ParamValue,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", currentUserId)
    .eq("following_id", userId)
    .single();

  const isFollowing = !!data;
  return isFollowing;
}

export async function getFollowers(userId?: string) {
  console.log(userId);
  if (!userId) return [];

  const supabase = createClient();

  const { data: followers, error } = await supabase
    .from("follows")
    .select(
      `
    id,
    created_at,
    follower:profiles!follower_id (
      id,
      username,
      fullname,
      avatar_url,
      followers_count
    )
  `,
    )
    .eq("following_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    // debug.log(error);
    return [];
  }

  return followers;
}

export async function getFollowing(userId: string) {
  const supabase = createClient();

  const { data: following, error } = await supabase
    .from("follows")
    .select(
      `
    id,
    created_at,
    following:profiles!following_id (
      id,
      username,
      fullname,
      avatar_url,
      followers_count
    )
  `,
    )
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];

  return following;
}

"use server";

import { createNotification } from "./notification-actions";
import { createClient } from "@/lib/supabase/server";
import { CreateNotificationParams } from "@/providers/push-notification-context";

const BATCH_SIZE = 100; // Process 100 users at a time
const DELAY_BETWEEN_BATCHES = 100; // 100ms delay to avoid overwhelming the system

export async function sendNotificationToAllUsers(
  payload: Omit<CreateNotificationParams, "userId">,
) {
  const supabase = await createClient();

  // Fetch all profiles (only IDs to minimize memory)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id");

  if (error) {
    console.error("Failed to fetch profiles:", error);
    return { success: false, error: error.message };
  }

  if (!profiles || profiles.length === 0) {
    return { success: true, message: "No users to notify", sent: 0, failed: 0 };
  }

  const totalUsers = profiles.length;
  let sentCount = 0;
  let failedCount = 0;

  console.log(`Starting notification send to ${totalUsers} users...`);

  // Process in batches
  for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
    const batch = profiles.slice(i, i + BATCH_SIZE);

    // Send notifications for this batch in parallel
    const results = await Promise.allSettled(
      batch.map((profile) =>
        createNotification({
          userId: profile.id,
          ...payload,
        }),
      ),
    );

    // Count successes and failures
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    });

    // Log progress
    console.log(
      `Progress: ${Math.min(i + BATCH_SIZE, totalUsers)}/${totalUsers} processed`,
    );

    // Small delay between batches to prevent overwhelming the system
    if (i + BATCH_SIZE < profiles.length) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_BATCHES),
      );
    }
  }

  console.log(
    `Notification send complete. Sent: ${sentCount}, Failed: ${failedCount}`,
  );

  return {
    success: true,
    total: totalUsers,
    sent: sentCount,
    failed: failedCount,
  };
}

export async function notifyMatchingSellers(wishId: string) {
  const supabase = await createClient();

  // Fetch the wish details
  const { data: wish, error: wishError } = await supabase
    .from("wishes")
    .select("id, category_id, type, tags, buyer_id, title")
    .eq("id", wishId)
    .single();

  if (wishError || !wish) {
    console.error("Failed to fetch wish for matching:", wishError);
    return;
  }

  // Find active offers in the same category + type, excluding the wish creator
  const { data: offers, error: offersError } = await supabase
    .from("offers")
    .select("id, seller_id, tags")
    .eq("category_id", wish.category_id)
    .eq("offer_type", wish.type)
    .eq("status", "active")
    .neq("seller_id", wish.buyer_id)
    .limit(20);

  if (offersError || !offers || offers.length === 0) return;

  // Deduplicate by seller_id, keeping the one with the most tag overlap
  const wishTags = new Set((wish.tags || []).map((t: string) => t.toLowerCase()));
  const sellerMap = new Map<string, { sellerId: string; tagOverlap: number }>();

  for (const offer of offers) {
    const offerTags = (offer.tags || []).map((t: string) => t.toLowerCase());
    const overlap = offerTags.filter((t: string) => wishTags.has(t)).length;
    const existing = sellerMap.get(offer.seller_id);
    if (!existing || overlap > existing.tagOverlap) {
      sellerMap.set(offer.seller_id, { sellerId: offer.seller_id, tagOverlap: overlap });
    }
  }

  // Rank by tag overlap and take top 5
  const topSellers = Array.from(sellerMap.values())
    .sort((a, b) => b.tagOverlap - a.tagOverlap)
    .slice(0, 5);

  // Send notifications
  await Promise.allSettled(
    topSellers.map((seller) =>
      createNotification({
        userId: seller.sellerId,
        title: "Someone needs what you sell!",
        body: `A buyer is looking for: "${wish.title}"`,
        type: "wish_match",
        actionUrl: `/view/wish?wid=${wish.id}`,
      }),
    ),
  );
}

export async function notifySellerOfMatchingWishes(
  offerId: string,
  sellerId: string,
) {
  const supabase = await createClient();

  // Fetch the offer details
  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id, category_id, offer_type, tags")
    .eq("id", offerId)
    .single();

  if (offerError || !offer) {
    console.error("Failed to fetch offer for matching:", offerError);
    return;
  }

  // Find open, non-expired wishes in the same category + type, excluding the seller
  const { data: wishes, error: wishesError } = await supabase
    .from("wishes")
    .select("id, tags, title, buyer_id")
    .eq("category_id", offer.category_id)
    .eq("type", offer.offer_type)
    .eq("status", "open")
    .gt("expires_at", new Date().toISOString())
    .neq("buyer_id", sellerId)
    .limit(10);

  if (wishesError || !wishes || wishes.length === 0) return;

  // Rank by tag overlap and take top 5
  const offerTags = new Set((offer.tags || []).map((t: string) => t.toLowerCase()));
  const ranked = wishes
    .map((w) => {
      const wishTags = (w.tags || []).map((t: string) => t.toLowerCase());
      const overlap = wishTags.filter((t: string) => offerTags.has(t)).length;
      return { ...w, tagOverlap: overlap };
    })
    .sort((a, b) => b.tagOverlap - a.tagOverlap)
    .slice(0, 5);

  if (ranked.length === 1) {
    await createNotification({
      userId: sellerId,
      title: "A buyer needs this!",
      body: `"${ranked[0].title}" — check out this wish`,
      type: "offer_match",
      actionUrl: `/view/wish?wid=${ranked[0].id}`,
    });
  } else {
    await createNotification({
      userId: sellerId,
      title: `${ranked.length} buyers are looking for this!`,
      body: "Check the wanted board for matching wishes",
      type: "offer_match",
      actionUrl: "/wanted",
    });
  }
}

export async function sendNotificationToAdmins(
  payload: Omit<CreateNotificationParams, "userId">,
) {
  const supabase = await createClient();

  const { data: admins, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (error || !admins || admins.length === 0) return;

  await Promise.allSettled(
    admins.map((admin) =>
      createNotification({ userId: admin.id, ...payload }),
    ),
  );
}

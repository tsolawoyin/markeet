import { SupabaseClient } from "@supabase/supabase-js";
import { debug } from "./debug";

export async function fetchUserOffers(
  supabase: SupabaseClient,
  userId: string,
  options?: {
    status?: "active" | "paused" | "deleted";
    type?: "product" | "service";
    limit?: number;
    offset?: number;
  },
) {
  try {
    const { data, error } = await supabase.rpc("get_user_offers", {
      user_id: userId,
      filter_status: options?.status || null,
      filter_type: options?.type || null,
      page_limit: options?.limit || 20,
      page_offset: options?.offset || 0,
    });

    if (error) {
      debug.error("Error fetching user offers:", error);
      return null;
    }

    return data;
    //  {
    //   offers: data,
    //   total_count: data[0]?.total_count || 0,
    //   has_more: data[0]?.has_more || false,
    // };
  } catch (error) {
    console.error("Error fetching user offers:", error);
    return null;
  }
}

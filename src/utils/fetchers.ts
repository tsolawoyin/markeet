import { SupabaseClient } from "@supabase/supabase-js";
import { debug } from "./debug";
import { type Listing } from "@/components/listing-card";

export const fetchAllListings = async (
  supabase: SupabaseClient,
  limit: number,
  offset: number,
) => {
  const { data, error } = await supabase.rpc("get_all_products", {
    page_limit: limit,
    page_offset: offset,
  });

  if (error) {
    debug.log(error);
    return [];
  }

  return data as Listing[];
};

export const fetchHallListings = async (
  supabase: SupabaseClient,
  limit: number,
  offset: number,
) => {
  const { data: offers, error } = await supabase.rpc("get_hall_offers", {
    page_limit: limit,
    page_offset: offset,
  });

  if (error) return [];

  return offers as Listing[];
};

export const fetchCourseListings = async (
  supabase: SupabaseClient,
  limit: number,
  offset: number,
) => {
  const { data: offers, error } = await supabase.rpc("get_course_offers", {
    page_limit: limit,
    page_offset: offset,
  });

  if (error) {
    debug.log(error);
    return [];
  }

  return offers as Listing[];
};

export const fetchOffer = async (supabase: SupabaseClient, id: string) => {
  const { data } = await supabase.rpc("get_offer_details", {
    offer_id: id,
  });

  return data?.[0] as Listing | null;
};

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
    debug.error("Error fetching user offers:", error);
    return null;
  }
}

// We can fetch some other listings later...
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

export const fetchSearchResults = async (
  supabase: SupabaseClient,
  params: {
    search_text?: string;
    filter_category_id?: string;
    filter_offer_type?: string;
    filter_condition?: string;
    filter_hall?: string;
    filter_price_min?: number;
    filter_price_max?: number;
    sort_by?: string;
    page_limit?: number;
    page_offset?: number;
  },
) => {
  const { data, error } = await supabase.rpc("search_offers", {
    search_text: params.search_text || "",
    filter_category_id: params.filter_category_id || null,
    filter_offer_type: params.filter_offer_type || null,
    filter_condition: params.filter_condition || null,
    filter_hall: params.filter_hall || null,
    filter_price_min: params.filter_price_min ?? null,
    filter_price_max: params.filter_price_max ?? null,
    sort_by: params.sort_by || "newest",
    page_limit: params.page_limit || 20,
    page_offset: params.page_offset || 0,
  });

  if (error) {
    console.log("hi");
    debug.error(error);
    console.log(error);
    return [];
  }
  return data;
};

// We can fetch some other listings later...
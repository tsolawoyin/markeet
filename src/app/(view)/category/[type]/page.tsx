// This attempts to get first 20 and be fetching the rest later...
import {
  fetchAllListings,
  fetchHallListings,
  fetchCourseListings,
} from "@/utils/fetchers";
import { createClient } from "@/lib/supabase/server";
import SeeAllPage from "./view-all-page";

// the functions need supabase instance. ok sha...

const fetchMap: Record<string, Function> = {
  all: fetchAllListings,
  hall: fetchHallListings,
  course: fetchCourseListings,
};

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const type = (await params)["type"];
  const supaabase = await createClient();

  const { data, error } = await supaabase.auth.getUser();

  if (error) {
    console.log(error);
    // return empty array
    return <SeeAllPage initialItems={[]} type={type} />;
  }

  const fetcher = fetchMap[type];
  const items = await fetcher(supaabase, 20, 0); // sharp...

  if (!items || items.length == 0) {
    return <SeeAllPage initialItems={[]} type={type} />;
  }

  return <SeeAllPage initialItems={items} type={type} />;
}

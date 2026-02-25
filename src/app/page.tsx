import { createClient } from "@/lib/supabase/server";
import { HomeFeed } from "./(home)/home-feed";
import { LandingPage } from "./(home)/landing-page";
import { fetchAllListings } from "@/utils/fetchers";

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return <HomeFeed />;
  }

  const [listings, studentsCount] = await Promise.all([
    fetchAllListings(supabase, 6, 0),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  return (
    <LandingPage listings={listings} students={studentsCount.count ?? 0} />
  );
}

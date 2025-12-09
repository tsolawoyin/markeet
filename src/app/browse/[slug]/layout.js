import ListingDetailClient from "./page";

export const metadata = {
    title: "View item"
}


export default async function ListingDetailPage({ params }) {
  const { slug } = await params;

  return <ListingDetailClient listingId={slug} />;
}

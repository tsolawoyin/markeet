import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { fetchOffer } from "@/utils/fetchers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type"); // "wish" or default to listing

  if (!id) {
    return new ImageResponse(<FallbackCard />, { width: 1200, height: 630 });
  }

  const supabase = await createClient();

  // Default: listing/offer
  const offer = await fetchOffer(supabase, id);

  if (!offer) {
    return new ImageResponse(<FallbackCard />, { width: 1200, height: 630 });
  }

  const coverImage = offer.images?.[0] || null;
  const ratingStars =
    offer.seller.rating > 0
      ? `${"★".repeat(Math.round(offer.seller.rating))}${"☆".repeat(5 - Math.round(offer.seller.rating))}`
      : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#1c1917",
        fontFamily: "sans-serif",
      }}
    >
      {/* Left: Cover image */}
      <div
        style={{
          width: "480px",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            width={480}
            height={630}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #f97316, #ea580c, #c2410c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "80px",
              fontWeight: 800,
            }}
          >
            M
          </div>
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "120px",
            height: "100%",
            background: "linear-gradient(to right, transparent, #1c1917)",
            display: "flex",
          }}
        />
      </div>

      {/* Right: Details */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "48px 48px 48px 24px",
          justifyContent: "space-between",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            width: "60px",
            height: "4px",
            backgroundColor: "#f97316",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* Title & Price */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "44px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              display: "flex",
              maxWidth: "640px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {offer.title.length > 55
              ? offer.title.slice(0, 52) + "..."
              : offer.title}
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#f97316",
              display: "flex",
            }}
          >
            ₦{offer.price.toLocaleString()}
          </div>
        </div>

        {/* Seller info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src={offer.seller.avatar}
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#e7e5e4",
                  fontSize: "20px",
                  fontWeight: 600,
                  display: "flex",
                }}
              >
                {offer.seller.name}
              </span>
              {ratingStars && (
                <span
                  style={{
                    color: "#fbbf24",
                    fontSize: "18px",
                    display: "flex",
                  }}
                >
                  {ratingStars}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              M
            </div>
            <span
              style={{
                color: "#a8a29e",
                fontSize: "22px",
                fontWeight: 600,
                display: "flex",
              }}
            >
              Markeet
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}

function FallbackCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1c1917, #292524)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "16px",
          backgroundColor: "#f97316",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "48px",
          fontWeight: 800,
          marginBottom: "24px",
        }}
      >
        M
      </div>
      <div
        style={{
          fontSize: "52px",
          fontWeight: 800,
          color: "#ffffff",
          display: "flex",
          marginBottom: "12px",
        }}
      >
        Markeet
      </div>
      <div
        style={{
          fontSize: "24px",
          color: "#a8a29e",
          display: "flex",
        }}
      >
        Campus Marketplace for UI Students
      </div>
    </div>
  );
}

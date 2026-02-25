import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-store";
import { createClient } from "@/lib/supabase/server";
import AppProvider from "@/providers/app-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://markeet.ng",
  ),
  title: "Markeet",
  description:
    "A trusted, campus-focused marketplace where verified UI students can easily list, discover, and transact items",
  manifest: "/manifest.json",
  keywords: ["marketplace", "UI students", "buy and sell", "campus trading"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Markeet",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/192.png",
    apple: "/icons/180.png",
    other: [
      {
        rel: "icon",
        url: "/icons/32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/icons/192.png",
        sizes: "192x192",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Markeet",
    title: "Markeet — Campus Marketplace",
    description:
      "A trusted, campus-focused marketplace where verified UI students can easily list, discover, and transact items",
    images: [{ url: "/icons/192.png", width: 192, height: 192 }],
  },
  twitter: {
    card: "summary",
    title: "Markeet — Campus Marketplace",
    description:
      "A trusted, campus-focused marketplace where verified UI students can easily list, discover, and transact items",
  },
};

const karla = Karla({
  weight: ["200", "300", "400", "500", "700"],
  subsets: ["latin"],
});

const Dynamic = async ({ children }: any) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data?.claims?.sub)
    .single();

  const { data: about, error: aboutError } = await supabase
    .from("about")
    .select("*")
    .eq("user_id", data?.claims.sub)
    .single();

  let user;

  if (!data?.claims || !profile) {
    user = null;
  } else {
    user = {
      id: data.claims.sub, // this makes it work.
      about: about,
      profile: profile,
      user: data.claims,
    };
  }

  return <AppProvider supabase_user={user}>{children}</AppProvider>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${karla.className} antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <Suspense>
            <Dynamic>{children}</Dynamic>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

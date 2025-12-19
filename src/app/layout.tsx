import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

// Context
import Shell from "@/shell/shell";
import { ThemeProvider } from "@/components/theme-store";
import PWAInstall from "@/components/pwa-install";
import ServiceWorkerCleanup from "@/components/sw-cleanup";

export const metadata: Metadata = {
  title: "Markeet - UI Student Marketplace",
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
};

// const open_sans = Open_Sans({
//   weight: ["300", "400", "500", "600", "700", "800"],
//   subsets: ["latin"],
// });

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"]
})

const Dynamic = async ({ children }: any) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  // if (error) {
  //   console.log(error);
  //   return <p>We have problems verifying you. Please refresh.</p>
  // }
  // I don tire for all these rules and regulations.
  return (
    <Shell supabase_user={data}>
      {children}
    </Shell>
  )
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Markeet" />
      </head>
      <body className={`${ubuntu.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<p>Verifying your auth status, please wait...</p>}>
            <Dynamic>{children}</Dynamic>
          </Suspense>
          <PWAInstall />
          <ServiceWorkerCleanup />
        </ThemeProvider>
      </body>
    </html>
  );
}

// doing some clean up and rewriting the code for maximum efficiency...
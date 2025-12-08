import type { Metadata } from "next";
import { Open_Sans, Inter } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

// Context
import Shell from "@/shell/shell";
import { ThemeProvider } from "@/components/theme-store";

import Header from "@/components/header/header";

export const metadata: Metadata = {
  title: "Markeet",
  description:
    "A trusted, campus-focused marketplace where verified students can easily list, discover, and transact items",
};

const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", '700', "800", "900"],
  subsets: ["latin"]
})

const Dynamic = async ({ children }: any) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<p>Loading...</p>}>
            <Dynamic>{children}</Dynamic>
          </Suspense>

        </ThemeProvider>
      </body>
    </html>
  );
}

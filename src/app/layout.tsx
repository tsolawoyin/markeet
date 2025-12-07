import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log(data);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${open_sans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Shell supabase_user={data}>
            <div className="w-full h-screen">
              <Header />
              {children}
            </div>
          </Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}

// enough of all the conventions.
// I should name my app's files as I see fit.

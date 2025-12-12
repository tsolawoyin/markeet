import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

// Context
import Shell from "@/shell/shell";
import { ThemeProvider } from "@/components/theme-store";

export const metadata: Metadata = {
  title: "Markeet",
  description:
    "A trusted, campus-focused marketplace where verified students can easily list, discover, and transact items",
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
      <body className={`${ubuntu.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<p>Verifying your auth status, please wait...</p>}>
            <Dynamic>{children}</Dynamic>
          </Suspense>

        </ThemeProvider>
      </body>
    </html>
  );
}

// doing some clean up and rewriting the code for maximum efficiency...
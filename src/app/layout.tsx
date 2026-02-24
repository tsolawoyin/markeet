import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-store";
import { createClient } from "@/lib/supabase/server";
import AppProvider from "@/providers/app-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Markeet",
  description: "Markeet.ng",
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
          <Suspense>
            <Dynamic>{children}</Dynamic>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

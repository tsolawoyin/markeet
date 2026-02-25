"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  RequiredClaims,
  SupabaseClient,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import PushNotification from "./push-notification-context";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { debug } from "@/utils/debug";

export interface About {
  id?: string;
  user_id?: string;
  bio?: string;
  headline?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  hall_of_residence: string;
  followers_count: number;
  following_count: number;
  course: string;
  institution: string;
  avatar_url: string;
  bio: string;
  is_active: boolean;
  created_at: string | number | Date;
  updated_at: string;
}

export interface User {
  id: string;
  about?: About;
  profile: Profile;
  user: RequiredClaims | SupabaseUser;
}

interface App {
  supabase: SupabaseClient;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AppContext = createContext<App | null>(null);

const pathToDisableFooter = [
  "/profile/edit",
  "/settings",
  "/create/wish",
  "/create/offer",
  "/create/order",
  "/create/payment",
  "/listing",
  "/view/wish",
  "/view/wallet",
  "/admin/orders",
  "/admin/orders/details",
  "/admin/wallet",
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth",
  "/view/orders",
  "/view/orders/details",
  "/about",
  // '/view'
];

export default function AppProvider({
  children,
  supabase_user,
}: {
  children: React.ReactNode;
  supabase_user: User | null; // it's either we have a User or not.
}) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();
  const [user, setUser] = useState(supabase_user);
  const [disableFooter, setDisableFooter] = useState(
    pathToDisableFooter.some((path) => pathname.includes(path)),
  );

  // Auth functions
  function authStateChange() {
    return supabase.auth.onAuthStateChange((event) => {
      // Update context/state when auth changes
      if (event === "INITIAL_SESSION") {
        console.log("Welcome home User");
      } else if (event === "SIGNED_IN") {
        console.log("User Signed in");
        // console.log(user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/login"); // for now
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });
  }

  useEffect(() => {
    const authState = authStateChange();

    return () => {
      authState.data.subscription.unsubscribe();
    };
  }, []);

  // update footer visibility
  useEffect(() => {
    setDisableFooter(
      pathToDisableFooter.some((path) => pathname.includes(path)),
    );
  }, [pathname]);

  const app = {
    supabase,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={app}>
      <PushNotification>
        <div className="w-full h-screen">
          <div
            className={`flex-1 ${
              user && !disableFooter && "pb-20"
            } md:pb-0 dark:bg-stone-950`}
          >
            {children}
          </div>
          {user && !disableFooter && <Footer />}
          {/* Let's talk about Footer later jare... */}
        </div>
        <Toaster />
      </PushNotification>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("AppContext must be used within AppProvider");
  }

  return ctx;
}

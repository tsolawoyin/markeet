"use client";

// React
import { createContext, useState, useEffect } from "react";

// Next
import { usePathname, useRouter } from "next/navigation";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Dexie
import { db } from "./shell-local-db";

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export const ShellContext = createContext();

export default function Shell({ children, supabase_user }) {
  // Initialize supabase client for some useful things
  const supabase = createClient();
  // IndexedDB Storage
  const dexie = db;
  // Database functions
  //   const supabase_tables_fn = supabase_db_utility_fn(supabase);
  // Utility functions
  // Set user to user from server
  const [user, setUser] = useState(supabase_user.user);

  // NEXT.js Hooks
  const currentPath = usePathname();
  const router = useRouter();

  // Auth functions
  function authStateChange() {
    return supabase.auth.onAuthStateChange((event) => {
      // Update context/state when auth changes
      if (event === "INITIAL_SESSION") {
        console.log("Welcome home User");
      } else if (event === "SIGNED_IN") {
        console.log("User Signed in");
        console.log(user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/login");
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
    console.log(user);
  }, []);

  useEffect(() => {
    const authState = authStateChange();

    return () => {
      authState.data.subscription.unsubscribe();
    };
  }, []); // nice and easy. thanks.

  return (
    <ShellContext.Provider
      value={{ user, setUser, supabase, currentPath, dexie }}
    >
      <div className="w-full h-screen">
        {/* {user && <Header />} */}
        <div className="pb-10">{children}</div>
        {user && <Footer />}
      </div>
    </ShellContext.Provider>
  );
}

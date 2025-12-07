"use client";

// React
import { createContext, useState, useEffect } from "react";

// Next
import { usePathname, useRouter } from "next/navigation";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Dexie
import { db } from "./shell-local-db";

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
  const auth = {
    login: async function (credentials) {
      // credentials is an object
      let { data, error } = await supabase.auth.signInWithPassword(credentials);

      // simple as abc
      setUser(data.user);

      if (error) {
        throw new Error(error);
      }

      router.push("/");
    },

    signOut: async function () {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    },

    // So for now this is not that useful
    authStateChange: function () {
      return supabase.auth.onAuthStateChange((event) => {
        // Update context/state when auth changes
        if (event === "INITIAL_SESSION") {
          console.log("Welcome home User");
        } else if (event === "SIGNED_IN") {
          console.log("User Signed in");
          console.log(user);
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
          // console.log("User signed out");
          setUser(null);
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
        }
      });
    },
  };

  useEffect(( ) => {
    console.log(user);
  }, []);;

  return (
    <ShellContext.Provider
      value={{ user, setUser, supabase, currentPath, dexie, auth }}
    >
      {children}
    </ShellContext.Provider>
  );
}

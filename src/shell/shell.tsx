"use client";

// React
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

// Next
import { usePathname, useRouter } from "next/navigation";

// Supabase
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User } from "@supabase/supabase-js";

// Dexie
import { db } from "./shell-local-db";

// Types
interface ShellContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  supabase: SupabaseClient;
  currentPath: string;
  dexie: typeof db;
}

interface ShellProps {
  children: ReactNode;
  supabase_user: {
    user: User | null;
  };
}

// Component
import Footer from "@/components/footer/footer";

export const ShellContext = createContext<ShellContextType | null>(null);

export default function Shell({ children, supabase_user }: ShellProps) {
  // Initialize supabase client for some useful things
  const supabase = createClient();

  // IndexedDB Storage
  const dexie = db;

  // Set user to user from server
  const [user, setUser] = useState<User | null>(supabase_user.user);

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

  // I will adapt header and footer to different conditions as needed...
  return (
    <ShellContext.Provider
      value={{ user, setUser, supabase, currentPath, dexie }}
    >
      <div className="w-full min-h-screen dark:bg-slate-950">{children}</div>
      <Footer />
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);

  if (!context) {
    throw new Error("useShell must be used within Shell component");
  }

  return context;
}

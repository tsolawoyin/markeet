"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  RequiredClaims,
  SupabaseClient,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { debug } from "@/utils/debug";

export interface About {
  id: string;
  user_id: string;
  bio?: string;
  headline?: string;
  skills?: string[];
  created_at: string;
  updated_at: string;
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

export default function AppProvider({
  children,
  supabase_user,
}: {
  children: React.ReactNode;
  supabase_user: User | null; // it's either we have a User or not.
}) {
  const supabase = createClient();
  const [user, setUser] = useState(supabase_user);

  const app = {
    supabase,
    user,
    setUser,
  };

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("AppContext must be used within AppProvider");
  }

  return ctx;
}

"use client";

import { createContext, useState, useEffect } from "react";

// Next
import { usePathname, useRouter } from "next/navigation";

export const ShellContext = createContext();

export default function Shell({ children, supabase_user }) {
  const [user, setUser] = useState(supabase_user);

  //   auth and everything will be here sha

  return (
    <ShellContext.Provider value={{ user }}>{children}</ShellContext.Provider>
  );
}

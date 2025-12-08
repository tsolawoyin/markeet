"use client";

import { ModeToggle } from "./theme-toggle";

import { useContext } from "react";

import { ShellContext } from "@/shell/shell";

import { Button } from "../ui/button";

export default function Header() {
    const { supabase, setUser } = useContext(ShellContext);

    // nice and easy...
    async function signOut () {
      await supabase.auth.signOut();
    }

    return (
        <div className="px-4 mt-3 flex items-center justify-between">
            {/* <Logo /> */}
            <p></p>
            <div className="flex items-center gap-5">
                <Button onClick={() => signOut()}>S/O</Button>
                <ModeToggle />
            </div>
        </div>
    )
}
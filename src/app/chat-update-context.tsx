// context/chat-updates-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ShellContext } from "@/shell/shell";

// This defines what data our context will provide
interface ChatUpdatesContextType {
  latestMessage: any | null; // We'll type this properly later
}

// Create the context
const ChatUpdatesContext = createContext<ChatUpdatesContextType | undefined>(
  undefined
);

// This is our "radio tower" - the provider component
export default function ChatUpdatesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = useContext(ShellContext);
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [latestMessage, setLatestMessage] = useState<any | null>(null);
  const userId = user.id;
  // This is where we'll set up the subscription
  // (We'll implement this in the next step)
  // Step 1: Get user's room IDs
  useEffect(() => {
    const fetchRoomIds = async () => {
      const { data } = await supabase
        .from("room_participants")
        .select("room_id")
        .eq("user_id", userId); // sharp

      if (data) {
        const ids = data.map((p) => p.room_id);
        setRoomIds(ids);
        console.log("User is in these rooms:", ids);
      }
    };

    if (userId) {
      fetchRoomIds();
    }
  }, [userId]);

  // Step 2: Subscribe to messages in those rooms
  useEffect(() => {
    if (roomIds.length === 0) return;

    console.log("Setting up subscription for rooms:", roomIds);

    const channel = supabase
      .channel("user-messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=in.(${roomIds.join(",")})`, // ✅ Database-level filter
        },
        (payload) => {
          const newMessage = payload.new;
          console.log("New message received:", newMessage);
          setLatestMessage(newMessage); // No need to check roomIds anymore
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      channel.unsubscribe();
    };
  }, [roomIds]);

  return (
    <ChatUpdatesContext.Provider value={{ latestMessage }}>
      {children}
    </ChatUpdatesContext.Provider>
  );
}

// This is our "radio receiver" - hook that components use to listen
export function useChatUpdates() {
  const context = useContext(ChatUpdatesContext);
  if (context === undefined) {
    throw new Error("useChatUpdates must be used within ChatUpdatesProvider");
  }
  return context;
}

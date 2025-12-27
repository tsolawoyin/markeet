import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ChatMessage } from "./use-realtime-chat";

interface UseMessagesQueryOptions {
  roomName: string;
  limit?: number;
  enabled?: boolean;
}

export function useMessagesQuery(options?: UseMessagesQueryOptions) {
  const { roomName, limit = 50, enabled = true } = options || {};
  const [data, setData] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !roomName) {
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // First, get or create the room
        const { data: room, error: roomError } = await supabase
          .from("rooms")
          .select("id")
          .eq("name", roomName)
          .single();

        if (roomError) {
          throw roomError;
        }

        if (!room) {
          // Room doesn't exist yet, return empty array
          setData([]);
          setIsLoading(false);
          return;
        }

        // Fetch messages for this room
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("id, content, username, created_at, updated_at")
          .eq("room_id", room.id)
          .order("created_at", { ascending: true })
          .limit(limit);

        if (messagesError) {
          throw messagesError;
        }

        // Transform to ChatMessage format
        const chatMessages: ChatMessage[] = (messages || []).map((msg) => ({
          id: msg.id,
          content: msg.content,
          user: {
            name: msg.username,
          },
          createdAt: msg.created_at,
          updatedAt: msg.updated_at,
        }));

        setData(chatMessages);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomName, limit, enabled]);

  return { data, isLoading, error };
}

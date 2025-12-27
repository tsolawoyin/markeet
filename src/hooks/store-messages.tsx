import { createClient } from "@/utils/supabase/client";
import type { ChatMessage } from "@/hooks/use-realtime-chat";

interface StoreMessagesOptions {
  roomName: string;
  userId: string;
}

export async function storeMessages(
  messages: ChatMessage[],
  options: StoreMessagesOptions
) {
  const { roomName, userId } = options;
  const supabase = createClient();

  try {
    // Get or create the room
    let { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id")
      .eq("name", roomName)
      .single();

    if (roomError && roomError.code === "PGRST116") {
      // Room doesn't exist, create it
      const { data: newRoom, error: createError } = await supabase
        .from("rooms")
        .insert({ name: roomName })
        .select("id")
        .single();

      if (createError) {
        throw createError;
      }

      room = newRoom;
    } else if (roomError) {
      throw roomError;
    }

    if (!room) {
      throw new Error("Failed to get or create room");
    }

    // Store messages
    const messagesToInsert = messages.map((msg) => ({
      id: msg.id,
      room_id: room.id,
      user_id: userId,
      username: msg.user.name,
      content: msg.content,
      created_at: msg.createdAt,
    }));

    const { error: insertError } = await supabase
      .from("messages")
      .upsert(messagesToInsert, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error storing messages:", error);
    return { success: false, error };
  }
}

// Alternative: Store a single message
export async function storeMessage(
  message: ChatMessage,
  options: StoreMessagesOptions
) {
  return storeMessages([message], options);
}

// lib/update-message.ts

export async function updateMessage(messageId: string, content: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .update({ content })
      .eq("id", messageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating message:", error);
    return { success: false, error };
  }
}

// lib/delete-message.ts
export async function deleteMessage(messageId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error };
  }
}

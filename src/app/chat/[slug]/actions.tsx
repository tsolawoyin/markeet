import { createClient } from "@/utils/supabase/client";
import type { ChatMessage } from "@/hooks/use-realtime-chat";

interface StoreMessagesOptions {
  roomName: string;
  userId: string;
  roomType?: "dm" | "group";
  otherParticipantIds?: string[]; // IDs of other participants (for DMs, pass the other user's ID)
}

export async function storeMessages(
  messages: ChatMessage[],
  options: StoreMessagesOptions
) {
  const {
    roomName,
    userId,
    roomType = "dm",
    otherParticipantIds = [],
  } = options;
  const supabase = createClient();

  try {
    // Get or create the room
    let { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("name", roomName)
      .single();

    if (roomError && roomError.code === "PGRST116") {
      // Room doesn't exist, create it
      const { data: newRoom, error: createError } = await supabase
        .from("rooms")
        .insert({
          name: roomName,
        //   type: roomType, // we don't need this
        })
        .select("*")
        .single();

      if (createError) {
        throw createError;
      }

      room = newRoom;

      // Add current user as participant
      const participants = [{ room_id: room.id, user_id: userId }];

      // Add other participants if provided
      if (otherParticipantIds.length > 0) {
        participants.push(
          ...otherParticipantIds.map((id) => ({
            room_id: room.id,
            user_id: id,
          }))
        );
      }

      const { error: participantsError } = await supabase
        .from("room_participants")
        .insert(participants);

      if (participantsError) {
        // If participants already exist, ignore the error
        if (participantsError.code !== "23505") {
          // 23505 is unique violation
          throw participantsError;
        }
      }
    } else if (roomError) {
      throw roomError;
    }

    if (!room) {
      throw new Error("Failed to get or create room");
    }

    // Ensure current user is a participant (in case room existed but user wasn't added)
    const { error: ensureParticipantError } = await supabase
      .from("room_participants")
      .upsert(
        { room_id: room.id, user_id: userId },
        { onConflict: "room_id,user_id", ignoreDuplicates: true }
      );

    if (ensureParticipantError && ensureParticipantError.code !== "23505") {
      console.warn("Error ensuring participant:", ensureParticipantError);
    }

    // Store messages
    const messagesToInsert = messages.map((msg) => ({
      id: msg.id,
      room_id: room.id,
      user_id: userId,
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

    return { success: true, roomId: room.id };
  } catch (error) {
    console.error("Error storing messages:", error);
    return { success: false, error };
  }
}

export async function storeMessage(
  message: ChatMessage,
  options: StoreMessagesOptions
) {
  return storeMessages([message], options);
}

export const fetchMessage = async (roomName: string) => {
  const supabase = createClient();
  // First, fetch the room by name
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("name", roomName) // Use "name" not "roomName" based on your schema
    .single(); // Get single room instead of array

  if (roomError) {
    console.error("Error fetching room:", roomError);
    return;
  }

  if (!room) {
    console.log("Room not found");
    return;
  }

  // Then fetch messages for that room
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(
      `
    *,
    profile:profiles!user_id(id, avatar_url, full_name)
  `
    )
    .eq("room_id", room.id)
    .order("created_at", { ascending: true }); // Oldest first

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return;
  }

  // Now do something with the messages
  //   console.log("Fetched messages:", messages);
  // You might want to set them to state here
  // setMessages(messages);

  return messages.map((m) => ({
    // a new version
    ...m,
    user: {
      name: m.profile.full_name,
    },
    createdAt: m.created_at,
  }));
};

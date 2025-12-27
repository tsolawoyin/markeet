export interface ChatListItem {
  roomId: string;
  roomName: string;
  //   roomType: "dm" | "group";
  lastReadAt: Date;
  updatedAt: Date;
  otherParticipant?: {
    id: string;
    username?: string;
    fullName: string;
    avatarUrl: string;
  };
  participants?: Array<{
    id: string;
    // username: string;
    fullName: string;
    avatarUrl: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    isOwnMessage: boolean;
  };
  unreadCount: number;
}

interface Participation {
  id: string;
  last_read_at: Date;
  user_id: string;
  room: {
    id: string;
    name: string;
    updated_at: Date;
  };
}

export async function getUserChats(supabase: any, userId: string) {
  try {
    // Get all rooms where user is a participant
    const { data: participations, error: participationsError } = await supabase
      .from("room_participants")
      .select(
        `
          id, last_read_at, user_id,
          room:rooms!inner(id, name, updated_at)
        `
      )
      .eq("user_id", userId);

    // console.log(participations);

    if (participationsError) {
      console.error("Error fetching participations:", participationsError);
      throw participationsError;
    }

    if (!participations || participations.length === 0) {
      return [];
    }

    const sortedParticipations = participations?.sort(
      (a: Participation, b: Participation) =>
        new Date(b.room.updated_at).getTime() -
        new Date(a.room.updated_at).getTime()
    );

    // console.log(sortedParticipations, "hello");
    // participation itself needs to be typed...
    const chatListPromises = sortedParticipations.map(
      async (participation: Participation) => {
        // console.log(participation);
        // const roomId = participation.room.id; // sharp
        const room = participation.room;

        // Get all participants in this room
        const { data: allParticipants, error: participantError } =
          await supabase
            .from("room_participants")
            .select(
              `
                user_id,
                profile:profiles(id, full_name, avatar_url)
            `
            )
            .eq("room_id", room.id);

        // console.log(allParticipants);
        if (participantError) {
          console.error("Error fetching participants:", participantError);
        }

        // console.log(allParticipants);

        // Get last message in room
        const { data: lastMessage, error: lastMessageError } = await supabase
          .from("messages")
          .select("id, content, created_at, user_id")
          .eq("room_id", room.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (lastMessageError && lastMessageError.code !== "PGRST116") {
          console.error("Error fetching last message:", lastMessageError);
        }

        // const { count: unreadCount } = await supabase
        //   .from("message")
        //   .select("*", { count: "exact", head: true })
        //   .eq("room_id", room.id)
        //   .neq("user_id", userId) // Don't count own messages
        //   .gt("created_at", participation.last_read_at);

        // Format participants
        // Format participants - handle the profile object correctly
        const participants =
          allParticipants?.map((p: any) => ({
            id: p.profile.id || p.user_id,
            // username: p.profile?.username,
            fullName: p.profile?.full_name,
            avatarUrl: p.profile?.avatar_url,
          })) || [];

        const otherParticipant =
          room.name.startsWith("dm") &&
          participants.find((p: any) => p.id !== userId);

        // Calculate unread count
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("room_id", room.id)
          .neq("user_id", userId) // Don't count own messages
          .gt("created_at", participation.last_read_at);

        // console.log(otherParticipant);
        const chatListItem: ChatListItem = {
          roomId: room.id,
          roomName: room.name,
          lastReadAt: participation.last_read_at,
          updatedAt: room.updated_at,
          otherParticipant,
          // participants: room.type === "group" ? participants : undefined,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                createdAt: lastMessage.created_at,
                userId: lastMessage.user_id,
                isOwnMessage: lastMessage.user_id === userId,
              }
            : undefined,
          unreadCount: unreadCount || 0, // to be fixed later
        };

        console.log(chatListItem);

        return chatListItem;
      }
    );

    const chatList = await Promise.all(chatListPromises);

    // Sort by most recent activity (rooms with latest messages first)
    return chatList.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.updatedAt;
      const bTime = b.lastMessage?.createdAt || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  } catch (error) {
    console.error("Error getting user chats:", error);
    return [];
  }
}

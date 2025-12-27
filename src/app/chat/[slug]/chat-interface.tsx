"use client";

import { RealtimeChat } from "@/components/realtime-chat";
import { ChatMessage } from "@/hooks/use-realtime-chat";

import { useContext, useEffect, useState } from "react";

import { ShellContext } from "@/shell/shell";

// actions
// we will only store single options...
import { storeMessage, fetchMessage } from "./actions";

// Sharp things...
// Makes sense. Thank you.
export default function ChatInterface({ roomName }: { roomName: string }) {
  const { supabase, user } = useContext(ShellContext);
  const fullName: string = user?.user_metadata?.full_name || "Anonymous";
  const secondUser = roomName
    .split("_")
    .filter((element) => element != user.id && element != "dm");
  console.log(secondUser);
  // Maybe I need to get the name of the second user...
  // Or what do you think???
  // const messages: ChatMessage[] = []; //
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const handleMessage = (messages: ChatMessage[]) => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.user.name == fullName) {
      storeMessage(lastMessage, {
        roomName: roomName,
        userId: user.id, // done....
        roomType: roomName.startsWith("dm") ? "dm" : "group",
        otherParticipantIds: secondUser, // done...
      });
    }
  };

  useEffect(() => {
    fetchMessage(roomName)
      .then((response) => {
        // console.log(response);
        if (response) {
          setMessages(response);
          // response.forEach((r => {
          //   console.log(r.createdAt)
          // }))
        }
      })
      .catch((error) => {
        console.log(error, "hi")
      });
  }, []);

  return (
    <div className="h-full">
      <RealtimeChat
        roomName={roomName}
        username={fullName}
        messages={messages}
        onMessage={handleMessage}
      />
    </div>
  );
}

// sharp. done and dusted.

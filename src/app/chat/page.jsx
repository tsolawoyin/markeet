"use client";

import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { ShellContext } from "@/shell/shell";
import { useChatUpdates } from "../../app/chat-update-context";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getUserChats, geUserChats } from "./action";

import { cn } from "@/lib/utils";

import Link from "next/link";

export default function ChatPage({}) {
  // nice one
  const { supabase, user } = useContext(ShellContext);
  const [chatListItems, setChatListItems] = useState([]);
  const { latestMessage } = useChatUpdates(); // ✅ Listen to the "radio"

  const userId = user.id;

  // This allows for some offline loading...
  // We can use indexedDB to cache chats for offline purposes.
  // Hmmm... That's cool...
  useEffect(() => {
    getUserChats(supabase, user.id)
      .then((response) => {
        // console.log(response);
        setChatListItems(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // React to new messages
  useEffect(() => {
    if (!latestMessage) return;

    const isFromOtherUser = latestMessage.user_id != userId;

    // Update the specific chat with the new message
    setChatListItems((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        // Is this message for this chat?
        if (chat.roomId === latestMessage.room_id) {
          return {
            ...chat,
            lastMessage: {
              id: latestMessage.id,
              content: latestMessage.content,
              createdAt: latestMessage.created_at,
              userId: latestMessage.user_id,
              isOwnMessage: latestMessage.user_id === userId,
            },
            updatedAt: new Date(latestMessage.created_at),
            unreadCount: isFromOtherUser
              ? (chat.unreadCount || 0) + 1
              : chat.unreadCount,
          };
        }
        return chat;
      });

      // Sort: most recent chats first
      return updatedChats.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
  }, [latestMessage]);

  return (
    <div className="p-1">
      <Link href={"/chat/find"}>
        <Button variant={"outline"}>New Chat</Button>
      </Link>
      {/* Only the UI is remaining. Smiles... */}
      {chatListItems?.map((chatListItem) => {
        const {
          roomId,
          roomName,
          otherParticipant,
          lastReadAt,
          lastMessage,
          updatedAt,
          unreadCount,
        } = chatListItem;
        // Format timestamp
        const formatTime = (timestamp) => {
          const date = new Date(timestamp);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 1) return "now";
          if (diffMins < 60) return `${diffMins}m`;
          if (diffHours < 24) return `${diffHours}h`;
          if (diffDays === 1) return "yesterday";
          if (diffDays < 7) return `${diffDays}d`;
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        };

        // Check if message is unread

        return (
          <li key={roomId} className="border-b last:border-b-0">
            <Link
              href={`/chat/${roomName}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <Item variant={""} className="px-4 py-3">
                <ItemMedia>
                  <Avatar className="size-12">
                    <AvatarImage
                      src={
                        otherParticipant?.avatarUrl ||
                        "https://github.com/shadcn.png"
                      }
                      alt={otherParticipant?.fullName}
                    />
                    <AvatarFallback>
                      {otherParticipant?.fullName?.slice(0, 2).toUpperCase() ||
                        "??"}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>

                <ItemContent className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <ItemTitle className={cn("font-semibold truncate")}>
                      {otherParticipant?.fullName || "Unknown User"}
                    </ItemTitle>
                    {lastMessage && (
                      <span className="text-xs ml-2 shrink-0">
                        {formatTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  <ItemDescription
                    className={cn("text-sm truncate flex items-center gap-1")}
                  >
                    {lastMessage ? (
                      <>
                        {lastMessage.isOwnMessage && (
                          <span className="">You:</span>
                        )}
                        <span className="truncate">{lastMessage.content}</span>
                      </>
                    ) : (
                      <span className="italic text-gray-400">
                        No messages yet
                      </span>
                    )}
                  </ItemDescription>
                </ItemContent>

                <ItemActions className="flex items-center">
                  {unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </div>
                  )}
                </ItemActions>
              </Item>
            </Link>
          </li>
        );
      })}
    </div>
  );
}

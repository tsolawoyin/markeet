"use client";
// this is where the list of chats would be displayed
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { ShellContext } from "@/shell/shell";

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

import Link from "next/link";

import { getUserChats, geUserChats } from "./action";

import { cn } from "@/lib/utils";

export default function ChatPage({}) {
  // nice one
  const { supabase, user } = useContext(ShellContext);
  const [chatListItems, setChatListItems] = useState([]);

  function getDMRoomName(userId1, userId2) {
    const sorted = [userId1, userId2].sort();
    return `dm_${sorted[0]}_${sorted[1]}`;
  }
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

  return (
    <div className="p-1">
      {/* Only the UI is remaining. Smiles... */}
      {chatListItems?.map((chatListItem) => {
        const {
          roomId,
          roomName,
          otherParticipant,
          lastReadAt,
          lastMessage,
          updatedAt,
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
        const isUnread =
          lastMessage && new Date(lastMessage.createdAt) > new Date(lastReadAt);

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
                  <div className="flex items-center justify-between mb-1">
                    <ItemTitle
                      className={cn(
                        "font-semibold truncate",
                        // isUnread ? "text-gray-900" : "text-gray-700"
                      )}
                    >
                      {otherParticipant?.fullName || "Unknown User"}
                    </ItemTitle>
                    {lastMessage && (
                      <span className="text-xs ml-2 shrink-0">
                        {formatTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  <ItemDescription
                    className={cn(
                      "text-sm truncate flex items-center gap-1",
                    //   isUnread ? "font-medium text-gray-900" : "text-gray-500"
                    )}
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
                  {isUnread && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
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

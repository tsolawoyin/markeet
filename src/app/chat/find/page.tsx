"use client";

import { use, useEffect, useState } from "react";
import { useShell } from "@/shell/shell";

import Link from "next/link"; // nice and easy...

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

export interface User {
  avatarUrl: string;
  bio: string;
  fullName: string;
  hallOfResidence: string;
  id: string;
  lastActiveAt: Date | string;
}

export default function Page() {
  const { supabase, user: ownUser } = useShell();
  const [users, setUsers] = useState<User[]>([]);
  // we make it a client
  function getDMRoomName(userId1: string, userId2: string) {
    const sorted = [userId1, userId2].sort();
    return `dm_${sorted[0]}_${sorted[1]}`;
  }

  useEffect(() => {
    const fetchUsers = async (limit: number) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(limit);

      if (error) console.log("hello");

      return data;
      // easily I can write some queries myself
    };

    fetchUsers(128).then((res) => {
      if (res) {
        const newRes = res?.map((r) => {
          return {
            avatarUrl: r.avatar_url,
            bio: r.bio,
            fullName: r.full_name,
            hallOfResidence: r.hall_of_residence,
            id: r.id,
            lastActiveAt: r.last_active_at,
          };
        });

        setUsers(newRes);
      }
    });
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <div className="p-1">
      {users?.map((user) => {
        const { id, fullName, avatarUrl, bio, hallOfResidence, lastActiveAt } =
          user;

        // Format last active time
        const formatTime = (timestamp) => {
          const date = new Date(timestamp);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 5) return "Active now";
          if (diffMins < 60) return `Active ${diffMins}m ago`;
          if (diffHours < 24) return `Active ${diffHours}h ago`;
          if (diffDays === 1) return "Active yesterday";
          if (diffDays < 7) return `Active ${diffDays}d ago`;
          return `Last seen ${date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`;
        };

        return (
          <li key={id} className="border-b last:border-b-0">
            <Link
              href={`/chat/${getDMRoomName(user.id, ownUser?.id)}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <Item variant={"default"} className="px-4 py-3">
                <ItemMedia>
                  <Avatar className="size-12">
                    <AvatarImage
                      src={avatarUrl || "https://github.com/shadcn.png"}
                      alt={fullName}
                    />
                    <AvatarFallback>
                      {fullName?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>

                <ItemContent className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <ItemTitle className="font-semibold truncate">
                      {fullName || "Unknown User"}
                    </ItemTitle>
                    {lastActiveAt && (
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {formatTime(lastActiveAt)}
                      </span>
                    )}
                  </div>

                  <ItemDescription className="text-sm truncate flex flex-col gap-0.5">
                    {bio && (
                      <span className="truncate text-gray-600">{bio}</span>
                    )}
                    {hallOfResidence && (
                      <span className="text-xs text-gray-500">
                        📍 {hallOfResidence}
                      </span>
                    )}
                  </ItemDescription>
                </ItemContent>

                <ItemActions className="flex items-center">
                  {/* Optional: Add action buttons like message, follow, etc */}
                </ItemActions>
              </Item>
            </Link>
          </li>
        );
      })}
    </div>
  );
}

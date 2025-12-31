import { useState, useEffect } from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Earth } from "lucide-react";

import { formatTime } from "@/lib/time-converter";

export interface User {
  fullName: string;
  avatarUrl: string | null;
  course: string | null;
}

export default function ProfileHeader({
  user,
  createdAt,
  privacy = null,
}: {
  user: User;
  createdAt?: string;
  privacy?: string | null;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item>
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage
              src={user.avatarUrl || "https://github.com/evilrabbit.png"}
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="flex justify-between w-full">
            <span>{user.fullName}</span>
            {createdAt && (
              <span className="text-muted-foreground flex gap-2 items-center">
                {privacy == "public" && <Earth size={15} />}
                <TimeAgo timestamp={createdAt} />
              </span>
            )}
          </ItemTitle>
          <ItemDescription>{user.course || ""}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}

function TimeAgo({ timestamp }: { timestamp: string }) {
  const [timeAgo, setTimeAgo] = useState(formatTime(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTime(timestamp));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-gray-500">{timeAgo}</span>;
}

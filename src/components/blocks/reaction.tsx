import { useEffect, useState, useRef, useCallback } from "react";
import { PostType } from "./post";

import { useShell } from "@/shell/shell";

import { Reply, Repeat, Star, Bookmark, Ellipsis } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Link from "next/link";
import { Separator } from "../ui/separator";

export default function Reaction({ post }: { post: PostType }) {
  // Refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<"like" | "unlike" | null>(null);
  const boostDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingBoostActionRef = useRef<"boost" | "unboost" | null>(null);
  const bookmarkDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingBookmarkActionRef = useRef<"bookmark" | "unbookmark" | null>(
    null
  );

  const { supabase, user } = useShell();
  const [boosts, setBoosts] = useState(post.boosts || 0);
  const [favorites, setFavorites] = useState(post.favorites);

  const [hasLiked, setHasLiked] = useState(post.hasLiked);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Add these with your other state/refs
  const [hasBoosted, setHasBoosted] = useState(post.hasBoosted);
  const [shouldAnimateBoost, setShouldAnimateBoost] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(post.hasBookmarked);
  const [shouldAnimateBookmark, setShouldAnimateBookmark] = useState(false);

  // Favorite Handler
  const handleFavorite = useCallback(async () => {
    // Cancel any pending debounced action
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Toggle the UI immediately for responsiveness
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    setShouldAnimate(true); // Enable animation on user interaction

    // Update count optimistically
    setFavorites((prev) => (newLikedState ? prev + 1 : Math.max(prev - 1, 0)));

    // Store the action we want to perform
    pendingActionRef.current = newLikedState ? "like" : "unlike";

    // Debounce the actual database operation
    debounceTimerRef.current = setTimeout(async () => {
      const action = pendingActionRef.current;

      if (action === "like") {
        const favData = {
          post_id: post.id,
          user_id: user?.id,
        };

        const { error } = await supabase.from("favorites").insert([favData]);

        if (error) {
          console.error("Error adding favorite:", error);
          // Revert UI state on error
          setHasLiked(false);
          setFavorites((prev) => Math.max(prev - 1, 0));
        }
      } else if (action === "unlike") {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error removing favorite:", error);
          // Revert UI state on error
          setHasLiked(true);
          setFavorites((prev) => prev + 1);
        }
      }

      // Clear the pending action
      pendingActionRef.current = null;
    }, 500); // 500ms debounce delay
  }, [hasLiked, post.id, user?.id]);

  const handleBoost = useCallback(async () => {
    // Cancel any pending debounced action
    if (boostDebounceTimerRef.current) {
      clearTimeout(boostDebounceTimerRef.current);
    }

    // Toggle the UI immediately for responsiveness
    const newBoostedState = !hasBoosted;
    setHasBoosted(newBoostedState);
    setShouldAnimateBoost(true); // Enable animation on user interaction

    // Update count optimistically
    setBoosts((prev) => (newBoostedState ? prev + 1 : Math.max(prev - 1, 0)));

    // Store the action we want to perform
    pendingBoostActionRef.current = newBoostedState ? "boost" : "unboost";

    // Debounce the actual database operation
    boostDebounceTimerRef.current = setTimeout(async () => {
      const action = pendingBoostActionRef.current;

      if (action === "boost") {
        const boostData = {
          post_id: post.id,
          user_id: user?.id,
        };

        const { error } = await supabase.from("boosts").insert([boostData]);

        if (error) {
          console.error("Error adding boost:", error);
          // Revert UI state on error
          setHasBoosted(false);
          setBoosts((prev) => Math.max(prev - 1, 0));
        }
      } else if (action === "unboost") {
        const { error } = await supabase
          .from("boosts")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error removing boost:", error);
          // Revert UI state on error
          setHasBoosted(true);
          setBoosts((prev) => prev + 1);
        }
      }

      // Clear the pending action
      pendingBoostActionRef.current = null;
    }, 500); // 500ms debounce delay
  }, [hasBoosted, post.id, user?.id]);

  const handleBookmark = useCallback(async () => {
    // Cancel any pending debounced action
    if (bookmarkDebounceTimerRef.current) {
      clearTimeout(bookmarkDebounceTimerRef.current);
    }

    // Toggle the UI immediately for responsiveness
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    setShouldAnimateBookmark(true); // Enable animation on user interaction

    // Store the action we want to perform
    pendingBookmarkActionRef.current = newBookmarkedState
      ? "bookmark"
      : "unbookmark";

    // Debounce the actual database operation
    bookmarkDebounceTimerRef.current = setTimeout(async () => {
      const action = pendingBookmarkActionRef.current;

      if (action === "bookmark") {
        const bookmarkData = {
          post_id: post.id,
          user_id: user?.id,
        };

        const { error } = await supabase
          .from("bookmarks")
          .insert([bookmarkData]);

        if (error) {
          console.error("Error adding bookmark:", error);
          // Revert UI state on error
          setIsBookmarked(false);
        }
      } else if (action === "unbookmark") {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error removing bookmark:", error);
          // Revert UI state on error
          setIsBookmarked(true);
        }
      }

      // Clear the pending action
      pendingBookmarkActionRef.current = null;
    }, 500); // 500ms debounce delay
  }, [isBookmarked, post.id, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (boostDebounceTimerRef.current) {
        clearTimeout(boostDebounceTimerRef.current);
      }
      if (bookmarkDebounceTimerRef.current) {
        clearTimeout(bookmarkDebounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex justify-between text-muted-foreground items-center p-3 my-4">
      <div className="flex gap-2">
        <Reply /> {post.comments || ""}
      </div>
      <div className="flex gap-2 items-center">
        <Repeat
          onClick={handleBoost}
          className={`cursor-pointer transition-all duration-300 ${
            hasBoosted
              ? `text-green-500 dark:text-green-400 ${
                  shouldAnimateBoost ? "animate-[spin_0.5s_ease-in-out]" : ""
                }`
              : "hover:text-green-500 dark:hover:text-green-400 hover:scale-110 active:scale-95"
          }`}
        />
        <span
          className={`text-sm transition-all duration-200 ${
            hasBoosted
              ? "text-green-500 dark:text-green-400 font-semibold"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {boosts || ""}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <Star
          onClick={handleFavorite}
          className={`cursor-pointer transition-all duration-300 ${
            hasLiked
              ? `fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500 ${
                  shouldAnimate && hasLiked
                    ? "animate-[spin_0.5s_ease-in-out]"
                    : ""
                }`
              : "hover:text-yellow-400 dark:hover:text-yellow-400 hover:scale-110 active:scale-95"
          }`}
        />
        <span
          className={`text-sm transition-all duration-200 ${
            hasLiked ? "text-yellow-400 font-semibold" : ""
          }`}
        >
          {favorites || ""}
        </span>
      </div>
      <div className="flex items-center">
        <Bookmark
          onClick={handleBookmark}
          className={`cursor-pointer transition-all duration-300 ${
            isBookmarked
              ? `fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400 ${
                  shouldAnimateBookmark
                    ? "animate-[bounce_0.5s_ease-in-out]"
                    : ""
                }`
              : "text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-110 active:scale-95"
          }`}
        />
      </div>
      <div className="flex">
        <Actions isOwner={post.createdBy == user?.id} />
      </div>
    </div>
  );
}

function Actions({ post, isOwner }: { post?: PostType; isOwner?: boolean }) {
  //

  return (
    <Drawer>
      <DrawerTrigger>
        <Ellipsis />
      </DrawerTrigger>
      {/* Sharp */}
      <DrawerContent className="w-[80%] m-auto grid gap-5">
        <div className={`grid gap-6 px-8 pt-5 ${isOwner ? "pb-2" : "pb-10"}`}>
          <p>Expand this post</p>
          <p>Copy link to post</p>
          <p>Share</p>
        </div>
        {isOwner && (
          <>
            <Separator />
            <div className="px-8">
              <p>Pin on profile</p>
            </div>
            <Separator />
            <div className="grid gap-6 px-8 pb-10">
              <p>Edit</p>
              <p className="text-rose-500">Delete</p>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

//  return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <Ellipsis />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="start">
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <Link href={"#"}>Expand this post</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Copy link to post</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Share</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <span>Pin on profile</span>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <span>Edit</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Delete</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );

// that's drawer sha...
// the drawer is actually cool...

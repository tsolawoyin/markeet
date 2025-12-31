"use client";

import { useShell } from "@/shell/shell";
import { useEffect } from "react";

import { PostType } from "@/components/blocks/post";
import Post from "@/components/blocks/post";

// I listen but then I use it to modify what to do next shey you get
export default function Home({ posts }: { posts: PostType[] }) {
  const { supabase, user } = useShell();

  return (
    <div>
      <div className="grid gap-2">
        {posts
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((post) => {
            return <Post post={post} key={post.id} />;
          })}
      </div>
    </div>
  );
}

// A lot of components will be built here but let's start simple.
// Let's start very simple
// Shey you get.
// Thank you so much

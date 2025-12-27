import { capitalize } from "lodash";
import { getPost, getPosts } from "@/lib/hygraph";
import { Suspense } from "react";
import Link from "next/link";

import Header from "@/components/header/header";

export function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page({ params }) {
  const { category } = await params;
  const posts = await getPosts("markeet");

  return (
    <div className="max-w-[750px] min-h-screen mx-auto dark:bg-slate-800">
      <Header currentPage={"blog"} isOwnProfile={true} isEditing={false} />
      <Suspense
        fallback={
          <p className="text-slate-600 dark:text-slate-400">Loading posts...</p>
        }
      >
        <div className="space-y-8 px-5">
          {posts.map((post) => {
            return (
              <article
                key={post.slug}
                className="pb-8 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/30 -mx-5 px-5 py-4 rounded-lg transition"
              >
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                  {formatDate(post.publishedAt)}
                </p>
                {post.summary && (
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                    {post.summary}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
}

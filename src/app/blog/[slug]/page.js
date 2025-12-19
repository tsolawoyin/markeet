import Header from "@/components/header/header";

// export default function Page() {
//   return (
//     <div>
//       <Header currentPage={"blog"} isOwnProfile={true} isEditing={false} />
//     </div>
//   );
// }
import { capitalize } from "lodash";
import { getPost, getPosts } from "@/lib/hygraph";
import { RichText } from "@graphcms/rich-text-react-renderer";
import { Ubuntu, Open_Sans, Space_Mono, Oxanium } from "next/font/google";
import Link from "next/link";

const ubuntu = Open_Sans({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getPost(slug);

  if (!content) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: content.title,
    description: content.summary,
    openGraph: {
      title: content.title,
      description: content.summary,
      type: "article",
      //   url: `https://yourdomain.com/blog/${slug}`,
      // Add if you have an image field in your content
      // images: [{ url: content.coverImage?.url }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.summary,
      // Add if you have an image field
      // images: [content.coverImage?.url],
    },
  };
}

const render = {
  h1: ({ children }) => {
    return <h1 className="my-8 pb-6 text-4xl font-bold text-slate-900 dark:text-white">{children}</h1>;
  },
  h2: ({ children }) => {
    return <h2 className="my-7 pb-5 text-3xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">{children}</h2>;
  },
  h3: ({ children }) => {
    return <h3 className="my-6 text-2xl font-bold text-slate-900 dark:text-white">{children}</h3>;
  },
  h4: ({ children }) => {
    return <h4 className="my-6 text-xl font-bold text-slate-900 dark:text-white">{children}</h4>;
  },
  h5: ({ children }) => {
    return <h5 className="my-5 pb-3 text-lg font-semibold text-slate-900 dark:text-white">{children}</h5>;
  },
  h6: ({ children }) => {
    return <h6 className="my-4 text-base font-semibold text-slate-900 dark:text-white">{children}</h6>;
  },
  p: ({ children }) => {
    return <p className="my-4 leading-7 text-slate-700 dark:text-slate-300">{children}</p>;
  },
  // a: ({ children, href }) => {
  //   return (
  //     <a href={href} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
  //       {children}
  //     </a>
  //   );
  // },
  ul: ({ children }) => {
    return <ul className="my-4 ml-6 list-disc space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>;
  },
  ol: ({ children }) => {
    return <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>;
  },
  li: ({ children }) => {
    return <li className="leading-7 text-slate-700 dark:text-slate-300">{children}</li>;
  },
  blockquote: ({ children }) => {
    return (
      <blockquote className="my-6 border-l-4 border-blue-600 pl-6 italic text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30 py-4 rounded-r-lg">
        {children}
      </blockquote>
    );
  },
  code: ({ children }) => {
    return (
      <code className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-2 py-1 text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    return (
      <pre className="my-6 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-lg p-4 overflow-x-auto border border-slate-700">
        {children}
      </pre>
    );
  },
  img: ({ src, alt }) => {
    return (
      <img src={src} alt={alt} className="my-6 rounded-lg max-w-full h-auto border border-slate-200 dark:border-slate-700" />
    );
  },
  hr: () => {
    return <hr className="my-8 border-slate-200 dark:border-slate-700" />;
  },
  strong: ({ children }) => {
    return <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>;
  },
  em: ({ children }) => {
    return <em className="italic text-slate-700 dark:text-slate-300">{children}</em>;
  },
  table: ({ children }) => {
    return (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-600">
          {children}
        </table>
      </div>
    );
  },
  thead: ({ children }) => {
    return <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>;
  },
  tbody: ({ children }) => {
    return (
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">{children}</tbody>
    );
  },
  tr: ({ children }) => {
    return <tr>{children}</tr>;
  },
  th: ({ children }) => {
    return (
      <th className="px-6 py-3 text-left text-sm font-bold text-slate-900 dark:text-white">
        {children}
      </th>
    );
  },
  td: ({ children }) => {
    return <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{children}</td>;
  },
};

export default async function ({ params }) {
  const { slug } = await params;

  const content = await getPost(slug);

  return (
    <div className="max-w-[750px] mx-auto">
      <Header currentPage={"blog"} isOwnProfile={true} isEditing={false} />
      {content && (
        <article className={`${ubuntu.className} px-5 pt-3 pb-10 dark:bg-slate-800`}>
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
              {content.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {formatDate(content.publishedAt)}
            </p>
          </div>

          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 font-medium leading-relaxed">{content.summary}</p>

          {/* The prose class automatically styles all HTML elements */}
          <div className="prose dark:prose-invert max-w-none">
            <RichText content={content.content.raw} renderers={render} />
          </div>
        </article>
      )}
    </div>
  );
}

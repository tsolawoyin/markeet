import { User } from "./profile";
import { Poll } from "@/components/blocks/poll";

import { Globe } from "lucide-react";

// Utils
import { formatTime } from "@/lib/time-converter";

export interface PostType {
  id: string;
  content: string;
  images?: string[]; // list of urls...
  privacy: "public" | "private";
  comments: number;
  boosts: number;
  favorites: number;
  createdBy: string;
  createdAt: string;
  profile: User;
  poll: Poll;
  hasLiked: boolean;
  hasBoosted: boolean;
  hasBookmarked: boolean;
}

import { useShell } from "@/shell/shell";

import ProfileHeader from "./profile";
import ImagePreview from "./images";
import PollComponent from "@/components/blocks/poll";
import Reaction from "./reaction";

export default function Post({ post }: { post: PostType }) {
  const { user } = useShell();
  // sharp
  return (
    <div className="border-b">
      {/* Header */}
      <ProfileHeader
        user={post.profile}
        createdAt={post.createdAt}
        privacy={post.privacy}
      />
      {/* Content */}
      <div className="px-5">
        {/* This is called sharpest. U know, you + AI = augmentation */}
        <p className="leading-7 not-first:mt-6 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Image Preview */}
        {post.images && post.images.length > 0 && (
          <ImagePreview images={post.images} />
        )}

        {post.poll && (
          <PollComponent
            poll={post.poll}
            // onVote={}
          />
        )}
      </div>
      {/* Footer */}
      <Reaction post={post} />
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";

// Components
import Home from "./(home)/home";

export default async function Page() {
  const supabase = await createClient();
  // The feed algorithm will be decided serverside, not clientside
  let { data: posts, error } = await supabase.from("posts").select(
    `
      *,
    profile:profiles!created_by(id, full_name, avatar_url),
    polls(
      id,
      duration,
      style,
      expires_at,
      poll_questions(
        id,
        question,
        vote
      )
    )
    `
  );

  if (!posts) {
    console.log(error);
    return <div>Error getting feeds. Please refresh!</div>;
  }

  // Repackaged everything to match up with the data we will be working with...
  // nice and sharp...
  posts = posts.map((post) => {
    const newProfile = {
      fullName: post.profile.full_name,
      avatarUrl: post.profile.avatar_url,
      username: null,
    };

    let poll = null;

    if (post.polls) {
      poll = {
      ...post.polls,
      questions: post.polls.poll_questions,
      expiresAt: post.polls.expires_at
    }
    }

    return {
      id: post.id,
      content: post.content,
      images: post.images,
      privacy: post.privacy,
      comments: post.comments,
      boosts: post.boosts,
      favorites: post.favorites,
      createdBy: post.created_by,
      createdAt: post.created_at,
      profile: newProfile,
      poll: poll // just convert plural to singular here
    };
  });

  return <Home posts={posts} />;
}

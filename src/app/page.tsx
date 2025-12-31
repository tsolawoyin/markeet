import { createClient } from "@/utils/supabase/server";

// Components
import Home from "./(home)/home";

export default async function Page() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser(); // this will be our first check
  // The feed algorithm will be decided serverside, not clientside
  let { data: posts, error } = await supabase.from("posts").select(
    `
      *,
    profile:profiles!created_by(id, full_name, course, avatar_url),
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
    // console.log(error);
    return <div>Error getting feeds. Please refresh!</div>;
  }

  const userHasVoted = async (pollId: string, userId: string | undefined) => {
    const { data, error } = await supabase
      .from("poll_votes")
      // , { count: "exact", head: true }
      .select("*") // Just count, don't fetch data
      .eq("user_id", userId)
      .eq("poll_id", pollId);

    if (error) {
      console.error("Error checking vote:", error);
      return false;
    }

    return data.length > 0;
  };

  // Get user's favorites
  const { data: userFavorites } = await supabase
    .from("favorites")
    .select("post_id")
    .eq("user_id", user.user?.id);

  const favoritePostIds = new Set(
    userFavorites?.map((fav) => fav.post_id) || []
  );

  // Get user's boost
  const { data: userBoosts } = await supabase
    .from("boosts")
    .select("post_id")
    .eq("user_id", user.user?.id);

  const boostedPostIds = new Set(
    userBoosts?.map((boost) => boost.post_id) || []
  );

  // Get user's bookmark
  const { data: userBookmarks } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", user.user?.id);

  const bookmarkedPostIds = new Set(
    userBookmarks?.map((bookmark) => bookmark.post_id) || []
  );

  // Repackaged everything to match up with the data we will be working with...
  // nice and sharp...
  // sharp. Makes sense. Thanks.
  // We will modify the algorithm later on.
  posts = await Promise.all(
    posts.map(async (post) => {
      const newProfile = {
        fullName: post.profile.full_name,
        avatarUrl: post.profile.avatar_url,
        course: post.profile.course,
      };

      let poll = null;

      // it won't take time. trust me. supabase is really fast.
      if (post.polls) {
        const voted = await userHasVoted(post.polls.id, user.user?.id);

        poll = {
          ...post.polls,
          questions: post.polls.poll_questions,
          expiresAt: post.polls.expires_at,
          hasVoted: voted,
        };
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
        poll: poll, // just convert plural to singular here
        hasLiked: favoritePostIds.has(post.id),
        hasBoosted: boostedPostIds.has(post.id),
        hasBookmarked: bookmarkedPostIds.has(post.id),
      };
    })
  );

  return <Home posts={posts} />;
}

// And everything is just clean and simple.
// Thank you. God bless you.

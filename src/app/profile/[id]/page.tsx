// ============================================
// FILE: app/profile/[id]/page.tsx (Server Component with PPR)

import Profile from "./profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  return <Profile />;
}
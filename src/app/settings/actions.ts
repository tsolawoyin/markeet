"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(userId: string) {
  const supabase = await createClient();

  // Verify the caller is the user being deleted
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Use service role to delete the user (cascade handles related data)
  const { createClient: createServiceClient } = await import(
    "@supabase/supabase-js"
  );
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await serviceSupabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Failed to delete account:", error);
    // console.log(error);
    return { success: false, error: "Failed to delete account" };
  }

  return { success: true };
}

import { createClient } from "@/utils/supabase/client";

// ============================================
// PROFILE UTILITIES
// ============================================

export async function signUpUser({
  email,
  password,
  fullName,
  phone,
  institutionName,
  institutionCode,
  institutionCity,
  hallOfResidence = null,
  faculty = null,
  yearOfStudy = null,
}) {
  try {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      return { data: null, error: authError };
    }

    if (!authData.user) {
      return { data: null, error: { message: "User creation failed" } };
    }

    // Step 2: Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        phone,
        institution_name: institutionName,
        institution_code: institutionCode,
        institution_city: institutionCity,
        hall_of_residence: hallOfResidence,
        faculty,
        year_of_study: yearOfStudy,
      })
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, we should ideally delete the auth user
      // but Supabase doesn't allow this from client side
      // You'd need to handle this on the backend or with a cleanup job
      return { data: null, error: profileError };
    }

    return {
      data: {
        user: authData.user,
        profile: profileData,
        session: authData.session,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get a profile by ID
 */
export async function getProfileById(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get profiles by institution code
 */
export async function getProfilesByInstitution(institutionCode, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("institution_code", institutionCode)
      .eq("is_active", true)
      .eq("is_banned", false)
      .order("rating", { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update current user's profile
 * Only allows updating specific fields
 */
export async function updateProfile(updates) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    // Whitelist of fields users can update
    const allowedFields = [
      "full_name",
      "phone",
      "institution_name",
      "institution_code",
      "institution_city",
      "avatar_url",
      "bio",
      "hall_of_residence",
      "faculty",
      "year_of_study",
    ];

    // Filter updates to only allowed fields
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const { data, error } = await supabase
      .from("profiles")
      .update(filteredUpdates)
      .eq("id", user.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update user's last active timestamp
 */
export async function updateLastActive() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: null };

    const { data, error } = await supabase
      .from("profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Search profiles by name or email
 */
export async function searchProfiles(query, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .eq("is_active", true)
      .eq("is_banned", false)
      .order("rating", { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get top-rated profiles
 */
export async function getTopRatedProfiles(limit = 10, institutionCode = null) {
  try {
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .eq("is_banned", false)
      .gte("total_ratings", 5) // At least 5 ratings
      .order("rating", { ascending: false })
      .limit(limit);

    if (institutionCode) {
      query = query.eq("institution_code", institutionCode);
    }

    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Delete current user's profile
 */
export async function deleteProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    // Delete profile (will cascade delete user from auth.users)
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (!error) {
      // Sign out the user
      await supabase.auth.signOut();
    }

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get profiles by faculty
 */
export async function getProfilesByFaculty(faculty, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("faculty", faculty)
      .eq("is_active", true)
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get profiles by year of study
 */
export async function getProfilesByYear(
  yearOfStudy,
  institutionCode = null,
  limit = 50
) {
  try {
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("year_of_study", yearOfStudy)
      .eq("is_active", true)
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (institutionCode) {
      query = query.eq("institution_code", institutionCode);
    }

    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get profiles by hall of residence
 */
export async function getProfilesByHall(hallOfResidence, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("hall_of_residence", hallOfResidence)
      .eq("is_active", true)
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

// ============================================
// ADMIN UTILITIES (Require special permissions)
// ============================================

/**
 * Ban a user (admin only - requires service role)
 */
export async function banUser(userId, supabaseAdmin) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ is_banned: true, is_active: false })
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Unban a user (admin only - requires service role)
 */
export async function unbanUser(userId, supabaseAdmin) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ is_banned: false, is_active: true })
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Updat(e user rating should be called after a transaction/rating)
 * This would typically be triggered by a database function
 */
export async function updateUserRating(userId, newRating, supabaseAdmin) {
  try {
    // Get current rating data
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("rating, total_ratings")
      .eq("id", userId)
      .single();

    if (!profile) {
      return { data: null, error: { message: "Profile not found" } };
    }

    const totalRatings = profile.total_ratings + 1;
    const currentTotal = profile.rating * profile.total_ratings;
    const newAverage = ((currentTotal + newRating) / totalRatings).toFixed(2);

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        rating: newAverage,
        total_ratings: totalRatings,
      })
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

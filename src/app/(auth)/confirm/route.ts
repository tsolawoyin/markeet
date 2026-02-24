import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const _next = searchParams.get("next");
  const next = _next?.startsWith("/") ? _next : "/"; // Redirects to home

  const supabase = await createClient();

  // Handle PKCE flow
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return NextResponse.redirect(
        new URL(
          `/auth-code-error?error=${error?.message || "Authentication failed"}`,
          request.url,
        ),
      );
    }

    await postVerification(supabase, data.user);
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Handle token hash flow
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error || !data.user) {
      return NextResponse.redirect(
        new URL(
          `/auth-code-error?error=${error?.message || "Verification failed"}`,
          request.url,
        ),
      );
    }

    await postVerification(supabase, data.user);
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(
    new URL(
      "/auth-code-error?error=No authentication parameters provided",
      request.url,
    ),
  );
}

async function postVerification(supabase: any, user: any) {
  try {
    await supabase.rpc("initialize_wallet");
  } catch (walletError) {
    console.error("Wallet creation error:", walletError);
  }

  // const referrerId = user.user_metadata?.referrer_id;
  // if (referrerId) {
  //   try {
  //     await supabase.from("referrals").insert({
  //       referrer_id: referrerId,
  //       referred_user_id: user.id,
  //     });

  //     await supabase.rpc("credit_referral_signup_bonus", {
  //       p_referrer_id: referrerId,
  //     });
  //   } catch (referralError) {
  //     console.error("Referral tracking error:", referralError);
  //   }
  // }
}

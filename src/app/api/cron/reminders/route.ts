import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_SUBJECTS = [
  "Your fellow UI students are buying & selling on Markeet!",
  "Textbooks, gadgets & more — find deals on Markeet",
  "What are UI students selling today? Check Markeet",
  "Don't miss out — new listings on Markeet!",
  "Markeet: Your campus marketplace is buzzing",
];

function getEmailHtml(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#ea580c,#c2410c);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Markeet</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Your UI Campus Marketplace</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;color:#1c1917;font-size:16px;line-height:1.6;">
                Hey ${firstName} 👋
              </p>
              <p style="margin:0 0 16px;color:#44403c;font-size:15px;line-height:1.6;">
                Just a quick reminder that Markeet is here for you! Whether you're looking for affordable textbooks, selling stuff you no longer need, or finding services from fellow UI students — it's all happening on Markeet.
              </p>
              <p style="margin:0 0 24px;color:#44403c;font-size:15px;line-height:1.6;">
                New items get listed every day. Don't miss out on great deals from students in your hall and department!
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://markeet.ng" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                      Browse Markeet
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Quick links -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #e7e5e4;padding-top:20px;">
                <tr>
                  <td style="color:#78716c;font-size:13px;line-height:1.5;">
                    Quick links:
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    <a href="https://markeet.ng/sell" style="color:#ea580c;text-decoration:none;font-size:13px;font-weight:500;">Sell an Item</a>
                    <span style="color:#d6d3d1;margin:0 8px;">•</span>
                    <a href="https://markeet.ng/wishes" style="color:#ea580c;text-decoration:none;font-size:13px;font-weight:500;">Browse Wishes</a>
                    <span style="color:#d6d3d1;margin:0 8px;">•</span>
                    <a href="https://markeet.ng/explore" style="color:#ea580c;text-decoration:none;font-size:13px;font-weight:500;">Explore</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafaf9;padding:20px 24px;border-top:1px solid #e7e5e4;">
              <p style="margin:0;color:#a8a29e;font-size:12px;line-height:1.5;text-align:center;">
                You're receiving this because you signed up on Markeet.
                <br />
                <a href="https://markeet.ng/settings" style="color:#a8a29e;text-decoration:underline;">Manage preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("is_active", true)
      .or("is_banned.is.null,is_banned.eq.false");

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch profiles" },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No eligible users found",
        sent: 0,
        failed: 0,
      });
    }

    // Shuffle and pick up to 50
    const shuffled = profiles.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 50);

    const subject =
      EMAIL_SUBJECTS[Math.floor(Math.random() * EMAIL_SUBJECTS.length)];

    const results = await Promise.allSettled(
      selected.map(async (user) => {
        const firstName = user.full_name?.split(" ")[0] || "there";

        const { error: sendError } = await resend.emails.send({
          from: "Markeet <hello@markeet.ng>",
          to: user.email,
          subject,
          html: getEmailHtml(firstName),
        });

        if (sendError) {
          throw new Error(sendError.message);
        }

        return { userId: user.id, email: user.email };
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total_eligible: profiles.length,
      selected: selected.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

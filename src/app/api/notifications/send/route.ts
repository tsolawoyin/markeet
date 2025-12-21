import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/utils/supabase/server";

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { title, body, url, type } = await request.json();

    const supabase = await createClient();

    // Get all active push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscriptions to send to",
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
      tag: type,
    });

    // Send to all subscribers
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );

        // Update last_used_at
        await supabase
          .from("push_subscriptions")
          .update({ last_used_at: new Date().toISOString() })
          .eq("id", sub.id);

        return { success: true, id: sub.id };
      } catch (error: any) {
        // Remove invalid subscriptions
        if (error.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
        return { success: false, id: sub.id, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: subscriptions.length,
      results,
    });
  } catch (error: any) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications", details: error.message },
      { status: 500 }
    );
  }
}

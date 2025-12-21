import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Verify it's a published post
    if (payload.operation === "publish" && payload.data.__typename === "Post") {
      const post = payload.data;

      // Send notification to all users
      const notificationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/notifications/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "📝 New Blog Post!",
            body: post.title,
            url: `/blog/${post.slug}`,
            type: "new_blog_post",
          }),
        }
      );

      const result = await notificationResponse.json();

      return NextResponse.json({
        success: true,
        message: "Notifications sent",
        result,
      });
    }

    return NextResponse.json({ success: true, message: "No action needed" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

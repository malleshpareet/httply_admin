import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type = "info", message = "Test notification", title } = body;

    await pusherServer.trigger("admin-notifications", "alert", {
      type,
      message,
      title
    });

    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Pusher error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

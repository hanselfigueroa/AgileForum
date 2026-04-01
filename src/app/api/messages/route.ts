import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getMessages, markAsRead, deleteMessage, getUnreadCount } from "@/lib/messages";

export async function GET() {
  try {
    const valid = await verifySession();
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const messages = getMessages();
    const unread = getUnreadCount();
    return NextResponse.json({ messages, unread });
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const valid = await verifySession();
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id, action } = await request.json();

    if (action === "read") {
      markAsRead(id);
    } else if (action === "delete") {
      deleteMessage(id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

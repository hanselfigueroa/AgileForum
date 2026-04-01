import { NextResponse } from "next/server";
import { getContent, saveContent, SiteContent } from "@/lib/content";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const content = getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const valid = await verifySession();
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const content: SiteContent = await request.json();

    // Validate structure
    if (!content.sections || !content.hero || !content.events || !content.speakers || !content.faq) {
      return NextResponse.json({ error: "Invalid content structure" }, { status: 400 });
    }

    saveContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { setupAdmin, isAdminSetup, createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (isAdminSetup()) {
      return NextResponse.json(
        { error: "Admin already configured" },
        { status: 403 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Username required, password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await setupAdmin(username, password);
    const token = await createSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ setup: isAdminSetup() });
}

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const valid = await verifySession();
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const field = formData.get("field") as string | null;

    if (!file || !field) {
      return NextResponse.json(
        { error: "File and field are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only SVG, PNG, JPG, WebP, and GIF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 2MB" },
        { status: 400 }
      );
    }

    // Create logos directory if needed
    const logosDir = path.join(process.cwd(), "public/logos");
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
    }

    // Generate filename with timestamp to bust cache
    const ext = file.name.split(".").pop() || "png";
    const safeName = field.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const filename = `${safeName}-${Date.now()}.${ext}`;
    const filepath = path.join(logosDir, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    // Clean up old files for this field (keep only the new one)
    const files = fs.readdirSync(logosDir);
    for (const f of files) {
      if (f.startsWith(`${safeName}-`) && f !== filename) {
        fs.unlinkSync(path.join(logosDir, f));
      }
    }

    const publicUrl = `/logos/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

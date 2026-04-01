import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addMessage } from "@/lib/messages";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAILS = ["info@agileforum.org"];
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Try to send email via Resend
    let emailSent = false;

    if (resend) {
      try {
        await resend.emails.send({
          from: `AgileForum 2026 <${FROM_EMAIL}>`,
          to: NOTIFY_EMAILS,
          replyTo: email,
          subject: `New message from AgileForum: ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #B12945; padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
              </div>
              <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 12px; font-weight: bold; color: #333; width: 100px;">Name</td>
                    <td style="padding: 8px 12px; color: #555;">${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; font-weight: bold; color: #333;">Email</td>
                    <td style="padding: 8px 12px; color: #555;"><a href="mailto:${escapeHtml(email)}" style="color: #B12945;">${escapeHtml(email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; font-weight: bold; color: #333;">Subject</td>
                    <td style="padding: 8px 12px; color: #555;">${escapeHtml(subject)}</td>
                  </tr>
                </table>
                <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e5e5;" />
                <div style="padding: 8px 12px;">
                  <p style="font-weight: bold; color: #333; margin: 0 0 8px;">Message</p>
                  <p style="color: #555; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
                </div>
              </div>
              <p style="text-align: center; color: #999; font-size: 12px; margin-top: 16px;">
                Sent from AgileForum contact form
              </p>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
        // Continue — still save the message even if email fails
      }
    }

    // Always store the message locally
    addMessage({ name, email, subject, message }, emailSent);

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? "Message sent successfully!"
        : "Message saved! (Email notification will be sent once configured.)",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process your message" },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

import { NextResponse } from "next/server";
import { portfolioService } from "@/lib/data/portfolioService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeyPot } = body;

    // Honeypot spam trap
    if (honeyPot) {
      return NextResponse.json({ success: true, message: "Message received" });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const saved = await portfolioService.submitContactMessage({
      name,
      email,
      subject: subject || "Portfolio Inquiry",
      message,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing message." },
      { status: 500 }
    );
  }
}

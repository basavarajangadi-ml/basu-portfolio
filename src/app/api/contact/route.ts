import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/server/portfolioStorage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ContactMessage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

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

    const newMsg: ContactMessage = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      name,
      email,
      subject: subject || "Portfolio Inquiry",
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // Save to persistent server store
    const full = await getPortfolioData();
    full.messages = [newMsg, ...(full.messages || [])];
    await savePortfolioData(full);

    // Also insert to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("contact_messages").insert(newMsg);
      } catch (e) {
        console.warn("Supabase message insert error:", e);
      }
    }

    return NextResponse.json({ success: true, data: newMsg });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing message." },
      { status: 500 }
    );
  }
}

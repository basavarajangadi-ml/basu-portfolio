import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If an explicit ADMIN_PASSWORD is set in environment variables:
    if (adminPassword) {
      if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
        return NextResponse.json({
          success: true,
          user: { id: "admin-secure-id", email: adminEmail, role: "admin" }
        });
      } else {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }
    }

    // Default fallback if no ADMIN_PASSWORD set yet:
    // Allow demo admin credentials or any email with password length >= 6
    if (password.length >= 6) {
      return NextResponse.json({
        success: true,
        user: { id: "admin-secure-id", email: email.toLowerCase(), role: "admin" }
      });
    }

    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

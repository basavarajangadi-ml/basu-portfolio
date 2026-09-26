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

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Both ADMIN_EMAIL and ADMIN_PASSWORD must be configured
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin access is protected. Please configure ADMIN_EMAIL and ADMIN_PASSWORD in your server environment variables." },
        { status: 503 }
      );
    }

    if (
      email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
      password === adminPassword
    ) {
      return NextResponse.json({
        success: true,
        user: { id: "admin-secure-id", email: adminEmail, role: "admin" }
      });
    }

    return NextResponse.json(
      { error: "Access denied. Invalid admin email or password." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

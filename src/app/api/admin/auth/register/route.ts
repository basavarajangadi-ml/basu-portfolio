import { NextResponse } from "next/server";
import { setAdminPassword, setAdminEmail, getAdminEmail } from "@/lib/auth/adminStore";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required to create an admin account." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();

    // Register / update the admin credentials in server store
    setAdminEmail(normEmail);
    setAdminPassword(normEmail, password);

    return NextResponse.json({
      success: true,
      message: "Admin account registered successfully! You can now sign in.",
      user: {
        id: "admin-secure-id",
        email: normEmail,
        role: "admin",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to register admin account." },
      { status: 500 }
    );
  }
}

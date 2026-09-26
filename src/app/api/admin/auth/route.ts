import { NextResponse } from "next/server";
import { ADMIN_CONFIG } from "@/lib/auth/adminConfig";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const rawExpectedEmail = process.env.ADMIN_EMAIL || ADMIN_CONFIG.email;
    const rawExpectedPassword = process.env.ADMIN_PASSWORD || ADMIN_CONFIG.password;

    const expectedEmail = rawExpectedEmail.replace(/[\[\]]/g, "").trim().toLowerCase();
    const expectedPassword = rawExpectedPassword.trim();

    const inputEmail = email.replace(/[\[\]]/g, "").trim().toLowerCase();
    const inputPassword = password.trim();

    // STRICT OWNER CHECK: Only the exact admin email and exact password are accepted
    if (inputEmail === expectedEmail && inputPassword === expectedPassword) {
      return NextResponse.json({
        success: true,
        user: { 
          id: "admin-secure-id", 
          email: expectedEmail, 
          role: "admin" 
        }
      });
    }

    return NextResponse.json(
      { error: "Access denied. Only the portfolio owner can sign in." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Authentication server error. Please try again." },
      { status: 500 }
    );
  }
}

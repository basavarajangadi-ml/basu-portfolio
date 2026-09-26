import { NextResponse } from "next/server";
import { verifyAdminCredentials, getAdminEmail } from "@/lib/auth/adminStore";

export async function POST(request: Request) {
  try {
    const { email, password, clientVaultPassword } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(email, password, clientVaultPassword);

    if (isValid) {
      return NextResponse.json({
        success: true,
        user: { 
          id: "admin-secure-id", 
          email: email.trim().toLowerCase(), 
          role: "admin" 
        }
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

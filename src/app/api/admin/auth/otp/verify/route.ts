import { NextResponse } from "next/server";
import { verifyOtp, setAdminPassword, getAdminEmail } from "@/lib/auth/adminStore";

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const currentAdminEmail = getAdminEmail();

    if (normEmail !== currentAdminEmail) {
      return NextResponse.json(
        { error: "Email does not match registered admin." },
        { status: 400 }
      );
    }

    const isValid = verifyOtp(normEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired 6-digit OTP code." },
        { status: 401 }
      );
    }

    // Set new password
    setAdminPassword(normEmail, newPassword);

    return NextResponse.json({
      success: true,
      message: "Admin password successfully reset! You can now sign in with your new password.",
      user: {
        id: "admin-secure-id",
        email: normEmail,
        role: "admin"
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to verify OTP and reset password." },
      { status: 500 }
    );
  }
}

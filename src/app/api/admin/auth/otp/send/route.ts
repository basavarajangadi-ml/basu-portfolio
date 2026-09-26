import { NextResponse } from "next/server";
import { generateOtp, getAdminEmail } from "@/lib/auth/adminStore";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Admin email is required to request OTP." },
        { status: 400 }
      );
    }

    const normEmail = email.trim().toLowerCase();
    const code = generateOtp(normEmail);

    return NextResponse.json({
      success: true,
      message: "A 6-digit verification code has been generated.",
      otpCode: code,
      expiresIn: "10 minutes"
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate OTP verification code." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { generateResetOtp, resetPasswordWithCodeOrPin, getAdminAuth } from "@/lib/server/adminAuthStorage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "request-otp") {
      const { otp, expiresAt } = await generateResetOtp();
      const auth = await getAdminAuth();

      return NextResponse.json({
        success: true,
        message: "OTP generated successfully.",
        // In local/development mode, deliver the OTP directly to the client
        // so the user does not get blocked by missing external SMTP mail servers
        otp,
        email: auth.email,
        expiresInMinutes: 15,
        masterPinHint: "You can also use your Master Recovery PIN (7097) to reset directly.",
      });
    }

    if (action === "reset") {
      const { code, newPassword } = body;

      if (!code || !newPassword) {
        return NextResponse.json(
          { success: false, error: "OTP / Recovery PIN and new password are required." },
          { status: 400 }
        );
      }

      const result = await resetPasswordWithCodeOrPin(code, newPassword);

      if (result.success) {
        return NextResponse.json({
          success: true,
          message: "Password reset successfully! You can now log in with your new password.",
        });
      }

      return NextResponse.json(
        { success: false, error: result.error || "Failed to reset password." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported actions: 'request-otp', 'reset'." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Forgot password API error:", err);
    return NextResponse.json(
      { success: false, error: "Server error occurred during password recovery." },
      { status: 500 }
    );
  }
}

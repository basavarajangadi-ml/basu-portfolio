import { NextResponse } from "next/server";
import { updateAdminPassword } from "@/lib/server/adminAuthStorage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Password changed successfully! Please use your new password next time you log in."
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to update password." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Change password API error:", err);
    return NextResponse.json(
      { success: false, error: "Server error occurred while updating password." },
      { status: 500 }
    );
  }
}

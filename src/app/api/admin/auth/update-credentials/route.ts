import { NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminPassword, setAdminEmail, getAdminEmail } from "@/lib/auth/adminStore";

export async function POST(request: Request) {
  try {
    const { currentPassword, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current admin password is required to make security changes." },
        { status: 400 }
      );
    }

    const currentAdminEmail = getAdminEmail();
    const isValid = verifyAdminCredentials(currentAdminEmail, currentPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    let updatedEmail = currentAdminEmail;
    if (newEmail && newEmail.trim()) {
      updatedEmail = newEmail.trim().toLowerCase();
      setAdminEmail(updatedEmail);
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }
      setAdminPassword(updatedEmail, newPassword.trim());
    }

    return NextResponse.json({
      success: true,
      message: "Admin credentials updated successfully.",
      email: updatedEmail,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update admin credentials." },
      { status: 500 }
    );
  }
}

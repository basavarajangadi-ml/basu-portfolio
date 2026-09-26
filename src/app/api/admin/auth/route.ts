import { NextResponse } from "next/server";
import { verifyAdminCredentials, getAdminAuth } from "@/lib/server/adminAuthStorage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(email, password);

    if (isValid) {
      const auth = await getAdminAuth();
      return NextResponse.json({
        success: true,
        user: { 
          id: "admin-secure-id", 
          email: auth.email, 
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
      { error: "Authentication server error. Please try again." },
      { status: 500 }
    );
  }
}

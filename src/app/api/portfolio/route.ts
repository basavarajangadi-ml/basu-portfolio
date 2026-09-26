import { NextResponse } from "next/server";
import { 
  getPortfolioData, 
  savePortfolioData, 
  updatePortfolioSection, 
  PortfolioData 
} from "@/lib/server/portfolioStorage";

// Mark this route dynamic so it is never cached statically
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (err: any) {
    console.error("GET /api/portfolio error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load portfolio data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Full data sync (e.g. syncing local data to server)
    if (body.fullData) {
      await savePortfolioData(body.fullData);
      const updated = await getPortfolioData();
      return NextResponse.json({ success: true, data: updated });
    }

    // 2. Section update
    if (body.section && body.data !== undefined) {
      const section = body.section as keyof PortfolioData;
      const validSections: (keyof PortfolioData)[] = [
        "profile",
        "projects",
        "certificates",
        "skills",
        "education",
        "experience",
        "achievements",
        "socialLinks",
        "settings",
        "messages"
      ];

      if (!validSections.includes(section)) {
        return NextResponse.json(
          { success: false, error: `Invalid section: ${section}` },
          { status: 400 }
        );
      }

      const updated = await updatePortfolioSection(section, body.data);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request payload. Expected section and data, or fullData." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("POST /api/portfolio error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update portfolio data" },
      { status: 500 }
    );
  }
}

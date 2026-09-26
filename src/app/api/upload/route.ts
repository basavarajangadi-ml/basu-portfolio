import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data." },
        { status: 400 }
      );
    }

    // Sanitize folder name to prevent path traversal
    const allowedFolders = ["profile", "projects", "certificates", "resume", "achievements", "general"];
    const folder = allowedFolders.includes(rawFolder) ? rawFolder : "general";

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Supabase Storage is configured and live, attempt upload there
    if (isSupabaseConfigured() && supabase) {
      try {
        const ext = file.name.split(".").pop() || "bin";
        const sanitizedBase = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const cloudPath = `${folder}/${Date.now()}_${sanitizedBase}`;

        const { data, error } = await supabase.storage
          .from("portfolio-assets")
          .upload(cloudPath, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("portfolio-assets")
            .getPublicUrl(cloudPath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            storage: "supabase",
          });
        } else {
          console.warn("Supabase storage upload error, saving to local public/uploads instead:", error);
        }
      } catch (cloudErr) {
        console.warn("Supabase upload exception, saving to local public/uploads instead:", cloudErr);
      }
    }

    // Local file system storage in public/uploads/<folder>
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
      await fs.mkdir(uploadsDir, { recursive: true });

      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `${Date.now()}_${sanitizedFilename}`;
      const destinationPath = path.join(uploadsDir, uniqueFilename);

      await fs.writeFile(destinationPath, buffer);

      const publicUrl = `/uploads/${folder}/${uniqueFilename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        storage: "local",
      });
    } catch (fsErr) {
      // Read-only serverless environment fallback (e.g. Vercel)
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type || "application/octet-stream"};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        storage: "memory-data-url",
      });
    }
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "File upload failed." },
      { status: 500 }
    );
  }
}

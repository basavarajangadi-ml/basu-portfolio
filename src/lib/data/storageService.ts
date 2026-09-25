import { supabase, isSupabaseConfigured } from "../supabase/client";

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Compresses an image in the browser using HTML5 Canvas
 */
export async function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it's a PDF or SVG, do not compress via canvas
    if (file.type === "application/pdf" || file.type.includes("svg")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          file.type === "image/png" ? "image/png" : "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}

/**
 * Uploads a file to Supabase storage bucket `portfolio-assets` or converts to DataURL fallback
 */
export async function uploadPortfolioAsset(
  file: File,
  folder: "profile" | "projects" | "certificates" | "resume" | "achievements"
): Promise<UploadResult> {
  // Compress if image
  const isImage = file.type.startsWith("image/");
  const uploadBlob = isImage ? await compressImage(file) : file;

  // Supabase Storage upload
  if (isSupabaseConfigured() && supabase) {
    try {
      const ext = file.name.split(".").pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, uploadBlob, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          name: file.name,
          size: uploadBlob.size,
          type: file.type,
        };
      } else {
        console.warn("Supabase storage upload error, using local fallback", error);
      }
    } catch (err) {
      console.warn("Storage exception, using local fallback", err);
    }
  }

  // Local fallback: convert to DataURL for immediate browser preview and storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        name: file.name,
        size: uploadBlob.size,
        type: file.type,
      });
    };
    reader.onerror = () => reject(new Error("Failed to convert file to data URL"));
    reader.readAsDataURL(uploadBlob);
  });
}

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
  return new Promise((resolve) => {
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
    reader.onerror = () => resolve(file);
  });
}

/**
 * Uploads a file to the persistent server upload API (/api/upload).
 * Stores the file in public/uploads/<folder> or Supabase Storage,
 * ensuring it is accessible to all devices without localStorage quota limitations.
 */
export async function uploadPortfolioAsset(
  file: File,
  folder: "profile" | "projects" | "certificates" | "resume" | "achievements"
): Promise<UploadResult> {
  try {
    const isImage = file.type.startsWith("image/");
    const uploadBlob = isImage ? await compressImage(file) : file;

    const formData = new FormData();
    formData.append("file", uploadBlob, file.name);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return {
          url: data.url,
          name: data.name || file.name,
          size: data.size || file.size,
          type: data.type || file.type,
        };
      }
    }
    console.warn("Upload API returned non-OK status, trying fallback");
  } catch (err) {
    console.warn("Upload to /api/upload failed, using local fallback", err);
  }

  // Fallback: convert to DataURL for immediate browser preview if offline
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

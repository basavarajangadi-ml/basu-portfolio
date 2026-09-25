"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { uploadPortfolioAsset } from "@/lib/data/storageService";

interface ImageUploadProps {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  onDeleted?: () => void;
  folder?: "profile" | "projects" | "certificates" | "resume" | "achievements";
  accept?: string;
  label?: string;
  description?: string;
  isAvatar?: boolean;
}

export default function ImageUpload({
  currentUrl,
  onUploaded,
  onDeleted,
  folder = "projects",
  accept = "image/jpeg,image/png,image/webp,image/jpg",
  label = "Upload Image",
  description = "Supported: JPG, PNG, WebP (Max 5MB)",
  isAvatar = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await uploadPortfolioAsset(file, folder);
      setPreview(result.url);
      onUploaded(result.url);
    } catch (err: any) {
      console.error("Upload error", err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onDeleted) {
      onDeleted();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isPdf = preview?.includes(".pdf") || (preview && preview.startsWith("data:application/pdf"));

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}

      {/* Upload Zone */}
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden group ${
          isAvatar ? "w-40 h-40 rounded-full mx-auto" : "w-full min-h-[160px] p-6"
        } ${
          preview 
            ? "border-cyan-500/50 bg-[#0d1527]/50" 
            : "border-white/15 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-cyan-500/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center p-4 text-cyan-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-xs font-medium">Compressing & Uploading...</span>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {isPdf ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <FileText className="w-12 h-12 text-cyan-400 mb-2" />
                <span className="text-xs text-gray-300 font-medium">PDF Document Selected</span>
                <span className="text-[10px] text-gray-500 mt-1">Click to replace</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Upload preview"
                className={`w-full h-full object-cover ${isAvatar ? "rounded-full" : "max-h-56 rounded-lg"}`}
              />
            )}

            {/* Overlay action on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-xs text-white bg-cyan-600/80 px-2.5 py-1 rounded-md font-medium">
                Change
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-md transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-300">
              Click or drag file to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

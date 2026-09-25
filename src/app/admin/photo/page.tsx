"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/ui/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Camera, CheckCircle2, Trash2, Eye, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Profile } from "@/lib/supabase/types";

export default function AdminProfilePhotoPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    portfolioService.getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handlePhotoUploaded = async (url: string) => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    try {
      const updated = await portfolioService.updateProfile({ profile_photo_url: url });
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Photo update error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await portfolioService.updateProfile({ profile_photo_url: null });
      setProfile(updated);
      setIsDeleteModalOpen(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Photo delete error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-8 text-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading profile photo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Profile Photo Management"
        subtitle="Upload, preview, replace, or delete your professional portfolio photograph."
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Profile photo updated successfully and synced with Hero and About sections!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Upload & Controls */}
        <div className="md:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Select or Drop Photo
            </h3>
            <p className="text-xs text-gray-400">
              Recommended 1:1 square ratio. Supported formats: JPG, JPEG, PNG, WebP. Automatically compressed for ultra-fast page loading.
            </p>
          </div>

          <ImageUpload
            currentUrl={profile.profile_photo_url}
            onUploaded={handlePhotoUploaded}
            onDeleted={() => setIsDeleteModalOpen(true)}
            folder="profile"
            label="Upload Headshot (Max 5MB)"
            description="JPG, PNG, WebP &bull; 1:1 Recommended"
            isAvatar={true}
          />

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Status: {profile.profile_photo_url ? (
                <span className="text-emerald-400 font-medium">Custom Photo Active</span>
              ) : (
                <span className="text-amber-400 font-medium">Using Default AI Avatar</span>
              )}
            </div>

            {profile.profile_photo_url && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="md:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Public Hero Preview</span>
          </div>

          <div className="relative w-48 h-48 mx-auto my-4 rounded-full p-2 bg-[#0b1120] border border-cyan-500/40 shadow-2xl avatar-halo flex items-center justify-center overflow-hidden">
            {profile.profile_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profile_photo_url}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-900 flex flex-col items-center justify-center p-4 text-cyan-400">
                <Camera className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-[10px] text-gray-400 font-mono">No Custom Photo</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400">
            This image is dynamically injected into both the <span className="text-white font-medium">Hero Section</span> and the <span className="text-white font-medium">About Me Section</span>.
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Profile Photo"
        message="Are you sure you want to remove your profile photo? The public portfolio will immediately revert to the clean default AI engineer avatar."
        confirmText="Yes, Remove Photo"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

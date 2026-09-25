"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ImageUpload from "@/components/ui/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FileText, Download, Trash2, Eye, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Profile } from "@/lib/supabase/types";

export default function AdminResumePage() {
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

  const handleResumeUploaded = async (url: string) => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    try {
      const updated = await portfolioService.updateProfile({ resume_url: url });
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Resume update error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await portfolioService.updateProfile({ resume_url: null });
      setProfile(updated);
      setIsDeleteModalOpen(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Resume delete error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-8 text-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading resume status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Resume / CV Management"
        subtitle="Upload, replace, preview, or delete your latest resume PDF. Automatically updates the public download link."
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Resume updated successfully! The public download and view buttons now serve this document.</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Upload or Replace Resume
          </h3>
          <p className="text-xs text-gray-400">
            Accepts PDF documents. Uploading a new PDF will automatically replace the existing one and update both the Navbar and the Resume section.
          </p>
        </div>

        <ImageUpload
          currentUrl={profile.resume_url}
          onUploaded={handleResumeUploaded}
          onDeleted={() => setIsDeleteModalOpen(true)}
          folder="resume"
          accept="application/pdf"
          label="Resume PDF Document (Max 10MB)"
          description="Click or drop your updated resume PDF here"
        />

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono">
            {profile.resume_url ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Latest Resume Active
              </span>
            ) : (
              <span className="text-amber-400">No Resume Uploaded</span>
            )}
          </div>

          {profile.resume_url && (
            <div className="flex items-center gap-3">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 border border-white/15 text-white hover:border-cyan-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Resume</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Embedded Preview */}
      {profile.resume_url && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Live PDF Document Preview</span>
            </h3>
          </div>

          <div className="w-full h-[600px] rounded-xl overflow-hidden bg-gray-950 border border-white/10">
            <iframe
              src={profile.resume_url}
              className="w-full h-full"
              title="Resume Preview"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message="Are you sure you want to remove your resume? Visitors will not be able to download your resume until you upload an updated PDF."
        confirmText="Yes, Remove Resume"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

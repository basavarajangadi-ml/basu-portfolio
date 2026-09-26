"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, Loader2, User } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Profile } from "@/lib/supabase/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [careerInterestsStr, setCareerInterestsStr] = useState("");
  const [technicalInterestsStr, setTechnicalInterestsStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    portfolioService.getProfile().then((data) => {
      setProfile(data);
      setCareerInterestsStr(data.career_interests?.join(", ") || "");
      setTechnicalInterestsStr(data.technical_interests?.join(", ") || "");
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess(false);

    try {
      const payload: Profile = {
        ...profile,
        career_interests: careerInterestsStr.split(",").map(s => s.trim()).filter(Boolean),
        technical_interests: technicalInterestsStr.split(",").map(s => s.trim()).filter(Boolean),
      };
      const updated = await portfolioService.updateProfile(payload);
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-8 text-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading profile records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Personal Profile"
        subtitle="Manage personal identification, degree details, career objectives, and engineering interests."
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Profile changes saved successfully and updated on public portfolio.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Identity */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Core Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Primary Contact Email <span className="text-cyan-400">*</span>
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Professional Tagline
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Degree
              </label>
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              University / College Institution
            </label>
            <input
              type="text"
              value={profile.college}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Narrative & Objectives */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Narrative & Objectives
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Short Biography (Hero & About Me)
            </label>
            <textarea
              rows={3}
              value={profile.short_bio}
              onChange={(e) => setProfile({ ...profile, short_bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Career Objective (Internships & Placements)
            </label>
            <textarea
              rows={3}
              value={profile.career_objective}
              onChange={(e) => setProfile({ ...profile, career_objective: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Career Interests (Comma-separated)
            </label>
            <input
              type="text"
              value={careerInterestsStr}
              onChange={(e) => setCareerInterestsStr(e.target.value)}
              placeholder="Artificial Intelligence, Machine Learning, Deep Learning"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Technical Interests (Comma-separated)
            </label>
            <input
              type="text"
              value={technicalInterestsStr}
              onChange={(e) => setTechnicalInterestsStr(e.target.value)}
              placeholder="Neural Networks, Autonomous Agents, Cloud Architecture"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Social / Profiles */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Primary Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                GitHub Username
              </label>
              <input
                type="text"
                value={profile.github_username}
                onChange={(e) => setProfile({ ...profile, github_username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

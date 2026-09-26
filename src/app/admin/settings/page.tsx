"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, Loader2, Settings, Github, Database, ShieldAlert, Lock, KeyRound, AlertCircle } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { PortfolioSettings } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { isSupabaseActive } = useAuth();

  useEffect(() => {
    portfolioService.getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const updated = await portfolioService.updateSettings(settings);
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading site settings...</span>
      </div>
    );
  }

  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncToServer = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      // Gather current local data
      const [
        profile,
        projects,
        certificates,
        skills,
        education,
        experience,
        achievements,
        socialLinks,
        currSettings,
        messages
      ] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getProjects(),
        portfolioService.getCertificates(),
        portfolioService.getSkills(),
        portfolioService.getEducation(),
        portfolioService.getExperience(),
        portfolioService.getAchievements(),
        portfolioService.getSocialLinks(),
        portfolioService.getSettings(),
        portfolioService.getContactMessages(),
      ]);

      const fullData = {
        profile,
        projects,
        certificates,
        skills,
        education,
        experience,
        achievements,
        socialLinks,
        settings: currSettings,
        messages,
      };

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullData }),
      });

      if (res.ok) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Manual sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 5000);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordError("Network or server error while updating password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Settings & System Configuration"
        subtitle="Manage global SEO metadata, GitHub synchronization, and system connectivity."
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {syncSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>All portfolio data successfully synchronized to persistent server disk! It is now live across all mobile devices, tablets, and desktop browsers.</span>
        </div>
      )}

      {/* Server & Mobile Sync Status Card */}
      <div className="p-6 rounded-2xl border bg-gray-900/60 border-cyan-500/30 shadow-glow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Multi-Device Server Persistence:</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/30 text-emerald-300">
                  Active (Server JSON + Supabase Ready)
                </span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Changes saved in this admin dashboard are persisted on the server file (<span className="text-cyan-400 font-mono">data/portfolio-data.json</span>).
                When you or recruiters open the website on mobile phones, tablets, or other computers, all information updates automatically!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncToServer}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50 flex-shrink-0"
          >
            {syncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing to Server...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-200" />
                <span>Sync All Data to Server</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mobile Device Sync: <strong className="text-gray-200 font-medium">Enabled</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span>Cloud Database: <strong className="text-gray-200 font-medium">{isSupabaseActive ? "Connected to Supabase" : "Local Server Store"}</strong></span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* GitHub Integration */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Github className="w-4 h-4 text-cyan-400" />
            <span>GitHub Sync Configuration</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              GitHub Username
            </label>
            <input
              type="text"
              placeholder="e.g. torvalds or your-username"
              value={settings.github_username}
              onChange={(e) => setSettings({ ...settings, github_username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Used by the public portfolio to fetch real public repositories, stars, and language stats.
            </p>
          </div>
        </div>

        {/* SEO Meta */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Settings className="w-4 h-4 text-purple-400" />
            <span>SEO & OpenGraph Metadata</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Site Title Tag
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={settings.keywords?.join(", ") || ""}
              onChange={(e) => setSettings({ 
                ...settings, 
                keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) 
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="allow_contact_form"
              checked={settings.allow_contact_form}
              onChange={(e) => setSettings({ ...settings, allow_contact_form: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-gray-900 border-white/10"
            />
            <label htmlFor="allow_contact_form" className="text-xs text-gray-300">
              Allow visitors to submit public contact messages
            </label>
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
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Admin Security & Password Change */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Admin Security & Password Change
            </h3>
            <p className="text-xs text-gray-400">
              Change your admin password directly without waiting for third-party email OTP services.
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Password updated successfully! Your new password is now active.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Current Password <span className="text-purple-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Current secret password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                New Password <span className="text-purple-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Confirm New Password <span className="text-purple-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Master Recovery PIN: <strong className="text-cyan-300 font-mono">7097</strong> (can be used on login page if password is forgotten)</span>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Admin Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

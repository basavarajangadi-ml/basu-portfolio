"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, Loader2, Settings, Github, Database, ShieldAlert, Lock, KeyRound, AlertCircle, ShieldCheck } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { PortfolioSettings } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Security credentials state
  const [currPassword, setCurrPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

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

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (!currPassword) {
      setSecurityError("Please enter your current password to authorize changes.");
      return;
    }

    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }

    if (newAdminPassword && newAdminPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters.");
      return;
    }

    setSecurityLoading(true);

    try {
      const res = await fetch("/api/admin/auth/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currPassword,
          newEmail: newAdminEmail.trim() || undefined,
          newPassword: newAdminPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (newAdminPassword && typeof window !== "undefined") {
          localStorage.setItem("portfolio_admin_vault_pass", newAdminPassword);
        }
        setSecuritySuccess("Admin security credentials updated successfully!");
        setCurrPassword("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setConfirmAdminPassword("");
        setTimeout(() => setSecuritySuccess(null), 5000);
      } else {
        setSecurityError(data.error || "Failed to update security credentials.");
      }
    } catch {
      setSecurityError("Server error while updating security credentials.");
    } finally {
      setSecurityLoading(false);
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

      {/* Supabase Connection Status Card */}
      <div className={`p-6 rounded-2xl border ${
        isSupabaseActive
          ? "bg-emerald-950/30 border-emerald-500/30"
          : "bg-amber-950/30 border-amber-500/30"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isSupabaseActive ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"} flex-shrink-0`}>
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Database & Cloud Storage Status:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                isSupabaseActive ? "bg-emerald-500/30 text-emerald-300" : "bg-amber-500/30 text-amber-300"
              }`}>
                {isSupabaseActive ? "Live Supabase Cloud" : "Local Persistent Mode"}
              </span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isSupabaseActive
                ? "Your portfolio is connected to your live Supabase project. Row Level Security and public storage buckets are fully active."
                : "You are currently running in local development mode. Changes are saved reactively to your browser storage. To connect to Supabase, paste your project URL and keys into .env.local and run the supabase/schema.sql script in your Supabase dashboard."}
            </p>
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

      {/* ========================================================================= */}
      {/* ADMIN ACCOUNT & PASSWORD SECURITY */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Admin Account & Password Security</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Change your admin login email or password. Requires your current password to authorize.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            Owner Only
          </span>
        </div>

        {securitySuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{securitySuccess}</span>
          </div>
        )}

        {securityError && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{securityError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateSecurity} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Current Admin Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                New Admin Email (Optional)
              </label>
              <input
                type="email"
                placeholder="Leave blank to keep unchanged"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                New Admin Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {newAdminPassword && (
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Confirm New Admin Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={securityLoading || !currPassword}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
            >
              {securityLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Security...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

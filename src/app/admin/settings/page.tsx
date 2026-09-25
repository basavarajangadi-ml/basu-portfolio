"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Save, CheckCircle2, Loader2, Settings, Github, Database, ShieldAlert } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { PortfolioSettings } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, Share2, ExternalLink, Loader2, Github, Linkedin, Mail, Globe, Instagram, Twitter } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { SocialLink } from "@/lib/supabase/types";

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    platform: "GitHub",
    url: "",
    icon: "github",
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    const data = await portfolioService.getSocialLinks();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingLink(null);
    setFormData({
      platform: "GitHub",
      url: "https://github.com/",
      icon: "github",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      is_active: link.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await portfolioService.saveSocialLink({
        id: editingLink ? editingLink.id : undefined,
        platform: formData.platform,
        url: formData.url.trim(),
        icon: formData.icon,
        is_active: formData.is_active,
        order_index: editingLink ? editingLink.order_index : links.length + 1,
      });

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save social link error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteSocialLink(deletingId);
      setDeletingId(null);
      await loadData();
    } catch (err) {
      console.error("Delete social link error", err);
    } finally {
      setSaving(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("github")) return <Github className="w-5 h-5 text-white" />;
    if (p.includes("linkedin")) return <Linkedin className="w-5 h-5 text-blue-400" />;
    if (p.includes("mail")) return <Mail className="w-5 h-5 text-cyan-400" />;
    if (p.includes("instagram")) return <Instagram className="w-5 h-5 text-pink-400" />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter className="w-5 h-5 text-sky-400" />;
    return <Globe className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminHeader
        title="Social Profiles & Links"
        subtitle="Manage public external platforms, social profiles, and developer networks."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Link</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading social links...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gray-900 border border-white/10 flex-shrink-0">
                  {getPlatformIcon(link.platform)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {link.platform}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      link.is_active ? "bg-emerald-950/60 text-emerald-400" : "bg-gray-800 text-gray-500"
                    }`}>
                      {link.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1 mt-0.5 break-all"
                  >
                    <span>{link.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(link)}
                  className="p-2 text-gray-400 hover:text-white"
                  title="Edit link"
                >
                  <Edit2 className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => setDeletingId(link.id)}
                  className="p-2 text-gray-400 hover:text-red-400"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink ? "Edit Social Link" : "Add Social Link"}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Platform Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub, LinkedIn, Twitter, LeetCode, Kaggle"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Destination URL <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-gray-900 border-white/10"
            />
            <label htmlFor="is_active" className="text-xs text-gray-300">
              Visible on Public Portfolio
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingLink ? "Update Link" : "Add Link"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Social Link"
        message="Are you sure you want to remove this social link?"
        confirmText="Yes, Delete Link"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

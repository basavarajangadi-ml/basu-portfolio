"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, Trophy, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Achievement } from "@/lib/supabase/types";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Hackathon" as Achievement['category'],
    organization: "",
    date: new Date().getFullYear().toString(),
    description: "",
    link_url: "",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await portfolioService.getAchievements();
    setAchievements(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Hackathon",
      organization: "",
      date: new Date().getFullYear().toString(),
      description: "",
      link_url: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      organization: item.organization,
      date: item.date,
      description: item.description,
      link_url: item.link_url || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      organization: formData.organization.trim(),
      date: formData.date.trim(),
      description: formData.description.trim(),
      link_url: formData.link_url.trim() || undefined,
      order_index: editingItem ? editingItem.order_index : achievements.length + 1,
    };

    try {
      if (editingItem) {
        await portfolioService.updateAchievement(editingItem.id, payload);
      } else {
        await portfolioService.createAchievement(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save achievement error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteAchievement(deletingId);
      setDeletingId(null);
      await loadData();
    } catch (err) {
      console.error("Delete achievement error", err);
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    "Hackathon",
    "Competition",
    "Award",
    "Workshop",
    "Academic",
    "Coding",
    "Event",
    "Other",
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader
        title="Achievements & Honors"
        subtitle="Manage hackathon awards, competitive programming milestones, workshops, and leadership events."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading honors and awards...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
                {item.organization && (
                  <p className="text-xs text-cyan-400 font-medium mt-0.5">
                    {item.organization}
                  </p>
                )}

                <p className="text-xs text-gray-400 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span />}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded text-gray-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Achievement" : "Add Achievement"}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="1st Runner Up - National AI Hackathon"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Category <span className="text-amber-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Year / Date <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="2024"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Organization / Sponsor <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="National Innovation Forum"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the challenge solved, competition scale, or role played..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Link / Certificate Proof URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-amber-400"
            />
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
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingItem ? "Update Achievement" : "Add Achievement"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement record?"
        confirmText="Yes, Delete Achievement"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

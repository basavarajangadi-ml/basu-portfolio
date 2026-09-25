"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Wrench, Loader2 } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Skill, SkillCategory } from "@/lib/supabase/types";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "AI & Machine Learning" as SkillCategory,
    proficiency_level: "Advanced" as Skill['proficiency_level'],
    order_index: 1,
  });

  const loadSkills = async () => {
    setLoading(true);
    const data = await portfolioService.getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "AI & Machine Learning",
      proficiency_level: "Advanced",
      order_index: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.proficiency_level || "Intermediate",
      order_index: skill.order_index,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingSkill) {
        await portfolioService.updateSkill(editingSkill.id, {
          name: formData.name.trim(),
          category: formData.category,
          proficiency_level: formData.proficiency_level,
          order_index: formData.order_index,
        });
      } else {
        await portfolioService.createSkill({
          name: formData.name.trim(),
          category: formData.category,
          proficiency_level: formData.proficiency_level,
          order_index: formData.order_index,
        });
      }
      setIsModalOpen(false);
      await loadSkills();
    } catch (err) {
      console.error("Save skill error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteSkill(deletingId);
      setDeletingId(null);
      await loadSkills();
    } catch (err) {
      console.error("Delete skill error", err);
    } finally {
      setSaving(false);
    }
  };

  const moveSkill = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const reordered = [...skills];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    setSkills(reordered);
    await portfolioService.reorderSkills(reordered);
  };

  const categories: SkillCategory[] = [
    "Programming",
    "Web Development",
    "AI & Machine Learning",
    "Database",
    "Tools",
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader
        title="Skills & Technologies"
        subtitle="Manage technical competencies, categories, proficiency levels, and custom display sequence."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading skills inventory...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div key={cat} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    {cat} ({catSkills.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {catSkills.map((skill) => {
                    const globalIndex = skills.findIndex(s => s.id === skill.id);
                    return (
                      <div
                        key={skill.id}
                        className="p-3.5 rounded-xl bg-gray-900/70 border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {skill.name}
                          </div>
                          {skill.proficiency_level && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              {skill.proficiency_level}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSkill(globalIndex, "up")}
                            disabled={globalIndex === 0}
                            className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSkill(globalIndex, "down")}
                            disabled={globalIndex === skills.length - 1}
                            className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1 text-gray-400 hover:text-cyan-400"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(skill.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {catSkills.length === 0 && (
                    <div className="text-xs text-gray-500 italic py-2">
                      No skills added in {cat} yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add Skill"}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Skill Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PyTorch, Next.js, Docker"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Category <span className="text-cyan-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Proficiency Level
            </label>
            <select
              value={formData.proficiency_level}
              onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
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
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingSkill ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill entry from your competencies?"
        confirmText="Yes, Delete Skill"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

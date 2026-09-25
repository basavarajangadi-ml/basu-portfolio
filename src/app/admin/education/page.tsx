"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, GraduationCap, Calendar, Loader2 } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Education } from "@/lib/supabase/types";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    branch: "",
    start_year: "",
    end_year: "",
    grade: "",
    description: "",
    coursework: "",
    achievements: "",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await portfolioService.getEducation();
    setEducation(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      degree: "Bachelor of Technology (B.Tech)",
      institution: "",
      branch: "Artificial Intelligence & Machine Learning",
      start_year: "2023",
      end_year: "2027",
      grade: "CGPA: 8.8 / 10.0",
      description: "Focused on core algorithmic foundations and specialized artificial intelligence systems.",
      coursework: "Data Structures & Algorithms, Machine Learning, Deep Learning, DBMS",
      achievements: "Active member of AI & Tech society",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingEdu(item);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      branch: item.branch,
      start_year: item.start_year,
      end_year: item.end_year,
      grade: item.grade || "",
      description: item.description || "",
      coursework: item.coursework?.join(", ") || "",
      achievements: item.achievements?.join("\n") || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      degree: formData.degree.trim(),
      institution: formData.institution.trim(),
      branch: formData.branch.trim(),
      start_year: formData.start_year.trim(),
      end_year: formData.end_year.trim(),
      grade: formData.grade.trim() || undefined,
      description: formData.description.trim() || undefined,
      coursework: formData.coursework.split(",").map(c => c.trim()).filter(Boolean),
      achievements: formData.achievements.split("\n").map(a => a.trim()).filter(Boolean),
      order_index: editingEdu ? editingEdu.order_index : education.length + 1,
    };

    try {
      if (editingEdu) {
        await portfolioService.updateEducation(editingEdu.id, payload);
      } else {
        await portfolioService.createEducation(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save education error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteEducation(deletingId);
      setDeletingId(null);
      await loadData();
    } catch (err) {
      console.error("Delete education error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader
        title="Education History"
        subtitle="Manage degrees, institutions, branches, academic timelines, relevant coursework, and honors."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading academic timeline...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.degree}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">
                      {item.branch} &bull; {item.institution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.start_year} &mdash; {item.end_year}
                  </span>
                  {item.grade && (
                    <span className="text-purple-300">
                      Grade: {item.grade}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}

                {item.coursework && item.coursework.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.coursework.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-300">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  title="Edit entry"
                >
                  <Edit2 className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => setDeletingId(item.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete entry"
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
        title={editingEdu ? "Edit Education" : "Add Education Entry"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Degree / Qualification <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Bachelor of Technology (B.Tech)"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Institution / University <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Your University / College Name"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Branch / Major
              </label>
              <input
                type="text"
                placeholder="AI & ML"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Start Year
              </label>
              <input
                type="text"
                placeholder="2023"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                End Year / Expected
              </label>
              <input
                type="text"
                placeholder="2027"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Grade / CGPA (Optional)
            </label>
            <input
              type="text"
              placeholder="CGPA: 8.8 / 10.0"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Overview of specialization, major electives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Relevant Coursework (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Data Structures, Algorithms, Machine Learning, Deep Learning"
              value={formData.coursework}
              onChange={(e) => setFormData({ ...formData, coursework: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Academic Recognitions (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="Top 10% in department&#10;Peer tutor for Python and ML"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none font-mono text-xs"
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
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingEdu ? "Update Education" : "Add Education"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Education Entry"
        message="Are you sure you want to remove this education timeline entry?"
        confirmText="Yes, Delete Entry"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

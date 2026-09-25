"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Plus, Edit2, Trash2, Briefcase, Calendar, ExternalLink, Loader2, Info } from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Experience } from "@/lib/supabase/types";

export default function AdminExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    responsibilities: "",
    technologies: "",
    company_url: "",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await portfolioService.getExperience();
    setExperience(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      company: "",
      position: "AI / ML Engineering Intern",
      start_date: "June 2024",
      end_date: "August 2024",
      is_current: false,
      description: "",
      responsibilities: "Engineered scalable feature pipelines\nCollaborated on deep learning model benchmarks",
      technologies: "Python, PyTorch, Docker, Git",
      company_url: "https://",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Experience) => {
    setEditingExp(item);
    setFormData({
      company: item.company,
      position: item.position,
      start_date: item.start_date,
      end_date: item.end_date,
      is_current: item.is_current,
      description: item.description,
      responsibilities: item.responsibilities?.join("\n") || "",
      technologies: item.technologies?.join(", ") || "",
      company_url: item.company_url || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      company: formData.company.trim(),
      position: formData.position.trim(),
      start_date: formData.start_date.trim(),
      end_date: formData.is_current ? "Present" : formData.end_date.trim(),
      is_current: formData.is_current,
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.split("\n").map(r => r.trim()).filter(Boolean),
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      company_url: formData.company_url.trim() || undefined,
      order_index: editingExp ? editingExp.order_index : experience.length + 1,
    };

    try {
      if (editingExp) {
        await portfolioService.updateExperience(editingExp.id, payload);
      } else {
        await portfolioService.createExperience(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save experience error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteExperience(deletingId);
      setDeletingId(null);
      await loadData();
    } catch (err) {
      console.error("Delete experience error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <AdminHeader
        title="Experience & Internships"
        subtitle="Manage professional internships, research affiliations, and work history."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        }
      />

      {/* Recruiter Policy Note */}
      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-cyan-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Authenticity Notice:</strong> If you currently have no previous work experience or internships, leave this section empty. The public portfolio will automatically display: <span className="underline italic">&quot;Currently seeking internship opportunities.&quot;</span>
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading experience timeline...</span>
        </div>
      ) : experience.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-white/10 text-center space-y-3">
          <Briefcase className="w-12 h-12 mx-auto text-gray-600" />
          <h4 className="text-base font-bold text-white">No Experience Entries</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Your public website is currently displaying the <span className="text-cyan-400">&quot;Currently seeking internship opportunities.&quot;</span> message. Click above to add an internship once secured!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.position}
                    </h3>
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                      <span>{item.company}</span>
                      {item.company_url && (
                        <a href={item.company_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {item.start_date} &mdash; {item.is_current ? "Present" : item.end_date}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pt-1">
                  {item.description}
                </p>

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="space-y-1 pt-1 text-xs text-gray-400 list-disc list-inside">
                    {item.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-start">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  title="Edit entry"
                >
                  <Edit2 className="w-4 h-4 text-emerald-400" />
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? "Edit Experience" : "Add Experience Entry"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Company / Organization <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Google / OpenAI / Startup Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Position / Role Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="AI & Machine Learning Intern"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Start Date <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="May 2024"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                End Date {!formData.is_current && <span className="text-emerald-400">*</span>}
              </label>
              <input
                type="text"
                disabled={formData.is_current}
                placeholder="August 2024"
                value={formData.is_current ? "Present" : formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current"
              checked={formData.is_current}
              onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-gray-900 border-white/10"
            />
            <label htmlFor="is_current" className="text-xs text-gray-300">
              I am currently working in this role
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Role Summary / Description <span className="text-emerald-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Contributed to core machine learning pipelines and real-time backend microservices..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="Architected convolutional feature extractors for anomaly detection&#10;Decreased inference latency by 35% using ONNX runtime"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400 resize-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Technologies & Tools (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Python, PyTorch, Fastify, Docker, AWS"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Company Website URL
            </label>
            <input
              type="url"
              placeholder="https://company.com"
              value={formData.company_url}
              onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-emerald-400"
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
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingExp ? "Update Experience" : "Add Experience"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Experience Entry"
        message="Are you sure you want to remove this work experience from your records?"
        confirmText="Yes, Delete Entry"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

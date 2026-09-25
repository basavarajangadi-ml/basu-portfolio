"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ImageUpload from "@/components/ui/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Github, 
  Layers, 
  CheckCircle2, 
  Loader2,
  Calendar
} from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Project, ProjectCategory } from "@/lib/supabase/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    detailed_description: "",
    image_url: "",
    technologies: "",
    category: "AI/ML" as Project['category'],
    features: "",
    github_url: "",
    live_demo_url: "",
    date: new Date().getFullYear().toString(),
  });

  const loadProjects = async () => {
    setLoading(true);
    const data = await portfolioService.getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      short_description: "",
      detailed_description: "",
      image_url: "",
      technologies: "Python, PyTorch, React",
      category: "AI/ML",
      features: "Feature 1\nFeature 2",
      github_url: "https://github.com/",
      live_demo_url: "",
      date: new Date().getFullYear().toString(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      short_description: project.short_description,
      detailed_description: project.detailed_description,
      image_url: project.image_url,
      technologies: project.technologies.join(", "),
      category: project.category,
      features: project.features.join("\n"),
      github_url: project.github_url,
      live_demo_url: project.live_demo_url || "",
      date: project.date,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectPayload = {
      title: formData.title.trim(),
      short_description: formData.short_description.trim(),
      detailed_description: formData.detailed_description.trim(),
      image_url: formData.image_url.trim(),
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      category: formData.category,
      features: formData.features.split("\n").map(f => f.trim()).filter(Boolean),
      github_url: formData.github_url.trim(),
      live_demo_url: formData.live_demo_url.trim(),
      date: formData.date.trim(),
    };

    try {
      if (editingProject) {
        await portfolioService.updateProject(editingProject.id, projectPayload);
      } else {
        await portfolioService.createProject(projectPayload);
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error("Save project error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteProject(deletingId);
      setDeletingId(null);
      await loadProjects();
    } catch (err) {
      console.error("Delete project error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Project Management"
        subtitle="Add, edit, re-categorize, and upload screenshots for your machine learning and software projects."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading projects catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 bg-gray-900 overflow-hidden">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 border border-white/10 text-cyan-300">
                    {p.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {p.short_description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.technologies.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono text-gray-500">
                    {p.date}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => setDeletingId(p.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add New Project"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Project Title <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Autonomous Medical Vision Classifier"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Category <span className="text-cyan-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              >
                <option value="AI/ML">AI/ML</option>
                <option value="Generative AI">Generative AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Completion Year / Date
              </label>
              <input
                type="text"
                placeholder="2024"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Project Screenshot / Image Upload */}
          <div>
            <ImageUpload
              currentUrl={formData.image_url}
              onUploaded={(url) => setFormData({ ...formData, image_url: url })}
              onDeleted={() => setFormData({ ...formData, image_url: "" })}
              folder="projects"
              label="Project Screenshot / Banner Image"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Short Description (Card preview) <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="High-level description of what the project does..."
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Detailed Architecture & Overview (Modal popup)
            </label>
            <textarea
              rows={3}
              placeholder="Explain model architecture, training pipeline, optimization, benchmarks..."
              value={formData.detailed_description}
              onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Technologies Used (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Python, PyTorch, FastAPI, OpenCV, Next.js"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Key Features (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="Sub-200ms latency inference API with ONNX runtime&#10;Grad-CAM visual explanation overlay&#10;Multi-label classification of 14 pathologies"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400 resize-none font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                GitHub Repository URL <span className="text-cyan-400">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/username/project"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://demo.vercel.app"
                value={formData.live_demo_url}
                onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-cyan-400"
              />
            </div>
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
              {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to permanently remove this project from your portfolio? This action cannot be undone."
        confirmText="Yes, Delete Project"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

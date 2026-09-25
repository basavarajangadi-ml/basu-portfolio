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
  Award, 
  ExternalLink, 
  Building2, 
  Calendar, 
  FileText,
  Loader2 
} from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Certificate } from "@/lib/supabase/types";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    issuing_organization: "",
    issue_date: new Date().getFullYear().toString(),
    credential_id: "",
    certificate_image_url: "",
    certificate_pdf_url: "",
    verification_url: "",
    description: "",
    skills: "",
    category: "AI/ML",
  });

  const loadCertificates = async () => {
    setLoading(true);
    const data = await portfolioService.getCertificates();
    setCertificates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: "",
      issuing_organization: "",
      issue_date: new Date().getFullYear().toString(),
      credential_id: "",
      certificate_image_url: "",
      certificate_pdf_url: "",
      verification_url: "",
      description: "",
      skills: "Machine Learning, Deep Learning",
      category: "AI/ML",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuing_organization: cert.issuing_organization,
      issue_date: cert.issue_date,
      credential_id: cert.credential_id || "",
      certificate_image_url: cert.certificate_image_url || "",
      certificate_pdf_url: cert.certificate_pdf_url || "",
      verification_url: cert.verification_url || "",
      description: cert.description || "",
      skills: cert.skills?.join(", ") || "",
      category: cert.category || "AI/ML",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title.trim(),
      issuing_organization: formData.issuing_organization.trim(),
      issue_date: formData.issue_date.trim(),
      credential_id: formData.credential_id.trim() || undefined,
      certificate_image_url: formData.certificate_image_url.trim() || undefined,
      certificate_pdf_url: formData.certificate_pdf_url.trim() || undefined,
      verification_url: formData.verification_url.trim() || undefined,
      description: formData.description.trim() || undefined,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      category: formData.category.trim() || "AI/ML",
    };

    try {
      if (editingCert) {
        await portfolioService.updateCertificate(editingCert.id, payload);
      } else {
        await portfolioService.createCertificate(payload);
      }
      setIsModalOpen(false);
      await loadCertificates();
    } catch (err) {
      console.error("Save certificate error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      await portfolioService.deleteCertificate(deletingId);
      setDeletingId(null);
      await loadCertificates();
    } catch (err) {
      console.error("Delete cert error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Certificates Management"
        subtitle="Upload certificates, store credentials securely, attach verification URLs, and manage issuing organizations."
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-8 text-center text-purple-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading certificates...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-400">
                    {cert.issue_date}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-cyan-400 font-medium mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{cert.issuing_organization}</span>
                  </div>
                </div>

                {cert.credential_id && (
                  <div className="text-[11px] font-mono text-gray-500">
                    ID: {cert.credential_id}
                  </div>
                )}

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-900/60 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(cert.certificate_image_url || cert.certificate_pdf_url) && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> File Attached
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit certificate"
                  >
                    <Edit2 className="w-4 h-4 text-purple-400" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cert.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? "Edit Certificate" : "Add Certificate"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Certificate Title <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Deep Learning Specialization"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Issuing Organization <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="DeepLearning.AI / Coursera / Stanford"
                value={formData.issuing_organization}
                onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Issue Year / Date <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="2024"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Credential ID
              </label>
              <input
                type="text"
                placeholder="DL-SPEC-982143"
                value={formData.credential_id}
                onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Verification URL
              </label>
              <input
                type="url"
                placeholder="https://coursera.org/verify/..."
                value={formData.verification_url}
                onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
              />
            </div>
          </div>

          {/* Certificate Image or PDF Upload */}
          <div>
            <ImageUpload
              currentUrl={formData.certificate_image_url || formData.certificate_pdf_url}
              onUploaded={(url) => {
                if (url.includes(".pdf") || url.startsWith("data:application/pdf")) {
                  setFormData({ ...formData, certificate_pdf_url: url, certificate_image_url: "" });
                } else {
                  setFormData({ ...formData, certificate_image_url: url, certificate_pdf_url: "" });
                }
              }}
              onDeleted={() => setFormData({ ...formData, certificate_image_url: "", certificate_pdf_url: "" })}
              folder="certificates"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              label="Upload Certificate (Image or PDF)"
              description="PNG, JPG, WebP, or PDF Document (Max 5MB)"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Description / Specialization Topics
            </label>
            <textarea
              rows={2}
              placeholder="Covered convolutional networks, recurrent neural networks, gradient optimization..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
              Related Skills (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Deep Learning, PyTorch, CNNs, Optimization"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-sm focus:border-purple-400"
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
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple hover:opacity-95 transition-all"
            >
              {saving ? "Saving..." : editingCert ? "Update Certificate" : "Add Certificate"}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate entry? It will be removed from the public website immediately."
        confirmText="Yes, Delete Certificate"
        isDanger={true}
        isLoading={saving}
      />
    </div>
  );
}

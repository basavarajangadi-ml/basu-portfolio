"use client";

import React, { useState } from "react";
import { Download, Eye, FileText, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Profile } from "@/lib/supabase/types";
import Modal from "../ui/Modal";

interface ResumeSectionProps {
  profile: Profile;
}

export default function ResumeSection({ profile }: ResumeSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const hasResume = Boolean(profile.resume_url);

  return (
    <section id="resume" className="py-24 relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Call-to-action Banner Box */}
        <div className="relative glass-panel rounded-3xl p-8 sm:p-14 border border-cyan-500/20 overflow-hidden shadow-2xl">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                08 &bull; CURRICULUM VITAE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Interested in <span className="text-gradient-cyan-purple">working together?</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Review my verified academic history, deep learning coursework, machine learning project architectures, and core software engineering skills.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>B.Tech AI & ML Candidate (2023 - 2027)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Available for 3 to 6-Month Internships</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Python, PyTorch, React & Next.js Stack</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Updated Version Directly from Admin</span>
                </div>
              </div>

              {/* Resume Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                {hasResume ? (
                  <>
                    <button
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-900 border border-white/15 text-white hover:border-cyan-400 hover:bg-gray-800 transition-all"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>View Resume</span>
                    </button>

                    <a
                      href={profile.resume_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`${profile.full_name.replace(/\s+/g, '_')}_Resume.pdf`}
                      className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume</span>
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-xs text-gray-400 italic">
                      Resume PDF will be available once uploaded in Admin Dashboard &rarr; Resume.
                    </div>
                    <a
                      href="#contact"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow"
                    >
                      <span>Get in Touch</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Document graphic */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0a0f1d] border border-cyan-500/30 p-5 shadow-2xl flex flex-col justify-between transform group-hover:-rotate-2 transition-transform duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <FileText className="w-8 h-8 text-cyan-400" />
                      <span className="text-[10px] font-mono text-gray-500 uppercase">PDF FORMAT</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 bg-white/20 rounded" />
                      <div className="h-2 w-full bg-white/10 rounded" />
                      <div className="h-2 w-5/6 bg-white/10 rounded" />
                      <div className="h-2 w-2/3 bg-white/10 rounded" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 text-center">
                    <span className="text-[11px] font-mono text-cyan-300">
                      {profile.full_name}
                    </span>
                    <span className="block text-[9px] text-gray-500">
                      B.Tech AI & ML Candidate
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Resume Preview Modal */}
        {hasResume && (
          <Modal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            title={`${profile.full_name} - Resume Preview`}
            maxWidth="4xl"
          >
            <div className="space-y-4">
              <div className="w-full h-[70vh] rounded-xl overflow-hidden bg-gray-950 border border-white/10">
                <iframe
                  src={profile.resume_url!}
                  className="w-full h-full"
                  title="Resume Document"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <a
                  href={profile.resume_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold bg-gray-900 border border-white/15 text-white rounded-lg hover:border-cyan-400 transition-colors"
                >
                  Open in New Tab
                </a>
                <a
                  href={profile.resume_url!}
                  download
                  className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow-glow transition-all"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Briefcase, Calendar, ExternalLink, CheckCircle2, Search } from "lucide-react";
import { Experience } from "@/lib/supabase/types";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const hasExperience = experience && experience.length > 0;

  return (
    <section id="experience" className="py-24 relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            06 &bull; INDUSTRY & ROLES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Work Experience & <span className="text-gradient-cyan-purple">Internships</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Professional industry engagements, research internships, and technical engineering positions.
          </p>
        </div>

        {/* If no experience: Strictly display "Currently seeking internship opportunities." */}
        {!hasExperience ? (
          <div className="max-w-2xl mx-auto text-center p-10 glass-panel rounded-2xl border border-cyan-500/20 shadow-glow relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-float">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Currently seeking internship opportunities.
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto mb-6">
              Actively preparing for Artificial Intelligence, Machine Learning, Data Science, and Software Development internships for Summer / Fall. Ready to contribute with strong algorithmic problem-solving and rapid learning capabilities.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Discuss an Opportunity</span>
            </a>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative border-l border-white/10 pl-6 sm:pl-8 space-y-12 ml-4 sm:ml-auto">
            {experience.map((item) => (
              <div key={item.id} className="relative group">
                
                {/* Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#0b1120] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-110 shadow-glow transition-transform">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>

                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {item.position}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 mt-0.5">
                        <span>{item.company}</span>
                        {item.company_url && (
                          <a
                            href={item.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col sm:items-end gap-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/50 border border-cyan-500/30 text-cyan-300">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.start_date} &mdash; {item.is_current ? "Present" : item.end_date}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Key Deliverables & Impact
                      </div>
                      {item.responsibilities.map((resp, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {item.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

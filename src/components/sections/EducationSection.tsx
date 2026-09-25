"use client";

import React from "react";
import { GraduationCap, Calendar, BookOpen, Award, CheckCircle2 } from "lucide-react";
import { Education } from "@/lib/supabase/types";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-24 relative bg-[#040816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            05 &bull; ACADEMIC FOUNDATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Education & <span className="text-gradient-cyan-purple">Coursework</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Rigorous undergraduate studies specializing in Artificial Intelligence, Machine Learning algorithms, and Computer Science fundamentals.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative border-l border-white/10 pl-6 sm:pl-8 space-y-12 ml-4 sm:ml-auto">
          {education.map((item, idx) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#0b1120] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-110 shadow-glow transition-transform">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Education Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {item.degree}
                    </h3>
                    <div className="text-sm font-semibold text-cyan-300 mt-0.5">
                      {item.branch}
                    </div>
                    <div className="text-xs text-gray-400 font-medium mt-1">
                      {item.institution}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.start_year} &mdash; {item.end_year}
                    </span>
                    {item.grade && (
                      <span className="text-xs font-mono text-purple-300">
                        {item.grade}
                      </span>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Relevant Coursework */}
                {item.coursework && item.coursework.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Key Academic Coursework</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.coursework.map((course, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>Academic Recognitions</span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

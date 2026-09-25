"use client";

import React, { useState } from "react";
import { 
  Code2, 
  Globe, 
  BrainCircuit, 
  Database, 
  Wrench, 
  Cpu, 
  Terminal, 
  Sparkles,
  Bot,
  Atom,
  Server,
  Layers,
  FileCode2,
  HardDrive,
  GitBranch,
  Github,
  BarChart3,
  Palette,
  Wind,
  Network,
  Eye,
  Coffee
} from "lucide-react";
import { Skill, SkillCategory } from "@/lib/supabase/types";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories: { label: string; value: string; icon: any }[] = [
    { label: "All Skills", value: "All", icon: Sparkles },
    { label: "AI & Machine Learning", value: "AI & Machine Learning", icon: BrainCircuit },
    { label: "Programming", value: "Programming", icon: Code2 },
    { label: "Web Development", value: "Web Development", icon: Globe },
    { label: "Database", value: "Database", icon: Database },
    { label: "Tools", value: "Tools", icon: Wrench },
  ];

  const getSkillIcon = (name: string, iconName?: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("python")) return <Code2 className="w-5 h-5 text-yellow-400" />;
    if (lower.includes("java") && !lower.includes("script")) return <Coffee className="w-5 h-5 text-red-400" />;
    if (lower === "c" || lower.includes("c++")) return <Cpu className="w-5 h-5 text-blue-400" />;
    if (lower.includes("javascript")) return <FileCode2 className="w-5 h-5 text-yellow-300" />;
    if (lower.includes("html")) return <Globe className="w-5 h-5 text-orange-400" />;
    if (lower.includes("css")) return <Palette className="w-5 h-5 text-blue-400" />;
    if (lower.includes("react")) return <Atom className="w-5 h-5 text-cyan-400" />;
    if (lower.includes("next")) return <Layers className="w-5 h-5 text-white" />;
    if (lower.includes("tailwind")) return <Wind className="w-5 h-5 text-teal-400" />;
    if (lower.includes("deep learning")) return <Network className="w-5 h-5 text-purple-400" />;
    if (lower.includes("machine learning")) return <BrainCircuit className="w-5 h-5 text-cyan-400" />;
    if (lower.includes("nlp")) return <Sparkles className="w-5 h-5 text-emerald-400" />;
    if (lower.includes("generative") || lower.includes("llm")) return <Bot className="w-5 h-5 text-pink-400" />;
    if (lower.includes("vision")) return <Eye className="w-5 h-5 text-indigo-400" />;
    if (lower.includes("mysql") || lower.includes("sql")) return <Server className="w-5 h-5 text-blue-300" />;
    if (lower.includes("mongodb")) return <HardDrive className="w-5 h-5 text-green-400" />;
    if (lower.includes("git") && !lower.includes("hub")) return <GitBranch className="w-5 h-5 text-orange-500" />;
    if (lower.includes("github")) return <Github className="w-5 h-5 text-white" />;
    if (lower.includes("vs code")) return <Terminal className="w-5 h-5 text-blue-400" />;
    if (lower.includes("power bi")) return <BarChart3 className="w-5 h-5 text-yellow-500" />;

    return <Sparkles className="w-5 h-5 text-cyan-400" />;
  };

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            02 &bull; TECHNICAL ARSENAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Skills & <span className="text-gradient-cyan-purple">Competencies</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Specialized engineering toolkit cultivated through academic rigor, hands-on implementations, and continuous problem-solving.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow"
                    : "bg-gray-900/60 text-gray-400 border border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel glass-panel-hover p-4 rounded-xl border border-white/10 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-gray-900/80 border border-white/10 group-hover:scale-110 transition-transform">
                  {getSkillIcon(skill.name, skill.icon_name)}
                </div>
                {skill.proficiency_level && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                    {skill.proficiency_level}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {skill.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No skills found in this category. Manage your skills in Admin Dashboard.
          </div>
        )}

      </div>
    </section>
  );
}

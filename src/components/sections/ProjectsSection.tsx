"use client";

import React, { useState } from "react";
import { 
  Github, 
  ExternalLink, 
  Layers, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import { Project, ProjectCategory } from "@/lib/supabase/types";
import Modal from "../ui/Modal";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories: ProjectCategory[] = [
    "All",
    "AI/ML",
    "Generative AI",
    "Data Science",
    "Full Stack",
    "Web Development",
    "Other"
  ];

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative bg-[#040816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            03 &bull; FEATURED WORK
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Intelligent <span className="text-gradient-cyan-purple">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Engineered systems highlighting machine learning architectures, high-performance APIs, and interactive applications.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow"
                  : "bg-gray-900/60 text-gray-400 border border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between cursor-pointer group"
            >
              {/* Image Preview with Category Badge */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-900">
                {project.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                    <Layers className="w-12 h-12" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-80" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-900/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300">
                    {project.category}
                  </span>
                </div>

                {/* Date Pill */}
                {project.date && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 backdrop-blur-md text-gray-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {project.date}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </div>

                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                {/* Tech badges */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-cyan-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div 
                    className="flex items-center gap-3 pt-3 border-t border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-gray-400" />
                        <span>Code</span>
                      </a>
                    )}
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No projects found in this category.
          </div>
        )}

        {/* Detailed Project Modal */}
        {activeModalProject && (
          <Modal
            isOpen={Boolean(activeModalProject)}
            onClose={() => setActiveModalProject(null)}
            title={activeModalProject.title}
            maxWidth="2xl"
          >
            <div className="space-y-6">
              {/* Modal Image */}
              {activeModalProject.image_url && (
                <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-900 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalProject.image_url}
                    alt={activeModalProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  {activeModalProject.category}
                </span>
                {activeModalProject.date && (
                  <span className="text-xs text-gray-400 font-mono">
                    Completed: {activeModalProject.date}
                  </span>
                )}
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Overview & Architecture
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {activeModalProject.detailed_description || activeModalProject.short_description}
                </p>
              </div>

              {/* Features list */}
              {activeModalProject.features && activeModalProject.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Key Features & Technical Innovations
                  </h4>
                  <ul className="space-y-2">
                    {activeModalProject.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                {activeModalProject.github_url && (
                  <a
                    href={activeModalProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-900 border border-white/15 text-white hover:border-cyan-400 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {activeModalProject.live_demo_url && (
                  <a
                    href={activeModalProject.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-90 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live Application</span>
                  </a>
                )}
              </div>

            </div>
          </Modal>
        )}

      </div>
    </section>
  );
}

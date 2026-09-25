"use client";

import React from "react";
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Award,
  Layers,
  Code2
} from "lucide-react";
import { Profile } from "@/lib/supabase/types";

interface AboutSectionProps {
  profile: Profile;
  stats: {
    projectsCount: number;
    certificatesCount: number;
    skillsCount: number;
    achievementsCount: number;
  };
}

export default function AboutSection({ profile, stats }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 relative bg-[#040816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            01 &bull; GET TO KNOW ME
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            About <span className="text-gradient-cyan-purple">My Journey</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Bridging foundational computer science theory with intelligent machine learning systems and production software.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Profile Card with Photo & Key Academic Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
              
              {/* Photo */}
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-gradient-to-tr from-cyan-900 to-gray-900 p-1 mb-6 border border-cyan-500/30 shadow-glow">
                {profile.profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-[#090d16] rounded-xl text-cyan-400">
                    <GraduationCap className="w-8 h-8 mb-1" />
                    <span className="text-[10px] text-gray-400 font-mono">B.Tech Student</span>
                  </div>
                )}
              </div>

              {/* Bio summary */}
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-xl font-bold text-white">
                  {profile.full_name}
                </h3>
                <p className="text-xs text-cyan-400 font-medium">
                  {profile.degree} in {profile.branch}
                </p>
              </div>

              {/* Metadata details */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Institution</span>
                    <span className="text-gray-200 font-medium">{profile.college}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Location</span>
                    <span className="text-gray-200 font-medium">{profile.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Email</span>
                    <a href={`mailto:${profile.email}`} className="text-cyan-400 hover:underline break-all">
                      {profile.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Live Database Statistics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {stats.projectsCount}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Projects Built</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-extrabold text-purple-400 font-mono">
                  {stats.certificatesCount}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Certificates</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-extrabold text-blue-400 font-mono">
                  {stats.skillsCount}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Core Skills</div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {stats.achievementsCount}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Achievements</div>
              </div>
            </div>

          </div>

          {/* Right Column: Narrative, Objectives, Interests */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Career Objective Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <Target className="w-5 h-5" />
                <span>Career Objective</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {profile.career_objective}
              </p>
            </div>

            {/* Biography */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                <BookOpen className="w-5 h-5" />
                <span>Background & Philosophy</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {profile.short_bio}
              </p>
            </div>

            {/* Interests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Career Interests */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>Target Roles & Domains</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.career_interests?.map((interest, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-lg text-xs bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Interests */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Lightbulb className="w-4 h-4" />
                  <span>Technical Focus Areas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.technical_interests?.map((interest, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-lg text-xs bg-purple-950/40 text-purple-300 border border-purple-500/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

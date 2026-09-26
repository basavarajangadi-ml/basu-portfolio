"use client";

import React from "react";
import { 
  ArrowRight, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Terminal, 
  Sparkles, 
  Bot,
  Brain,
  Code
} from "lucide-react";
import { Profile, SocialLink } from "@/lib/supabase/types";

interface HeroSectionProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
  const githubLink = socialLinks?.find(s => s.platform.toLowerCase() === 'github')?.url 
    || `https://github.com/${profile.github_username}`;
    
  const linkedinLink = socialLinks?.find(s => s.platform.toLowerCase() === 'linkedin')?.url 
    || profile.linkedin_url;

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden ai-background ai-grid"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Professional Intro & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Available for Internships & Placement Roles</span>
            </div>

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <p className="text-gray-400 font-mono text-sm tracking-wide">
                Hi, I&apos;m
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                <span className="text-gradient-cyan-purple">
                  {profile.full_name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-gray-200 flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span>{profile.tagline.split('|')[0] || "AI & Machine Learning Student"}</span>
                <span className="text-cyan-400 hidden sm:inline">&bull;</span>
                <span className="text-gray-400 text-lg font-normal">{profile.tagline.split('|')[1] || "Developer"}</span>
              </p>
            </div>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              {profile.short_bio}
            </p>

            {/* Key AI/Engineering Highlight Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-cyan-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" /> Deep Learning
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-purple-300 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" /> GenAI & LLMs
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-blue-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" /> Full Stack Dev
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {profile.resume_url ? (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-900/90 border border-white/15 text-gray-200 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <a
                  href="#resume"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gray-900/90 border border-white/15 text-gray-200 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Resume</span>
                </a>
              )}

              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-transparent border border-white/15 text-gray-300 hover:text-white hover:border-white/30 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                Follow & Connect:
              </span>
              <div className="flex items-center gap-2.5">
                {githubLink && (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="p-2.5 rounded-lg bg-gray-900/80 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 hover:bg-gray-800 transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedinLink && (
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2.5 rounded-lg bg-gray-900/80 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 hover:bg-gray-800 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send Email"
                  className="p-2.5 rounded-lg bg-gray-900/80 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 hover:bg-gray-800 transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Prominent Profile Photo */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group">
              
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-65 transition-all duration-700 animate-pulse-slow" />
              
              {/* Profile Image Container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2 bg-[#0b1120] border border-cyan-500/40 shadow-2xl avatar-halo flex items-center justify-center overflow-hidden">
                {profile.profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  /* Elegant AI Engineer Placeholder */
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#111827] to-[#0a0e1a] flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Brain className="w-10 h-10" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wider font-mono">
                      {profile.full_name && !profile.full_name.includes("[YOUR") ? profile.full_name : "Basavaraj M Angadi"}
                    </span>
                    <span className="text-xs text-cyan-400 mt-1 font-mono">
                      B.Tech AI & ML
                    </span>
                    <span className="text-[11px] text-gray-500 mt-2 max-w-[200px]">
                      Upload your real photo in Admin Dashboard &rarr; Profile Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Technology Badge */}
              <div className="absolute -bottom-2 -left-4 bg-[#0d1527]/90 border border-cyan-500/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl flex items-center gap-3 animate-float">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">AI & ML Focus</div>
                  <div className="text-[10px] text-gray-400">Class of 2027</div>
                </div>
              </div>

              {/* Floating Code Badge */}
              <div className="absolute -top-3 -right-2 bg-[#0d1527]/90 border border-purple-500/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl hidden sm:flex items-center gap-3 animate-float [animation-delay:2s]">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Full-Stack / Python</div>
                  <div className="text-[10px] text-purple-300">Clean Architecture</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

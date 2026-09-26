"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { Profile, SocialLink } from "@/lib/supabase/types";

interface FooterProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export default function Footer({ profile, socialLinks }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#02050c] relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-mono text-sm shadow-glow">
                AI
              </div>
              <span className="font-bold text-lg text-white">
                {profile.full_name}
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {profile.tagline}. Driven by data intelligence, modern full-stack development, and creating high-impact real-world software.
            </p>
            <p className="text-xs text-gray-500">
              {profile.degree} in {profile.branch} &bull; {profile.college}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-cyan-400 transition-colors">Technical Skills</a></li>
              <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Featured Projects</a></li>
              <li><a href="#certificates" className="hover:text-cyan-400 transition-colors">Certifications</a></li>
              <li><a href="#education" className="hover:text-cyan-400 transition-colors">Education & Experience</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              <li className="pt-2 border-t border-white/10">
                <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors">
                  <span>🔐 Admin Portal Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-lg bg-gray-900 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-lg bg-gray-900 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="p-2.5 rounded-lg bg-gray-900 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {currentYear} {profile.full_name}. Built for professional opportunities, internships & placements.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

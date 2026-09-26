"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Download, 
  Github, 
  Linkedin, 
  FileText,
  Shield,
  ExternalLink
} from "lucide-react";
import { Profile, SocialLink } from "@/lib/supabase/types";

interface NavbarProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export default function Navbar({ profile, socialLinks }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Certificates", href: "#certificates" },
    { label: "Education", href: "#education" },
    { label: "Experience", href: "#experience" },
    { label: "Achievements", href: "#achievements" },
    { label: "Resume", href: "#resume" },
    { label: "Contact", href: "#contact" },
  ];

  const githubLink = socialLinks?.find(s => s.platform.toLowerCase() === 'github')?.url 
    || `https://github.com/${profile.github_username}`;
    
  const linkedinLink = socialLinks?.find(s => s.platform.toLowerCase() === 'linkedin')?.url 
    || profile.linkedin_url;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#030712]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Personal Name */}
          <Link 
            href="#hero" 
            className="flex items-center gap-2 group text-white font-bold tracking-tight text-lg sm:text-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-mono text-sm shadow-glow group-hover:scale-105 transition-transform">
              AI
            </div>
            <span className="font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">
              {profile.full_name}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 hover:after:w-full after:transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Socials */}
          <div className="hidden lg:flex items-center gap-3">
            {/* GitHub */}
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-lg bg-gray-900/60 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {/* LinkedIn */}
            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-lg bg-gray-900/60 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-800 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {/* Resume Button */}
            {profile.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Resume
              </a>
            ) : (
              <a
                href="#resume"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Resume
              </a>
            )}

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg bg-gray-900/80 border border-white/10 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="xl:hidden bg-[#0a0f1d]/95 backdrop-blur-xl border-b border-white/10 px-6 pt-4 pb-6 transition-all duration-300 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-300 hover:text-cyan-400 py-1.5 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
            
            <div className="pt-4 flex flex-col gap-3">
              {profile.resume_url ? (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              ) : (
                <a
                  href="#resume"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </a>
              )}

              <div className="flex items-center justify-center gap-4 pt-2">
                {githubLink && (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-gray-900 border border-white/10 text-gray-300 hover:text-white"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {linkedinLink && (
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-gray-900 border border-white/10 text-gray-300 hover:text-white"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ResumeSection from "@/components/sections/ResumeSection";
import GithubSection from "@/components/sections/GithubSection";
import ContactSection from "@/components/sections/ContactSection";

import { 
  Profile, 
  Project, 
  Certificate, 
  Skill, 
  Education, 
  Experience, 
  Achievement, 
  SocialLink, 
  PortfolioSettings 
} from "@/lib/supabase/types";
import { portfolioService } from "@/lib/data/portfolioService";

interface PortfolioClientProps {
  initialData: {
    profile: Profile;
    projects: Project[];
    certificates: Certificate[];
    skills: Skill[];
    education: Education[];
    experience: Experience[];
    achievements: Achievement[];
    socialLinks: SocialLink[];
    settings: PortfolioSettings;
  };
}

export default function PortfolioClient({ initialData }: PortfolioClientProps) {
  const [profile, setProfile] = useState<Profile>(initialData.profile);
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [certificates, setCertificates] = useState<Certificate[]>(initialData.certificates);
  const [skills, setSkills] = useState<Skill[]>(initialData.skills);
  const [education, setEducation] = useState<Education[]>(initialData.education);
  const [experience, setExperience] = useState<Experience[]>(initialData.experience);
  const [achievements, setAchievements] = useState<Achievement[]>(initialData.achievements);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData.socialLinks);
  const [settings, setSettings] = useState<PortfolioSettings>(initialData.settings);
  const [stats, setStats] = useState({
    projectsCount: initialData.projects.length,
    certificatesCount: initialData.certificates.length,
    skillsCount: initialData.skills.length,
    achievementsCount: initialData.achievements.length,
  });

  const lastJsonRef = useRef<string>("");

  const refreshLivePortfolio = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", {
        cache: "no-store",
        headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
      });

      if (!res.ok) return;
      const json = await res.json();
      if (!json.success || !json.data) return;

      const stringified = JSON.stringify(json.data);
      // Only trigger re-render if data actually changed
      if (stringified === lastJsonRef.current) return;
      lastJsonRef.current = stringified;

      const d = json.data;
      if (d.profile) setProfile(d.profile);
      if (d.projects) setProjects(d.projects);
      if (d.certificates) setCertificates(d.certificates);
      if (d.skills) setSkills(d.skills);
      if (d.education) setEducation(d.education);
      if (d.experience) setExperience(d.experience);
      if (d.achievements) setAchievements(d.achievements);
      if (d.socialLinks) setSocialLinks(d.socialLinks);
      if (d.settings) setSettings(d.settings);

      setStats({
        projectsCount: d.projects ? d.projects.length : 0,
        certificatesCount: d.certificates ? d.certificates.length : 0,
        skillsCount: d.skills ? d.skills.length : 0,
        achievementsCount: d.achievements ? d.achievements.length : 0,
      });
    } catch (err) {
      // Non-blocking background sync error
    }
  }, []);

  useEffect(() => {
    lastJsonRef.current = JSON.stringify(initialData);

    // Sync any previous localStorage edits up to the server if not yet synced
    portfolioService.syncLocalToServerIfAvailable();

    // 1. Fast polling every 3.5 seconds to guarantee mobile and other tabs see changes immediately
    const interval = setInterval(() => {
      // Only poll when the document is visible to save battery/bandwidth on mobile
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refreshLivePortfolio();
      }
    }, 3500);

    // 2. Immediate refresh on window focus / tab switch
    const handleFocusOrVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        refreshLivePortfolio();
      }
    };
    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    // 3. Immediate update when an edit occurs in the same browser session
    const handleLocalUpdate = () => refreshLivePortfolio();
    window.addEventListener("portfolio-updated", handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
      window.removeEventListener("portfolio-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
    };
  }, [initialData, refreshLivePortfolio]);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sticky Navigation */}
      <Navbar profile={profile} socialLinks={socialLinks} />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection profile={profile} socialLinks={socialLinks} />
        <AboutSection profile={profile} stats={stats} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <AchievementsSection achievements={achievements} />
        <ResumeSection profile={profile} />
        <GithubSection username={profile.github_username || settings.github_username} />
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>

      {/* Footer */}
      <Footer profile={profile} socialLinks={socialLinks} />

    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
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

import { portfolioService } from "@/lib/data/portfolioService";
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
import { 
  initialProfile, 
  initialSkills, 
  initialProjects, 
  initialCertificates, 
  initialEducation, 
  initialExperience, 
  initialAchievements, 
  initialSocialLinks, 
  initialSettings 
} from "@/lib/data/initialData";

export default function Home() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [settings, setSettings] = useState<PortfolioSettings>(initialSettings);
  const [stats, setStats] = useState({
    projectsCount: initialProjects.length,
    certificatesCount: initialCertificates.length,
    skillsCount: initialSkills.length,
    achievementsCount: initialAchievements.length,
  });

  const loadData = async () => {
    try {
      const [
        profileData,
        projectsData,
        certsData,
        skillsData,
        eduData,
        expData,
        achData,
        socialData,
        settingsData,
        statsData
      ] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getProjects(),
        portfolioService.getCertificates(),
        portfolioService.getSkills(),
        portfolioService.getEducation(),
        portfolioService.getExperience(),
        portfolioService.getAchievements(),
        portfolioService.getSocialLinks(),
        portfolioService.getSettings(),
        portfolioService.getStats(),
      ]);

      setProfile(profileData);
      setProjects(projectsData);
      setCertificates(certsData);
      setSkills(skillsData);
      setEducation(eduData);
      setExperience(expData);
      setAchievements(achData);
      setSocialLinks(socialData);
      setSettings(settingsData);
      setStats({
        projectsCount: statsData.projectsCount,
        certificatesCount: statsData.certificatesCount,
        skillsCount: statsData.skillsCount,
        achievementsCount: statsData.achievementsCount,
      });
    } catch (err) {
      console.error("Failed to load portfolio live data:", err);
    }
  };

  useEffect(() => {
    loadData();
    // Listen for storage events (e.g., if updated from admin dashboard in another tab)
    const handleStorageUpdate = () => loadData();
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { 
  FolderGit2, 
  Award, 
  Wrench, 
  Trophy, 
  Briefcase, 
  UserCheck, 
  ArrowUpRight, 
  Plus, 
  Camera, 
  FileText, 
  Mail,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { portfolioService } from "@/lib/data/portfolioService";
import { Profile, Project, Certificate } from "@/lib/supabase/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    certificatesCount: 0,
    skillsCount: 0,
    achievementsCount: 0,
    experienceCount: 0,
    recentProjects: [] as Project[],
    recentCertificates: [] as Certificate[],
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, profileData, messages] = await Promise.all([
        portfolioService.getStats(),
        portfolioService.getProfile(),
        portfolioService.getContactMessages(),
      ]);

      setStats(statsData);
      setProfile(profileData);
      setUnreadMessages(messages.filter(m => !m.is_read).length);
    };

    fetchData();
  }, []);

  // Calculate Profile Completion %
  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    const totalFields = 8;
    if (profile.full_name && !profile.full_name.includes("[YOUR")) score++;
    if (profile.profile_photo_url) score++;
    if (profile.short_bio) score++;
    if (profile.college && !profile.college.includes("[YOUR")) score++;
    if (profile.resume_url) score++;
    if (profile.github_username && !profile.github_username.includes("[GITHUB")) score++;
    if (profile.linkedin_url && !profile.linkedin_url.includes("[LINKEDIN")) score++;
    if (profile.career_interests && profile.career_interests.length > 0) score++;
    return Math.round((score / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <AdminHeader
        title="Portfolio Overview"
        subtitle="Manage personal records, intelligent project showcases, certificates, and live inquiries."
      />

      {/* Profile Completion Callout */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-glow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Profile Readiness
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              {completionPercentage}% Complete
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {completionPercentage === 100 
              ? "Your portfolio is 100% complete and recruiter-ready!" 
              : "Complete your personal details for optimal recruiter engagement"}
          </h3>
          <p className="text-xs text-gray-400 max-w-xl">
            {profile?.profile_photo_url ? "Profile photo uploaded. " : "Upload your profile photo. "}
            {profile?.resume_url ? "Resume PDF attached. " : "Upload latest resume. "}
            Replace default placeholders with your verified college and name.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>Placeholders</span>
            <span>Live Ready</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Projects */}
        <Link href="/admin/projects" className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.projectsCount}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Total Projects</div>
          </div>
        </Link>

        {/* Certificates */}
        <Link href="/admin/certificates" className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.certificatesCount}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Total Certificates</div>
          </div>
        </Link>

        {/* Skills */}
        <Link href="/admin/skills" className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.skillsCount}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Total Skills</div>
          </div>
        </Link>

        {/* Achievements */}
        <Link href="/admin/achievements" className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.achievementsCount}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Achievements</div>
          </div>
        </Link>

        {/* Experience */}
        <Link href="/admin/experience" className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">{stats.experienceCount}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Experience Items</div>
          </div>
        </Link>

      </div>

      {/* Quick Operations Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/photo"
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-cyan-400 transition-all"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Update Profile Photo</span>
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-cyan-400 transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add New Project</span>
          </Link>
          <Link
            href="/admin/certificates"
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-purple-400 transition-all"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Add Certificate</span>
          </Link>
          <Link
            href="/admin/resume"
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-emerald-400 transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Upload Latest Resume</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Projects */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span>Recent Projects</span>
            </h3>
            <Link href="/admin/projects" className="text-xs text-cyan-400 hover:underline">
              Manage All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentProjects.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-gray-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white line-clamp-1">{p.title}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{p.category} &bull; {p.date}</div>
                </div>
                <Link
                  href="/admin/projects"
                  className="px-2.5 py-1 rounded bg-white/5 text-[11px] text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Recent Certificates</span>
            </h3>
            <Link href="/admin/certificates" className="text-xs text-purple-400 hover:underline">
              Manage All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentCertificates.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-gray-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white line-clamp-1">{c.title}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{c.issuing_organization} &bull; {c.issue_date}</div>
                </div>
                <Link
                  href="/admin/certificates"
                  className="px-2.5 py-1 rounded bg-white/5 text-[11px] text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

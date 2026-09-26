"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Camera, 
  FolderGit2, 
  Award, 
  Wrench, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  FileText, 
  Share2, 
  Mail, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, user, isSupabaseActive } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Profile Photo", href: "/admin/photo", icon: Camera },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "Skills", href: "/admin/skills", icon: Wrench },
    { label: "Education", href: "/admin/education", icon: GraduationCap },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Achievements", href: "/admin/achievements", icon: Trophy },
    { label: "Resume", href: "/admin/resume", icon: FileText },
    { label: "Social Links", href: "/admin/social", icon: Share2 },
    { label: "Contact Messages", href: "/admin/messages", icon: Mail },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#080d1a] border-b border-white/10 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2 text-white font-bold">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs">
            AI
          </div>
          <span className="text-sm">Admin Dashboard</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg bg-gray-900 border border-white/10"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#080d1a] border-r border-white/10 flex flex-col justify-between transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo / Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-glow">
                AI
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">
                  PORTFOLIO
                </div>
                <div className="text-[10px] font-mono text-cyan-400">
                  Control Center
                </div>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </Link>
              );
            })}
          </div>

          {/* Footer Area */}
          <div className="p-4 border-t border-white/10 bg-[#060a14] space-y-3">
            
            {/* View live public site */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-gray-900 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/40 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Public Portfolio</span>
            </Link>

            {/* User status */}
            <div className="flex items-center justify-between pt-1">
              <div className="truncate pr-2">
                <p className="text-xs font-medium text-white truncate">
                  {user?.email || "Admin User"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseActive ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span className="text-[10px] text-gray-400">
                    {isSupabaseActive ? "Supabase Live" : "Local Mode"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}

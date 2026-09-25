"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Database, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const { isSupabaseActive } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Indicator */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border ${
          isSupabaseActive
            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
            : "bg-amber-950/40 border-amber-500/30 text-amber-300"
        }`}>
          <Database className="w-3.5 h-3.5" />
          <span>{isSupabaseActive ? "Supabase Connected" : "Local Storage Mode"}</span>
        </div>

        {action}
      </div>
    </div>
  );
}

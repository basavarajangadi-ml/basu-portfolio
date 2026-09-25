"use client";

import React from "react";
import { 
  Trophy, 
  Award, 
  Calendar, 
  ExternalLink, 
  Building2, 
  Code2, 
  Flame, 
  Sparkles,
  Medal
} from "lucide-react";
import { Achievement } from "@/lib/supabase/types";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Hackathon":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "Competition":
      case "Award":
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case "Coding":
        return <Code2 className="w-4 h-4 text-cyan-400" />;
      case "Workshop":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Medal className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative bg-[#040816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            07 &bull; HONORS & MILESTONES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Key <span className="text-gradient-cyan-purple">Achievements</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Hackathon recognitions, competitive programming milestones, technical leadership, and workshop mentorship.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-900/80 border border-white/10 text-xs font-mono">
                    {getCategoryIcon(item.category)}
                    <span className="text-gray-300">{item.category}</span>
                  </div>

                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>

                  {item.organization && (
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-medium">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{item.organization}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action / Link */}
              {item.link_url && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Proof & Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No achievements listed yet. Manage achievements in Admin Dashboard.
          </div>
        )}

      </div>
    </section>
  );
}

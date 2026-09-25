"use client";

import React, { useEffect, useState } from "react";
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Code2, 
  FolderGit2,
  RefreshCw 
} from "lucide-react";

interface GithubSectionProps {
  username: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export default function GithubSection({ username }: GithubSectionProps) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRealUsername = username && !username.includes("[GITHUB") && username.trim().length > 0;

  useEffect(() => {
    if (!isRealUsername) return;

    const fetchGithubRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!res.ok) {
          throw new Error("Unable to fetch GitHub repositories at this time.");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setRepos(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load repos");
      } finally {
        setLoading(false);
      }
    };

    fetchGithubRepos();
  }, [username, isRealUsername]);

  const profileUrl = isRealUsername ? `https://github.com/${username}` : "https://github.com";

  return (
    <section id="github" className="py-24 relative bg-[#040816] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            09 &bull; OPEN SOURCE ACTIVITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            GitHub <span className="text-gradient-cyan-purple">Contributions</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Live repositories, automated pipelines, open-source codebases, and technical commits.
          </p>
        </div>

        {/* Real Repos Grid if fetched */}
        {isRealUsername && repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FolderGit2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {repo.name}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {repo.description || "Public open-source repository."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-gray-400 font-mono">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {repo.language}
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-purple-400" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Placeholder / configuration box */
          <div className="max-w-2xl mx-auto glass-panel p-8 sm:p-10 rounded-2xl border border-white/10 text-center mb-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-2">
              <Github className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">
              GitHub Repositories Showcase
            </h3>

            <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              {isRealUsername 
                ? `Connecting to GitHub profile @${username}...` 
                : "Set your real GitHub username in Admin Dashboard &rarr; Settings to display live repositories, languages, and star statistics."}
            </p>
          </div>
        )}

        {/* View Profile Action */}
        <div className="text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gray-900 border border-white/15 text-white hover:border-cyan-400 hover:bg-gray-800 transition-all shadow-lg"
          >
            <Github className="w-4 h-4" />
            <span>View GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>

      </div>
    </section>
  );
}

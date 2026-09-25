"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { Profile, SocialLink } from "@/lib/supabase/types";
import { portfolioService } from "@/lib/data/portfolioService";

interface ContactSectionProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export default function ContactSection({ profile, socialLinks }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeyPot: "", // Anti-spam trap field
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const githubLink = socialLinks?.find(s => s.platform.toLowerCase() === 'github')?.url 
    || `https://github.com/${profile.github_username}`;
    
  const linkedinLink = socialLinks?.find(s => s.platform.toLowerCase() === 'linkedin')?.url 
    || profile.linkedin_url;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (formData.honeyPot) {
      setStatus("success");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields.");
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await portfolioService.submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "Inquiry from Portfolio",
        message: formData.message.trim(),
      });

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeyPot: "",
      });
    } catch (err: any) {
      console.error("Submission failed", err);
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again or reach out directly via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#030712] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            10 &bull; GET IN TOUCH
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Contact & <span className="text-gradient-cyan-purple">Collaboration</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Reach out for internship opportunities, technical collaborations, or recruitment queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white">
                Contact Information
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-mono block">Email</span>
                    <a 
                      href={`mailto:${profile.email}`} 
                      className="text-white hover:text-cyan-400 font-medium transition-colors break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-mono block">Location</span>
                    <span className="text-white font-medium">
                      {profile.location}
                    </span>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-mono block">LinkedIn</span>
                    <a 
                      href={linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-medium"
                    >
                      View LinkedIn Profile &rarr;
                    </a>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gray-800 text-gray-300 border border-white/10 flex-shrink-0">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-mono block">GitHub</span>
                    <a 
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-medium"
                    >
                      @{profile.github_username}
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Recruiter Guarantee Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 text-xs text-gray-300 leading-relaxed">
              <span className="font-semibold text-cyan-300 block mb-1">Recruiter Notice:</span>
              I monitor messages daily and promptly reply to inquiries regarding internships, developer roles, and hackathons.
            </div>

          </div>

          {/* Interactive Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative">
              
              <h3 className="text-xl font-bold text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill out the form below and your message will be forwarded directly to the portfolio inbox.
              </p>

              {status === "success" && (
                <div className="p-4 mb-6 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>Thank you! Your message has been sent successfully. I will get back to you soon.</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 mb-6 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Honeypot field (hidden from genuine users to prevent automated bots) */}
                <input
                  type="text"
                  name="honeyPot"
                  value={formData.honeyPot}
                  onChange={(e) => setFormData({ ...formData, honeyPot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      Your Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Internship Opportunity / Technical Query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                    Message <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Hello! We are looking for an AI/ML intern at..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

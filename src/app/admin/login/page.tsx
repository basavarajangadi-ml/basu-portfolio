"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Database,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password & OTP state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [otpStep, setOtpStep] = useState<"enter-email" | "enter-otp">("enter-email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);

  const { signIn, isSupabaseActive } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Authentication failed. Access denied.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setOtpSentNotice(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpStep("enter-otp");
        if (data.otpCode) {
          setOtpSentNotice(`6-digit OTP generated! Code: ${data.otpCode}`);
        } else {
          setSuccessMsg("Verification code sent to your email!");
        }
      } else {
        setError(data.error || "Failed to send OTP. Please check your email.");
      }
    } catch (err: any) {
      setError("Server error while requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: otpCode.trim(),
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Save to client vault for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("portfolio_admin_vault_pass", newPassword);
        }
        setSuccessMsg("Password reset successfully! Please sign in with your new password.");
        setEmail(forgotEmail);
        setPassword("");
        setIsForgotMode(false);
        setOtpStep("enter-email");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpSentNotice(null);
      } else {
        setError(data.error || "Invalid or expired OTP code.");
      }
    } catch (err: any) {
      setError("Server error during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] ai-background ai-grid flex items-center justify-center p-4">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="text-xs font-mono text-gray-500">Owner Access</span>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow mb-3">
              {isForgotMode ? <KeyRound className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isForgotMode ? "Reset Admin Password" : "Admin Authentication"}
            </h1>
            <p className="text-xs text-gray-400">
              {isForgotMode
                ? "Verify with a 6-digit OTP to safely recover your admin account."
                : "Private dashboard access for managing portfolio content and assets."}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              isSupabaseActive 
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : "bg-cyan-950/40 border-cyan-500/30 text-cyan-300"
            }`}>
              <Database className="w-3 h-3" />
              <span>{isSupabaseActive ? "Supabase Cloud Auth" : "Owner Vault Protected"}</span>
            </span>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Notice */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* OTP Code Notice for owner */}
          {otpSentNotice && (
            <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{otpSentNotice}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Valid for 10 minutes. Enter below to reset your password.</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LOGIN FORM */}
          {/* ========================================================================= */}
          {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-gray-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotEmail(email || "");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* ========================================================================= */
            /* FORGOT PASSWORD & OTP FORM */
            /* ========================================================================= */
            <div className="space-y-4">
              
              {otpStep === "enter-email" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      Your Registered Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yourname@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      We will generate a 6-digit OTP code to verify your identity.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !forgotEmail}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white font-mono text-center tracking-widest text-lg focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Re-type new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-white/10 text-white placeholder-gray-600 text-sm focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpStep("enter-email")}
                      className="text-gray-400 hover:text-gray-300 font-mono"
                    >
                      Change Email
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6 || !newPassword}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Resetting...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify OTP & Set Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Back to Login link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setOtpStep("enter-email");
                    setError(null);
                    setOtpSentNotice(null);
                  }}
                  className="text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  &larr; Back to Admin Sign In
                </button>
              </div>

            </div>
          )}

          <div className="pt-2 border-t border-white/5 text-center">
            <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
              Authorized access only. Strictly protected for site owner.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
